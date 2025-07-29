import { defineEventHandler, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)
  await adminMiddleware(event)
  
  const userId = getRouterParam(event, 'id')
  const { role } = await readBody(event)

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
  }

  const [updatedUser] = await db.update(db.schemas.users)
    .set({ role })
    .where(eq(db.schemas.users.id, parseInt(userId)))
    .returning({
      id: db.schemas.users.id,
      email: db.schemas.users.email,
      role: db.schemas.users.role
    })

  if (!updatedUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { user: updatedUser }
}) 