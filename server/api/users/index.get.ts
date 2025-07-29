import { desc } from 'drizzle-orm'
import authMiddleware from '../../utils/auth'
import adminMiddleware from '../../utils/admin'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)

  try {
    const usersList = await db.select({
      id: db.schemas.users.id,
      email: db.schemas.users.email,
      createdAt: db.schemas.users.createdAt,
      role: db.schemas.users.role
    }).from(db.schemas.users).orderBy(desc(db.schemas.users.createdAt))

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
