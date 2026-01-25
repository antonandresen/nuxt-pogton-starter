import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./helpers"

// Public: list active plans for display
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db
      .query("pricingPlans")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect()
    return plans.sort((a, b) => a.displayOrder - b.displayOrder)
  },
})

// Admin: list all plans
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const plans = await ctx.db.query("pricingPlans").collect()
    return plans.sort((a, b) => a.displayOrder - b.displayOrder)
  },
})

// Admin: get single plan
export const getById = query({
  args: { id: v.id("pricingPlans") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return await ctx.db.get(args.id)
  },
})

// Admin: create plan
export const create = mutation({
  args: {
    name: v.object({
      en: v.string(),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
      de: v.optional(v.string()),
    }),
    description: v.object({
      en: v.string(),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
      de: v.optional(v.string()),
    }),
    monthlyPrice: v.number(),
    annualPrice: v.number(),
    stripePriceIdMonthly: v.optional(v.string()),
    stripePriceIdAnnual: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
    features: v.array(v.object({
      en: v.string(),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
      de: v.optional(v.string()),
    })),
    isPopular: v.boolean(),
    isActive: v.boolean(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const now = Date.now()
    return await ctx.db.insert("pricingPlans", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Admin: update plan
export const update = mutation({
  args: {
    id: v.id("pricingPlans"),
    name: v.optional(v.object({
      en: v.string(),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
      de: v.optional(v.string()),
    })),
    description: v.optional(v.object({
      en: v.string(),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
      de: v.optional(v.string()),
    })),
    monthlyPrice: v.optional(v.number()),
    annualPrice: v.optional(v.number()),
    stripePriceIdMonthly: v.optional(v.string()),
    stripePriceIdAnnual: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
    features: v.optional(v.array(v.object({
      en: v.string(),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
      de: v.optional(v.string()),
    }))),
    isPopular: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const { id, ...updates } = args
    const plan = await ctx.db.get(id)
    if (!plan) throw new Error("Plan not found")

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    )

    await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    })
  },
})

// Admin: delete plan
export const remove = mutation({
  args: { id: v.id("pricingPlans") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.delete(args.id)
  },
})

