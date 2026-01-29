import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { api } from "./_generated/api"
import { requireAdmin, requireOrgPermission, requireUser, toSlug } from "./helpers"

export const getById = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
  },
})

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    const orgs = await Promise.all(
      memberships.map((membership) => ctx.db.get(membership.orgId))
    )

    return orgs.filter(Boolean)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    const orgs = await Promise.all(memberships.map((membership) => ctx.db.get(membership.orgId)))
    return orgs.filter(Boolean)
  },
})

export const createForCurrentUser = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const settings = await ctx.runQuery(api.appSettings.getPublic, {})
    if (!settings.workspacesEnabled) {
      throw new Error("Workspaces are disabled")
    }
    const baseSlug = toSlug(args.slug || args.name)
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", baseSlug))
      .first()

    const slug = existing ? `${baseSlug}-${Math.random().toString(16).slice(2, 8)}` : baseSlug
    const now = Date.now()
    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("memberships", {
      orgId,
      userId,
      role: "OWNER",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.patch(userId, {
      currentOrgId: orgId,
      updatedAt: now,
    })

    return orgId
  },
})

export const switchCurrentOrg = mutation({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const settings = await ctx.runQuery(api.appSettings.getPublic, {})
    if (!settings.workspacesEnabled) {
      throw new Error("Workspaces are disabled")
    }
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", args.orgId).eq("userId", userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()

    if (!membership || membership.status !== "ACTIVE") {
      throw new Error("No access to org")
    }

    await ctx.db.patch(userId, {
      currentOrgId: args.orgId,
      updatedAt: Date.now(),
    })
  },
})

export const updateNameForCurrentOrg = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "org:write")
    await ctx.db.patch(orgId, {
      name: args.name,
      updatedAt: Date.now(),
    })
  },
})

export const updateSlugForCurrentOrg = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "org:write")
    await ctx.db.patch(orgId, {
      slug: toSlug(args.slug),
      updatedAt: Date.now(),
    })
  },
})

export const updateName = mutation({
  args: {
    id: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    })
  },
})

export const updateSlug = mutation({
  args: {
    id: v.id("organizations"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      slug: args.slug,
      updatedAt: Date.now(),
    })
  },
})

export const softDelete = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const orgs = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    // Enrich with member count
    const enriched = await Promise.all(
      orgs.map(async (org) => {
        const memberCount = await ctx.db
          .query("memberships")
          .withIndex("by_orgId", (q) => q.eq("orgId", org._id))
          .filter((q) => q.eq(q.field("deletedAt"), undefined))
          .collect()
        return {
          ...org,
          memberCount: memberCount.length,
        }
      })
    )

    return enriched
  },
})

export const deleteForCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const { orgId, userId, membership } = await requireCurrentOrg(ctx)
    
    // Only OWNER can delete the workspace
    if (membership.role !== "OWNER") {
      throw new Error("Only workspace owners can delete the workspace")
    }

    const now = Date.now()

    // Soft delete the org
    await ctx.db.patch(orgId, {
      deletedAt: now,
      updatedAt: now,
    })

    // Soft delete all memberships
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    await Promise.all(
      memberships.map((membership) =>
        ctx.db.patch(membership._id, {
          deletedAt: now,
          updatedAt: now,
        })
      )
    )

    // Handle users with this org as currentOrgId
    const affectedUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("currentOrgId"), orgId))
      .collect()

    await Promise.all(
      affectedUsers.map(async (user) => {
        // Find another active org for this user
        const otherMembership = await ctx.db
          .query("memberships")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .filter((q) =>
            q.and(
              q.neq(q.field("orgId"), orgId),
              q.eq(q.field("deletedAt"), undefined),
              q.eq(q.field("status"), "ACTIVE")
            )
          )
          .first()

        await ctx.db.patch(user._id, {
          currentOrgId: otherMembership?.orgId ?? undefined,
          updatedAt: now,
        })
      })
    )

    return orgId
  },
})

export const deleteAdmin = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const now = Date.now()

    // Soft delete the org
    await ctx.db.patch(args.id, {
      deletedAt: now,
      updatedAt: now,
    })

    // Soft delete all memberships
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.id))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    await Promise.all(
      memberships.map((membership) =>
        ctx.db.patch(membership._id, {
          deletedAt: now,
          updatedAt: now,
        })
      )
    )

    // Handle users with this org as currentOrgId
    const affectedUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("currentOrgId"), args.id))
      .collect()

    await Promise.all(
      affectedUsers.map(async (user) => {
        // Find another active org for this user
        const otherMembership = await ctx.db
          .query("memberships")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .filter((q) =>
            q.and(
              q.neq(q.field("orgId"), args.id),
              q.eq(q.field("deletedAt"), undefined),
              q.eq(q.field("status"), "ACTIVE")
            )
          )
          .first()

        await ctx.db.patch(user._id, {
          currentOrgId: otherMembership?.orgId ?? undefined,
          updatedAt: now,
        })
      })
    )

    return args.id
  },
})

