import prisma from '@/server/utils/prisma'
import auth from '@/server/utils/auth'

export default defineEventHandler(async (event) => {
  await auth(event)

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
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
