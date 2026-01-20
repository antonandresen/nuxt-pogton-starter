export default defineNuxtRouteMiddleware(async (to) => {
  // On SSR, validate the auth cookie so server render matches client state
  if (process.server) {
    const event = useRequestEvent()
    if (!event) {
      return
    }

    const { getCookie } = await import('h3')
    const token = getCookie(event, 'auth_token')

    if (!token) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    }

    try {
      const config = useRuntimeConfig()
      const secretValue = (config.JWT_SECRET || config.jwtSecret) as string | undefined
      if (!secretValue) {
        throw new Error('Missing JWT secret')
      }
      const { jwtVerify } = await import('jose')
      const secret = new TextEncoder().encode(secretValue)
      await jwtVerify(token, secret)
    } catch (error) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    }

    return
  }

  // Client-side: use Convex auth state
  const tokenState = useState<string | null>('convex-auth-token', () => null)
  const isAuthenticated = useState<boolean>('convex-authenticated', () => true)

  if (!tokenState.value) {
    try {
      const response = await $fetch<{ token: string }>('/api/convex/token', {
        credentials: 'include',
      })
      tokenState.value = response.token
      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false
    }
  }

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})