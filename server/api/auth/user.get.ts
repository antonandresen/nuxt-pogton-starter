import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'
import authMiddleware from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)

  const userId = event.context.userId

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  })

  return { user }
})
