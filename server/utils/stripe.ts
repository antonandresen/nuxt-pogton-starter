import Stripe from 'stripe'
import { convex, api } from './convex'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

/**
 * Sync subscription data from Stripe to Convex
 * 
 * Two patterns available:
 * 
 * 1. (Current) Nuxt Server API pattern:
 *    - Stripe API calls happen in Nuxt server
 *    - Convex is used as the database via mutations
 *    - Pros: Secrets stay on your server, simpler setup
 * 
 * 2. (Alternative) Pure Convex Action pattern:
 *    - Call convex.action(api.stripe.syncSubscriptionFromStripe, { stripeCustomerId })
 *    - Stripe API calls happen in Convex action
 *    - Pros: Can use Convex scheduling, retries, etc.
 *    - Cons: Need to set STRIPE_SECRET_KEY in Convex dashboard
 */
export async function syncSubscription(customerId: string) {
  try {
    // Get user by stripe customer ID
    const user = await convex.query(api.users.getByStripeCustomerId, { stripeCustomerId: customerId })

    if (!user) {
      throw new Error('User not found')
    }

    // Fetch latest subscription data from Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method']
    })

    // Delete existing subscriptions for this user
    await convex.mutation(api.subscriptions.deleteByUserId, { userId: user._id })

    if (stripeSubscriptions.data.length === 0) {
      return null
    }

    const subscription = stripeSubscriptions.data[0]
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod

    // Create new subscription record
    const subscriptionId = await convex.mutation(api.subscriptions.create, {
      userId: user._id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodStart: subscription.current_period_start * 1000,
      currentPeriodEnd: subscription.current_period_end * 1000,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentMethodBrand: paymentMethod?.card?.brand || undefined,
      paymentMethodLast4: paymentMethod?.card?.last4 || undefined,
    })

    return {
      _id: subscriptionId,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  } catch (error) {
    console.error('Failed to sync subscription:', error)
    throw error
  }
}

/**
 * Alternative: Use Convex action for Stripe sync
 * Requires STRIPE_SECRET_KEY to be set in Convex dashboard
 * 
 * Benefits:
 * - Can be scheduled with ctx.scheduler
 * - Automatic retries on failure
 * - Runs on Convex infrastructure
 */
export async function syncSubscriptionViaAction(customerId: string) {
  return await convex.action(api.stripe.syncSubscriptionFromStripe, {
    stripeCustomerId: customerId,
  })
}
