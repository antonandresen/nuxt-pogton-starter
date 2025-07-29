import Stripe from 'stripe'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function syncSubscription(customerId: string) {
  try {
    // Get user by stripe customer ID
    const userResult = await db.select()
      .from(db.schemas.users)
      .where(eq(db.schemas.users.stripeCustomerId, customerId))
      .limit(1)

    const user = userResult[0]
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

    // Delete existing subscription if exists
    await db.delete(db.schemas.subscriptions)
      .where(eq(db.schemas.subscriptions.userId, user.id))

    if (stripeSubscriptions.data.length === 0) {
      return null
    }

    const subscription = stripeSubscriptions.data[0]
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod

    // Create new subscription record
    const [newSubscription] = await db.insert(db.schemas.subscriptions)
      .values({
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        paymentMethodBrand: paymentMethod?.card?.brand || null,
        paymentMethodLast4: paymentMethod?.card?.last4 || null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return newSubscription
  } catch (error) {
    console.error('Failed to sync subscription:', error)
    throw error
  }
} 