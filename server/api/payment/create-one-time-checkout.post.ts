import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import authMiddleware from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId

  const body = await readBody(event)
  const { priceId } = body

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    // Get user's stripe customer ID if it exists
    const userResult = await db.select({
      stripeCustomerId: db.schemas.users.stripeCustomerId,
      email: db.schemas.users.email
    }).from(db.schemas.users).where(eq(db.schemas.users.id, userId)).limit(1)

    const user = userResult[0]
    if (!user) {
      throw new Error('User not found')
    }

    let customerId = user.stripeCustomerId

    // Create a customer if one doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId.toString()
        }
      })
      
      // Save the customer ID to the user record
      await db.update(db.schemas.users)
        .set({ 
          stripeCustomerId: customer.id,
          updatedAt: new Date()
        })
        .where(eq(db.schemas.users.id, userId))

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
        userId: userId.toString()
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