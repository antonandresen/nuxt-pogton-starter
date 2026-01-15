import authMiddleware from '../../utils/auth'
import adminMiddleware from '../../utils/admin'
import { convex, api } from '../../utils/convex'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)

  try {
    const usersList = await convex.query(api.users.list, {})

    return {
      users: usersList.map(user => ({
        id: user._id,
        email: user.email,
        createdAt: new Date(user.createdAt),
        role: user.role,
      }))
    }

  } catch (error: unknown) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch users'
    })
  }
})
