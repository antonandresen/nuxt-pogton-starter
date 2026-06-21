import { getCookie } from 'h3'
import { jwtVerify, importSPKI } from 'jose'
import { convex, api, type Id } from '../../utils/convex'

/**
 * Returns the current user's data if authenticated.
 * Used by the auth plugin for SSR to render the correct UI on first load.
 */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    return { user: null }
  }

  try {
    const publicKey = (config.convexAuthPublicKey as string).replace(/\\n/g, '\n')
    const key = await importSPKI(publicKey, 'RS256')
    const { payload } = await jwtVerify(token, key)
    const userId = payload.sub as Id<"users">

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
