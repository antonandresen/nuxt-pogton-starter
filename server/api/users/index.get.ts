import { desc } from 'drizzle-orm'
import { users } from '../../../drizzle/schema'
import authMiddleware from '../../utils/auth'
import adminMiddleware from '../../utils/admin'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)

  try {
    const usersList = await db.select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      role: users.role
    }).from(users).orderBy(desc(users.createdAt))

    return {
      users: usersList
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch users'
    })
  }
})
