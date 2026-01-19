import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import authMiddleware from '../../utils/auth'
import { convex, api, type Id } from '../../utils/convex'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId as Id<"users">

  const body = await readBody(event)
  const { sessionId } = body

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      message: 'Session ID is required'
    })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    // Get user
    const user = await convex.query(api.users.getById, { id: userId })

    if (!user?.email) {
      throw new Error('User email not found')
    }

    // Retrieve the session with payment details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    })

    // Verify the payment was successful
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed')
    }

    // Get the payment intent ID
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id

    if (!paymentIntentId) {
      throw new Error('Payment intent not found')
    }

    // Get the purchased item details
    const lineItem = session.line_items?.data[0]
    if (!lineItem) {
      throw new Error('No line items found')
    }

    // Store the purchase in the database
    const purchaseId = await convex.mutation(api.purchases.create, {
      userId,
      stripeSessionId: session.id,
      stripePaymentId: paymentIntentId,
      productId: lineItem.price?.id || 'unknown',
      productName: lineItem.description || 'Unknown Product',
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase() || 'USD',
      status: session.payment_status,
    })

    // Send purchase confirmation email
    try {
      await sendPurchaseConfirmation(user.email, {
        productName: lineItem.description || 'Unknown Product',
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase() || 'USD',
        date: new Date(),
        paymentId: paymentIntentId
      })
    } catch (error) {
      console.error('Failed to send purchase confirmation email:', error)
      // Don't throw error here as the purchase is already completed
    }

    return {
      success: true,
      purchase: {
        id: purchaseId,
        productName: lineItem.description || 'Unknown Product',
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase() || 'USD',
        date: new Date(),
        paymentId: paymentIntentId
      }
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to verify payment'
    })
  }
})
