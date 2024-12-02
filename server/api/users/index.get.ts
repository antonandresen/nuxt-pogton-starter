import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    // const session = await getServerSession(event)
    // if (!session) {
    //   throw createError({
    //     statusCode: 401,
    //     message: 'Unauthorized'
    //   })
    // }

    // Fetch all users from the database
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
