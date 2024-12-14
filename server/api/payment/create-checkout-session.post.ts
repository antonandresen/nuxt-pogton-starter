import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { priceId } = body

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', // Use 'payment' for one-time payments
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/dashboard/payment/cancel`,
    })

    return { sessionId: session.id }
  } catch (err) {
    event.res.statusCode = 500
    return { error: err.message }
  }
})