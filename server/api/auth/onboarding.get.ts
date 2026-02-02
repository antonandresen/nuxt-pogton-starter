import { getCookie } from 'h3'
import * as jose from 'jose'
import { convex, api, type Id } from '../../utils/convex'

/**
 * Returns the current user's onboarding status if authenticated.
 * Used for SSR to render the correct UI on first load.
 */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    return { onboarding: null }
  }

  try {
    const secretValue = (config.JWT_SECRET || config.jwtSecret) as string | undefined
    if (!secretValue) {
      return { onboarding: null }
    }

    const secret = new TextEncoder().encode(secretValue)
    const { payload } = await jose.jwtVerify(token, secret)
    const userId = payload.userId as Id<"users">

    // Fetch onboarding status from Convex
    const onboarding = await convex.query(api.onboarding.getByUser, { userId })
    
    return {
      onboarding: onboarding ? {
        completedSteps: onboarding.completedSteps,
        completed: onboarding.completed,
        data: onboarding.data,
        updatedAt: onboarding.updatedAt,
      } : null
    }
  } catch (error) {
    // Token invalid or expired
    return { onboarding: null }
  }
})
