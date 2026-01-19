export default defineNuxtRouteMiddleware(async (to) => {
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