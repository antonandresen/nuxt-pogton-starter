export default defineNuxtRouteMiddleware(async (to) => {
  // On SSR, only check that the auth cookie exists
  // (avoids crypto/env issues during SSR in production)
  if (process.server) {
    const cookie = useCookie('auth_token')
    if (!cookie.value) {
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