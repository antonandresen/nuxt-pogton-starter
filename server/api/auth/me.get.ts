import { getCookie } from 'h3'
import * as jose from 'jose'
import { convex, api, type Id } from '../../utils/convex'

/**
 * Returns the current user's data if authenticated.
 * Used for SSR to render the correct UI on first load.
 */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    return { user: null }
  }

  try {
    const secretValue = (config.JWT_SECRET || config.jwtSecret) as string | undefined
    if (!secretValue) {
      return { user: null }
    }

    const secret = new TextEncoder().encode(secretValue)
    const { payload } = await jose.jwtVerify(token, secret)
    const userId = payload.userId as Id<"users">

    // Fetch full user from Convex
    const user = await convex.query(api.users.getById, { id: userId })
    
    if (!user) {
      return { user: null }
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar,
        name: user.name,
        currentOrgId: user.currentOrgId ?? null,
      }
    }
  } catch (error) {
    // Token invalid or expired
    return { user: null }
  }
})
