import type { H3Event } from 'h3'

/**
 * Staff middleware - allows STAFF or ADMIN roles.
 * Must be called AFTER authMiddleware.
 */
export default async function staffMiddleware(event: H3Event) {
  const userRole = event.context.userRole

  if (!userRole) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden: Staff access required' })
  }
}
