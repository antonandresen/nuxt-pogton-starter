import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireOrgPermission, requireUser } from "./helpers"

export const getByUserAndOrg = query({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memberships")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", args.orgId).eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()
  },
})

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memberships")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()
  },
})

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)
    return await ctx.db
      .query("memberships")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()
  },
})

export const listByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memberships")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()
  },
})

export const create = mutation({
  args: {
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("memberships", {
      orgId: args.orgId,
      userId: args.userId,
      role: args.role,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateRole = mutation({
  args: {
    id: v.id("memberships"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      role: args.role,
      updatedAt: Date.now(),
    })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("memberships"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    })
  },
})

export const softDelete = mutation({
  args: { id: v.id("memberships") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "member:read")
    return await ctx.db
      .query("memberships")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()
  },
})

