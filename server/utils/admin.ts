import type { H3Event } from 'h3'
import { convex, api } from './convex'
import type { Id } from '../../convex/_generated/dataModel'

export default async function adminMiddleware(event: H3Event) {
  const userId = event.context.userId as Id<"users"> | undefined
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const user = await convex.query(api.users.getById, { id: userId })

  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required'
    })
  }
}
