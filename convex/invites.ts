import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireCurrentOrg, requireOrgPermission, requireUser } from "./helpers"

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()
  },
})

export const listByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invites")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect()
  },
})

export const create = mutation({
  args: {
    orgId: v.id("organizations"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invites", {
      orgId: args.orgId,
      email: args.email,
      role: args.role,
      token: args.token,
      expiresAt: args.expiresAt,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    })
  },
})

export const accept = mutation({
  args: {
    id: v.id("invites"),
    acceptedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      acceptedBy: args.acceptedBy,
      acceptedAt: Date.now(),
    })
  },
})

export const revoke = mutation({
  args: { id: v.id("invites") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      revokedAt: Date.now(),
    })
  },
})

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "member:read")
    return await ctx.db
      .query("invites")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .collect()
  },
})

export const createForCurrentOrg = mutation({
  args: {
    email: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = await requireOrgPermission(ctx, "member:write")
    return await ctx.db.insert("invites", {
      orgId,
      email: args.email,
      role: args.role,
      token: args.token,
      expiresAt: args.expiresAt,
      createdBy: userId,
      createdAt: Date.now(),
    })
  },
})

export const acceptByToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (!invite) {
      throw new Error("Invite not found")
    }
    if (invite.revokedAt || invite.acceptedAt) {
      throw new Error("Invite no longer valid")
    }
    if (invite.expiresAt < Date.now()) {
      throw new Error("Invite expired")
    }

    const existingMembership = await ctx.db
      .query("memberships")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", invite.orgId).eq("userId", userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()

    if (!existingMembership) {
      await ctx.db.insert("memberships", {
        orgId: invite.orgId,
        userId,
        role: invite.role,
        status: "ACTIVE",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    await ctx.db.patch(invite._id, {
      acceptedBy: userId,
      acceptedAt: Date.now(),
    })

    return invite.orgId
  },
})

