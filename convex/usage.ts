import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireOrgPermission } from "./helpers"

export const listByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("usageMetrics")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect()
  },
})

export const getByMetric = query({
  args: { orgId: v.id("organizations"), metric: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("usageMetrics")
      .withIndex("by_orgId_metric", (q) => q.eq("orgId", args.orgId).eq("metric", args.metric))
      .first()
  },
})

export const upsert = mutation({
  args: {
    orgId: v.id("organizations"),
    metric: v.string(),
    current: v.number(),
    limit: v.optional(v.number()),
    period: v.string(),
    periodStart: v.number(),
    periodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("usageMetrics")
      .withIndex("by_orgId_metric", (q) => q.eq("orgId", args.orgId).eq("metric", args.metric))
      .first()

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        current: args.current,
        limit: args.limit,
        period: args.period,
        periodStart: args.periodStart,
        periodEnd: args.periodEnd,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("usageMetrics", {
      orgId: args.orgId,
      metric: args.metric,
      current: args.current,
      limit: args.limit,
      period: args.period,
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const increment = mutation({
  args: {
    orgId: v.id("organizations"),
    metric: v.string(),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("usageMetrics")
      .withIndex("by_orgId_metric", (q) => q.eq("orgId", args.orgId).eq("metric", args.metric))
      .first()

    if (!existing) {
      throw new Error("Usage metric not found")
    }

    await ctx.db.patch(existing._id, {
      current: existing.current + args.delta,
      updatedAt: Date.now(),
    })
  },
})

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "usage:read")
    return await ctx.db
      .query("usageMetrics")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .collect()
  },
})

