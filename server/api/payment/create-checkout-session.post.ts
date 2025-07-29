import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)

  const body = await readBody(event)
  const { priceId } = body
  const userId = event.context.userId

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    // Get user's stripe customer ID if it exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true }
    })

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
      await prisma.user.update({
        where: { id: userId },
        data: { 
          stripeCustomerId: customer.id,
          updatedAt: new Date()
        }
      })

      customerId = customer.id
    }

    const successUrl = `${process.env.BASE_URL}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${process.env.BASE_URL}/dashboard/payment/cancel`

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    console.log('Created session:', session.id)

    return { sessionId: session.id }
  } catch (error: unknown) {
    event.res.statusCode = 500
    return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
})