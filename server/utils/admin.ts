import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

export default async function adminMiddleware(event: H3Event) {
  const userId = event.context.userId
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const userResult = await db.select({
    role: db.schemas.users.role
  }).from(db.schemas.users).where(eq(db.schemas.users.id, userId)).limit(1)

  const user = userResult[0]
  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required'
    })
  }
} 