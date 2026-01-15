import { defineEventHandler, readBody, createError } from 'h3'
import authMiddleware from '../../../utils/auth'
import adminMiddleware from '../../../utils/admin'
import { convex, api } from '../../../utils/convex'
import type { Id } from '../../../../convex/_generated/dataModel'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)
  
  const userId = getRouterParam(event, 'id') as Id<"users">
  const { role } = await readBody(event)

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
  }

  if (role !== 'USER' && role !== 'ADMIN') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
  }

  const updatedUser = await convex.mutation(api.users.updateRole, {
    id: userId,
    role,
  })

  if (!updatedUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    user: {
      id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
    }
  }
})
