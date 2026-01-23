import Stripe from 'stripe'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  try {
    // Fetch all active products
    const products = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ['data.default_price'],
    })

    // Fetch all active prices
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ['data.product'],
    })

    // Group prices by product
    const productMap = new Map<string, {
      id: string
      name: string
      description: string | null
      prices: Array<{
        id: string
        nickname: string | null
        unitAmount: number | null
        currency: string
        interval: string | null
        intervalCount: number | null
        type: string
      }>
    }>()

    for (const product of products.data) {
      productMap.set(product.id, {
        id: product.id,
        name: product.name,
        description: product.description,
        prices: [],
      })
    }

    for (const price of prices.data) {
      const productId = typeof price.product === 'string' 
        ? price.product 
        : price.product.id

      const product = productMap.get(productId)
      if (product) {
        product.prices.push({
          id: price.id,
          nickname: price.nickname,
          unitAmount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval ?? null,
          intervalCount: price.recurring?.interval_count ?? null,
          type: price.type,
        })
      }
    }

    return {
      products: Array.from(productMap.values()),
    }
  } catch (error) {
    console.error('Failed to fetch Stripe prices:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch Stripe prices',
    })
  }
})

