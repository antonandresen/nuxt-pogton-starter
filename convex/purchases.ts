import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./helpers"

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("purchases")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .collect()
  },
})

export const getBySessionId = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("purchases")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first()
  },
})

export const create = mutation({
  args: {
    userId: v.id("users"),
    stripeSessionId: v.string(),
    stripePaymentId: v.string(),
    productId: v.string(),
    productName: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("purchases", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const listAllForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const purchases = await ctx.db
      .query("purchases")
      .order("desc")
      .collect()

    const users = await Promise.all(purchases.map((purchase) => ctx.db.get(purchase.userId)))

    return purchases.map((purchase, index) => ({
      ...purchase,
      user: users[index]
        ? {
            _id: users[index]!._id,
            email: users[index]!.email,
            name: users[index]!.name,
            stripeCustomerId: users[index]!.stripeCustomerId,
          }
        : null,
    }))
  },
})

