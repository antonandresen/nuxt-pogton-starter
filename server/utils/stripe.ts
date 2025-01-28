import Stripe from 'stripe'
import prisma from './prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function syncSubscription(customerId: string) {
  try {
    // Get user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId }
    })

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
    await prisma.subscription.deleteMany({
      where: { userId: user.id }
    })

    if (stripeSubscriptions.data.length === 0) {
      return null
    }

    const subscription = stripeSubscriptions.data[0]
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod

    // Create new subscription record
    const newSubscription = await prisma.subscription.create({
      data: {
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
      }
    })

    return newSubscription
  } catch (error) {
    console.error('Failed to sync subscription:', error)
    throw error
  }
} 