import { defineEventHandler } from 'h3'
import { eq, and, or, gt, desc, isNull } from 'drizzle-orm'
import authMiddleware from '../utils/auth'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId

  try {
    // Get user's subscription
    const subscription = await db.select()
      .from(db.schemas.subscriptions)
      .where(
        and(
          eq(db.schemas.subscriptions.userId, userId),
          isNull(db.schemas.subscriptions.deletedAt),
          or(
            eq(db.schemas.subscriptions.status, 'active'),
            eq(db.schemas.subscriptions.status, 'trialing'),
            and(
              eq(db.schemas.subscriptions.status, 'canceled'),
              gt(db.schemas.subscriptions.currentPeriodEnd, new Date())
            )
          )
        )
      )
      .orderBy(desc(db.schemas.subscriptions.createdAt))
      .limit(1)

    return subscription[0] || null
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subscription details'
    })
  }
}) 