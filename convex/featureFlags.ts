import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireOrgPermission } from "./helpers"

export const listByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("featureFlags")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect()
  },
})

export const getByKey = query({
  args: { orgId: v.id("organizations"), key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("featureFlags")
      .withIndex("by_orgId_key", (q) => q.eq("orgId", args.orgId).eq("key", args.key))
      .first()
  },
})

export const upsert = mutation({
  args: {
    orgId: v.id("organizations"),
    key: v.string(),
    enabled: v.boolean(),
    rules: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("featureFlags")
      .withIndex("by_orgId_key", (q) => q.eq("orgId", args.orgId).eq("key", args.key))
      .first()

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        rules: args.rules,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("featureFlags", {
      orgId: args.orgId,
      key: args.key,
      enabled: args.enabled,
      rules: args.rules,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("featureFlags") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "feature_flag:read")
    return await ctx.db
      .query("featureFlags")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .collect()
  },
})

export const upsertForCurrentOrg = mutation({
  args: {
    key: v.string(),
    enabled: v.boolean(),
    rules: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "feature_flag:write")
    const existing = await ctx.db
      .query("featureFlags")
      .withIndex("by_orgId_key", (q) => q.eq("orgId", orgId).eq("key", args.key))
      .first()

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        rules: args.rules,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("featureFlags", {
      orgId,
      key: args.key,
      enabled: args.enabled,
      rules: args.rules,
      createdAt: now,
      updatedAt: now,
    })
  },
})

