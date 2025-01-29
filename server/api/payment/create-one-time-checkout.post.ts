import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import authMiddleware from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)

  const body = await readBody(event)
  const { priceId } = body

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/shop/cancel`,
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