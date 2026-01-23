import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./helpers"

// List synced products
export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.db
      .query("stripeProducts")
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// List synced prices
export const listPrices = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.db
      .query("stripePrices")
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// List prices for a specific product
export const listPricesByProduct = query({
  args: { stripeProductId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return await ctx.db
      .query("stripePrices")
      .withIndex("by_stripeProductId", (q) => q.eq("stripeProductId", args.stripeProductId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// Upsert product (called from server sync)
export const upsertProduct = mutation({
  args: {
    stripeId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeProducts")
      .withIndex("by_stripeId", (q) => q.eq("stripeId", args.stripeId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        description: args.description,
        active: args.active,
        syncedAt: Date.now(),
      })
      return existing._id
    } else {
      return await ctx.db.insert("stripeProducts", {
        stripeId: args.stripeId,
        name: args.name,
        description: args.description,
        active: args.active,
        syncedAt: Date.now(),
      })
    }
  },
})

// Upsert price (called from server sync)
export const upsertPrice = mutation({
  args: {
    stripeId: v.string(),
    stripeProductId: v.string(),
    nickname: v.optional(v.string()),
    unitAmount: v.optional(v.number()),
    currency: v.string(),
    interval: v.optional(v.string()),
    intervalCount: v.optional(v.number()),
    type: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripePrices")
      .withIndex("by_stripeId", (q) => q.eq("stripeId", args.stripeId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        stripeProductId: args.stripeProductId,
        nickname: args.nickname,
        unitAmount: args.unitAmount,
        currency: args.currency,
        interval: args.interval,
        intervalCount: args.intervalCount,
        type: args.type,
        active: args.active,
        syncedAt: Date.now(),
      })
      return existing._id
    } else {
      return await ctx.db.insert("stripePrices", {
        stripeId: args.stripeId,
        stripeProductId: args.stripeProductId,
        nickname: args.nickname,
        unitAmount: args.unitAmount,
        currency: args.currency,
        interval: args.interval,
        intervalCount: args.intervalCount,
        type: args.type,
        active: args.active,
        syncedAt: Date.now(),
      })
    }
  },
})
