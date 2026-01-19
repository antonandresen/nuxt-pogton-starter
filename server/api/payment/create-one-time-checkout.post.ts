import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import authMiddleware from '../../utils/auth'
import { convex, api, type Id } from '../../utils/convex'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId as Id<"users">

  const body = await readBody(event)
  const { priceId } = body

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    // Get user
    const user = await convex.query(api.users.getById, { id: userId })

    if (!user) {
      throw new Error('User not found')
    }

    let customerId = user.stripeCustomerId

    // Create a customer if one doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId
        }
      })
      
      // Save the customer ID to the user record
      await convex.mutation(api.users.updateStripeCustomerId, {
        id: userId,
        stripeCustomerId: customer.id,
      })

      customerId = customer.id
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/dashboard/payment/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/dashboard/payment/shop/cancel`,
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      billing_address_collection: 'required',
      metadata: {
        userId: userId
      }
    })

    return { sessionId: session.id }
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create checkout session'
    })
  }
})
