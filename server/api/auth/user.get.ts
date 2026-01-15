import authMiddleware from '../../utils/auth'
import { convex, api } from '../../utils/convex'
import type { Id } from '../../../convex/_generated/dataModel'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  
  const userId = event.context.user.userId as Id<"users">

  const user = await convex.query(api.users.getById, { id: userId })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    user: {
      id: user._id,
      email: user.email,
      createdAt: new Date(user.createdAt),
      role: user.role,
    },
  }
})
