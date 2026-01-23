import Stripe from 'stripe'
import { requireAdmin } from '../../../utils/auth'
import { convex, api } from '../../../utils/convex'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    // Fetch all products
    const products = await stripe.products.list({
      limit: 100,
    })

    // Fetch all prices
    const prices = await stripe.prices.list({
      limit: 100,
    })

    // Sync products to Convex
    for (const product of products.data) {
      await convex.mutation(api.stripe.upsertProduct, {
        stripeId: product.id,
        name: product.name,
        description: product.description ?? undefined,
        active: product.active,
      })
    }

    // Sync prices to Convex
    for (const price of prices.data) {
      const productId = typeof price.product === 'string' 
        ? price.product 
        : price.product.id

      await convex.mutation(api.stripe.upsertPrice, {
        stripeId: price.id,
        stripeProductId: productId,
        nickname: price.nickname ?? undefined,
        unitAmount: price.unit_amount ?? undefined,
        currency: price.currency,
        interval: price.recurring?.interval ?? undefined,
        intervalCount: price.recurring?.interval_count ?? undefined,
        type: price.type,
        active: price.active,
      })
    }

    return {
      success: true,
      productCount: products.data.length,
      priceCount: prices.data.length,
    }
  } catch (error) {
    console.error('Failed to sync Stripe data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to sync Stripe data',
    })
  }
})

