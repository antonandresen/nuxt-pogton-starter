export default defineNuxtRouteMiddleware(async () => {
  const user = useState('auth-user')

  // On client: wait for auth to be ready
  if (import.meta.client) {
    const authReady = useState<boolean>('auth-ready', () => false)
    if (!authReady.value) {
      await new Promise<void>((resolve) => {
        const stop = watch(authReady, (ready) => {
          if (ready) { stop(); resolve() }
        }, { immediate: true })
      })
    }
  }

  if (!user.value || user.value.role !== 'ADMIN') {
    return navigateTo({
      path: '/dashboard',
      query: {
        message: 'You need admin access to view this page'
      }
    })
  }
})