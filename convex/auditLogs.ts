import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const listByOrg = query({
  args: { orgId: v.id("organizations"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(limit)
  },
})

export const create = mutation({
  args: {
    orgId: v.id("organizations"),
    actorId: v.id("users"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      orgId: args.orgId,
      actorId: args.actorId,
      action: args.action,
      targetType: args.targetType,
      targetId: args.targetId,
      meta: args.meta,
      createdAt: Date.now(),
    })
  },
})

