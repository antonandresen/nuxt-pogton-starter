import { getCookie, createError } from 'h3'
import type { H3Event } from 'h3'
import { jwtVerify, importSPKI } from 'jose'

/**
 * Server-side auth middleware.
 * Verifies the RS256 auth_token cookie and sets event.context.userId + event.context.userRole.
 */
export default async function authMiddleware(event: H3Event) {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const publicKey = (config.convexAuthPublicKey as string).replace(/\\n/g, '\n')
    const key = await importSPKI(publicKey, 'RS256')
    const { payload } = await jwtVerify(token, key)
    event.context.userId = payload.sub as string
    event.context.userRole = payload.role as string
  } catch (_) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }
}
