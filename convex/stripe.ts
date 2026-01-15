import { v } from "convex/values"
import { action, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"

// Actions can call external APIs (like Stripe) - mutations cannot!
// This is the proper Convex pattern for external service calls.

export const syncSubscriptionFromStripe = action({
  args: {
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args): Promise<{ subscriptionId: any; currentPeriodEnd: Date } | null> => {
    // Get Stripe secret from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured")
    }

    // Dynamic import to avoid bundling issues
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(stripeSecretKey)

    // Fetch subscription from Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: args.stripeCustomerId,
      limit: 1,
      status: "all",
      expand: ["data.default_payment_method"],
    })

    if (stripeSubscriptions.data.length === 0) {
      // No subscription found - delete any existing
      await ctx.runMutation(internal.stripe.deleteSubscriptionByCustomerId, {
        stripeCustomerId: args.stripeCustomerId,
      })
      return null
    }

    const subscription = stripeSubscriptions.data[0]
    const paymentMethod = subscription.default_payment_method as any

    // Update database via internal mutation
    const result: { subscriptionId: any; currentPeriodEnd: Date } = await ctx.runMutation(internal.stripe.upsertSubscription, {
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodStart: subscription.current_period_start * 1000,
      currentPeriodEnd: subscription.current_period_end * 1000,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentMethodBrand: paymentMethod?.card?.brand,
      paymentMethodLast4: paymentMethod?.card?.last4,
    })

    return result
  },
})

// Internal mutations - only callable from actions, not from client
export const upsertSubscription = internalMutation({
  args: {
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    priceId: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    paymentMethodBrand: v.optional(v.string()),
    paymentMethodLast4: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find user by stripe customer ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .first()

    if (!user) {
      throw new Error("User not found for stripe customer: " + args.stripeCustomerId)
    }

    // Delete existing subscriptions for this user
    const existingSubs = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    for (const sub of existingSubs) {
      await ctx.db.delete(sub._id)
    }

    // Create new subscription
    const now = Date.now()
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      stripeSubscriptionId: args.stripeSubscriptionId,
      status: args.status,
      priceId: args.priceId,
      currentPeriodStart: args.currentPeriodStart,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      paymentMethodBrand: args.paymentMethodBrand,
      paymentMethodLast4: args.paymentMethodLast4,
      createdAt: now,
      updatedAt: now,
    })

    return {
      subscriptionId,
      currentPeriodEnd: new Date(args.currentPeriodEnd),
    }
  },
})

export const deleteSubscriptionByCustomerId = internalMutation({
  args: {
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .first()

    if (!user) return

    const subs = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    for (const sub of subs) {
      await ctx.db.delete(sub._id)
    }
  },
})

