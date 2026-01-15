import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now()
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.or(
            q.eq(q.field("status"), "active"),
            q.eq(q.field("status"), "trialing"),
            q.and(
              q.eq(q.field("status"), "canceled"),
              q.gt(q.field("currentPeriodEnd"), now)
            )
          )
        )
      )
      .order("desc")
      .first()
    return subscriptions
  },
})

export const deleteByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect()
    
    for (const sub of subscriptions) {
      await ctx.db.delete(sub._id)
    }
  },
})

export const create = mutation({
  args: {
    userId: v.id("users"),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    priceId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.boolean(),
    paymentMethodBrand: v.optional(v.string()),
    paymentMethodLast4: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("subscriptions", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

