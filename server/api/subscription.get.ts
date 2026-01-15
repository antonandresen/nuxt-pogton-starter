import { defineEventHandler } from 'h3'
import authMiddleware from '../utils/auth'
import { convex, api } from '../utils/convex'
import type { Id } from '../../convex/_generated/dataModel'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId as Id<"users">

  try {
    const subscription = await convex.query(api.subscriptions.getByUserId, { userId })

    if (!subscription) {
      return null
    }

    return {
      ...subscription,
      id: subscription._id,
      currentPeriodStart: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart) : null,
      currentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null,
      createdAt: new Date(subscription.createdAt),
      updatedAt: new Date(subscription.updatedAt),
    }
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subscription details'
    })
  }
})
