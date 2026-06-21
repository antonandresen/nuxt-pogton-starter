import type { H3Event } from 'h3'
import { convex, api, type Id } from './convex'

/**
 * Permission middleware - checks if the authenticated user has a specific permission.
 * ADMIN role implicitly has all permissions.
 * Must be called AFTER authMiddleware (needs event.context.userId).
 */
export default async function requirePermission(event: H3Event, permission: string) {
  const userId = event.context.userId as string
  const userRole = event.context.userRole as string

  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // ADMIN has all permissions implicitly
  if (userRole === 'ADMIN') return

  // Fall back to the static role-permission map
  const { hasPermission } = await import('./permissions')
  const orgRole = userRole as any

  if (!hasPermission(orgRole, permission as any)) {
    throw createError({
      statusCode: 403,
      message: `Forbidden: requires ${permission} permission`,
    })
  }
}
