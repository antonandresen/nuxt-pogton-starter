import { eq } from 'drizzle-orm'
import authMiddleware from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  
  const userId = event.context.user.userId

  const user = await db.select({
    id: db.schemas.users.id,
    email: db.schemas.users.email,
    createdAt: db.schemas.users.createdAt,
    role: db.schemas.users.role
  }).from(db.schemas.users).where(eq(db.schemas.users.id, userId)).limit(1)

  if (!user[0]) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { user: user[0] }
})
