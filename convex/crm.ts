import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"
import { requireOrgPermission } from "./helpers"

const STATUS_VALUES = ["lead", "active", "trial", "churned"] as const
const ONBOARDING_VALUES = ["not_started", "in_progress", "completed"] as const

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "crm:read")

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    const users = await Promise.all(memberships.map((membership) => ctx.db.get(membership.userId)))
    const crmRows = await ctx.db
      .query("crmCustomers")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    const crmByUserId = new Map(crmRows.map((row) => [row.userId, row]))
    const ownerIds = Array.from(
      new Set(crmRows.map((row) => row.ownerId).filter(Boolean))
    ) as Id<"users">[]
    const owners = await Promise.all(ownerIds.map((id) => ctx.db.get(id)))
    const ownerById = new Map<Id<"users">, Doc<"users">>(
      owners.filter(Boolean).map((owner) => [owner!._id, owner!])
    )

    return memberships.map((membership, index) => {
      const user = users[index]
      const crm = crmByUserId.get(membership.userId)
      const owner = crm?.ownerId ? ownerById.get(crm.ownerId) : null
      return {
        user: user
          ? {
              _id: user._id,
              email: user.email,
              name: user.name,
              createdAt: user.createdAt,
            }
          : null,
        membership: {
          role: membership.role,
          status: membership.status,
        },
        crm: crm
          ? {
              _id: crm._id,
              status: crm.status,
              onboardingStatus: crm.onboardingStatus,
              ownerId: crm.ownerId,
              ownerEmail: owner?.email ?? null,
              lastContactedAt: crm.lastContactedAt ?? null,
              nextFollowUpAt: crm.nextFollowUpAt ?? null,
            }
          : {
              _id: null,
              status: "lead",
              onboardingStatus: "not_started",
              ownerId: null,
              ownerEmail: null,
              lastContactedAt: null,
              nextFollowUpAt: null,
            },
      }
    })
  },
})

export const upsertForCurrentOrg = mutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
    onboardingStatus: v.string(),
    ownerId: v.optional(v.id("users")),
    lastContactedAt: v.optional(v.number()),
    nextFollowUpAt: v.optional(v.number()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orgId, userId: actorId } = await requireOrgPermission(ctx, "crm:write")
    if (!STATUS_VALUES.includes(args.status as any)) {
      throw new Error("Invalid status")
    }
    if (!ONBOARDING_VALUES.includes(args.onboardingStatus as any)) {
      throw new Error("Invalid onboarding status")
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", orgId).eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()

    if (!membership) {
      throw new Error("User is not a member of this org")
    }

    const existing = await ctx.db
      .query("crmCustomers")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", orgId).eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        onboardingStatus: args.onboardingStatus,
        ownerId: args.ownerId,
        lastContactedAt: args.lastContactedAt,
        nextFollowUpAt: args.nextFollowUpAt,
        source: args.source,
        updatedBy: actorId,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("crmCustomers", {
      orgId,
      userId: args.userId,
      status: args.status,
      onboardingStatus: args.onboardingStatus,
      ownerId: args.ownerId,
      lastContactedAt: args.lastContactedAt,
      nextFollowUpAt: args.nextFollowUpAt,
      source: args.source,
      createdBy: actorId,
      updatedBy: actorId,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const addNoteForCurrentOrg = mutation({
  args: {
    userId: v.id("users"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId: actorId } = await requireOrgPermission(ctx, "crm:write")
    const customer = await ctx.db
      .query("crmCustomers")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", orgId).eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()

    if (!customer) {
      const now = Date.now()
      const customerId = await ctx.db.insert("crmCustomers", {
        orgId,
        userId: args.userId,
        status: "lead",
        onboardingStatus: "not_started",
        createdBy: actorId,
        updatedBy: actorId,
        createdAt: now,
        updatedAt: now,
      })

      await ctx.db.insert("crmNotes", {
        orgId,
        customerId,
        body: args.body,
        createdBy: actorId,
        createdAt: now,
      })
      return
    }

    await ctx.db.insert("crmNotes", {
      orgId,
      customerId: customer._id,
      body: args.body,
      createdBy: actorId,
      createdAt: Date.now(),
    })
  },
})

export const listNotesForCurrentOrg = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "crm:read")
    const customer = await ctx.db
      .query("crmCustomers")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", orgId).eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()

    if (!customer) return []

    const notes = await ctx.db
      .query("crmNotes")
      .withIndex("by_orgId_customerId", (q) => q.eq("orgId", orgId).eq("customerId", customer._id))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .collect()

    const authors = await Promise.all(notes.map((note) => ctx.db.get(note.createdBy)))
    const authorById = new Map(authors.filter(Boolean).map((author) => [author!._id, author]))

    return notes.map((note) => ({
      ...note,
      authorEmail: authorById.get(note.createdBy)?.email ?? null,
    }))
  },
})

