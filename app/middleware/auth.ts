export default defineNuxtRouteMiddleware(async (to) => {
  const loginRedirect = {
    path: '/login',
    query: { redirect: to.fullPath },
  }

  if (process.server) {
    const cookie = useCookie('auth_token')
    if (!cookie.value) {
      return navigateTo(loginRedirect)
    }

    // Fetch user data during SSR and populate state so downstream
    // middleware (admin) and components have it immediately.
    const nuxtApp = useNuxtApp()
    if (!nuxtApp.payload.data['auth-user-ssr']) {
      try {
        const requestFetch = useRequestFetch()
        const data = await requestFetch('/api/auth/me') as { user: Record<string, any> | null }

        // Seed the useFetch cache key so useAuth() won't re-fetch
        nuxtApp.payload.data['auth-user-ssr'] = data

        if (data?.user) {
          useState('auth-user').value = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            createdAt: new Date(data.user.createdAt),
            avatar: data.user.avatar,
            name: data.user.name,
            currentOrgId: data.user.currentOrgId ?? null,
          }
        } else {
          return navigateTo(loginRedirect)
        }
      } catch {
        return navigateTo(loginRedirect)
      }
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
    return navigateTo(loginRedirect)
  }
})