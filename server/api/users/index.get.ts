import prisma from '@/server/utils/prisma'
import authMiddleware from '~/server/utils/auth'
import adminMiddleware from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      users
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch users'
    })
  }
})
