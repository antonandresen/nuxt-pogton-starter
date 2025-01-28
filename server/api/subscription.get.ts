import { defineEventHandler } from 'h3'
import authMiddleware from '~/server/utils/auth'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  const userId = event.context.userId

  try {
    // Get user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { status: 'active' },
          { status: 'trialing' },
          {
            AND: [
              { status: 'canceled' },
              { currentPeriodEnd: { gt: new Date() } }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return subscription
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subscription details'
    })
  }
}) 