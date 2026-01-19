import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'
import authMiddleware from '../../utils/auth'
import { convex, api } from '../../utils/convex'
import type { Id } from '../../../convex/_generated/dataModel'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)

  const { returnUrl } = await readBody(event)
  const userId = event.context.userId as Id<"users">
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    const user = await convex.query(api.users.getById, { id: userId })

    if (!user) {
      throw new Error('User not found')
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId,
        },
      })

      await convex.mutation(api.users.updateStripeCustomerId, {
        id: userId,
        stripeCustomerId: customer.id,
      })

      customerId = customer.id
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.BASE_URL}/dashboard/subscription`,
    })

    return { url: session.url }
  } catch (error: unknown) {
    event.res.statusCode = 500
    return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
})

