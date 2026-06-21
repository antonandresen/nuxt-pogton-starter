import type { H3Event } from 'h3'

/**
 * Admin middleware - checks that the authenticated user has ADMIN role.
 * Role is extracted from the RS256 JWT payload set by authMiddleware.
 * Must be called AFTER authMiddleware.
 */
export default async function adminMiddleware(event: H3Event) {
  const userRole = event.context.userRole

  if (!userRole) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (userRole !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden: Admin access required' })
  }
}
