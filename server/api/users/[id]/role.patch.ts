import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/server/utils/prisma'
import authMiddleware from '~/server/utils/auth'
import adminMiddleware from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)

  const userId = parseInt(event.context.params.id)
  const { role } = await readBody(event)

  if (!['USER', 'ADMIN'].includes(role)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid role'
    })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  return { user }
}) 