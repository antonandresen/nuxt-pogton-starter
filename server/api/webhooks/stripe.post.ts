import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { syncSubscription } from '../../utils/stripe'
import { sendSubscriptionConfirmation } from '../../utils/onesignal'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sig = event.headers.get('stripe-signature')

  if (!sig || !endpointSecret) {
    throw createError({
      statusCode: 400,
      message: 'Webhook signature missing'
    })
  }

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      JSON.stringify(body),
      sig,
      endpointSecret
    )
  } catch (err) {
    throw createError({
      statusCode: 400,
      message: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    })
  }

  try {
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user's email
        const userResult = await db.select({
          email: db.schemas.users.email
        }).from(db.schemas.users).where(eq(db.schemas.users.stripeCustomerId, customerId)).limit(1)

        const user = userResult[0]
        if (!user?.email) {
          console.error('User not found for customer:', customerId)
          break
        }

        // Sync subscription data
        const updatedSubscription = await syncSubscription(customerId)

        if (updatedSubscription && stripeEvent.type === 'customer.subscription.created') {
          // Get price details
          const price = await stripe.prices.retrieve(subscription.items.data[0].price.id)

          if (!updatedSubscription.currentPeriodEnd) {
            console.error('Missing period end date for subscription')
            break
          }

          // Send confirmation email
          try {
            await sendSubscriptionConfirmation(user.email, {
              planName: price.nickname || 'Premium Plan',
              amount: price.unit_amount ? price.unit_amount / 100 : 0,
              currency: price.currency.toUpperCase(),
              periodEnd: updatedSubscription.currentPeriodEnd
            })
          } catch (error) {
            console.error('Failed to send subscription confirmation email:', error)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        await syncSubscription(customerId)
        break
      }
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)
    throw createError({
      statusCode: 500,
      message: 'Webhook handler failed'
    })
  }
}) 