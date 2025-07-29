import { eq } from 'drizzle-orm'
import { users } from '../../../drizzle/schema'
import authMiddleware from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  
  const userId = event.context.user.userId

  const user = await db.select({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    role: users.role
  }).from(users).where(eq(users.id, userId)).limit(1)

  if (!user[0]) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { user: user[0] }
})
