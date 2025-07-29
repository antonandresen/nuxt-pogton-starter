import { defineEventHandler, getQuery, createError } from 'h3'
import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId

  const query = getQuery(event)
  const sessionId = query.session_id as string

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      message: 'Session ID is required'
    })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    // Get session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer']
    })

    if (!session.customer) {
      throw new Error('No customer found in session')
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      throw new Error('User has no Stripe customer ID')
    }

    // Sync subscription data
    const subscription = await syncSubscription(user.stripeCustomerId)

    if (subscription?.status === 'active') {
      return {
        success: true,
        message: 'Subscription activated successfully'
      }
    }

    return {
      success: false,
      message: 'Subscription activation failed'
    }
  } catch (error) {
    console.error('Payment success error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process subscription'
    })
  }
}) 