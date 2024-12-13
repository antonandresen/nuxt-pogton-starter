import prisma from './prisma'

export default async function adminMiddleware(event: H3Event) {
  const userId = event.context.userId
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })

  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required'
    })
  }
} 