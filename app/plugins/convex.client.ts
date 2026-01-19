import { createConvexVue } from '@convex-vue/core'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const convexUrl = config.public.CONVEX_URL as string

  if (!convexUrl) {
    console.warn('CONVEX_URL not configured - Convex real-time sync disabled')
    return
  }

  const tokenState = useState<string | null>('convex-auth-token', () => null)
  const isAuthenticated = useState<boolean>('convex-authenticated', () => true)
  const isLoading = useState<boolean>('convex-auth-loading', () => false)

  const convexVue = createConvexVue({
    convexUrl,
    auth: {
      isAuthenticated,
      isLoading,
      getToken: async ({ forceRefreshToken }) => {
        if (!forceRefreshToken && tokenState.value) {
          return tokenState.value
        }
        try {
          isLoading.value = true
          const response = await $fetch<{ token: string }>('/api/convex/token', {
            credentials: 'include',
          })
          tokenState.value = response.token
          isAuthenticated.value = true
          return response.token
        } catch (error) {
          tokenState.value = null
          isAuthenticated.value = false
          return null
        } finally {
          isLoading.value = false
        }
      },
    },
  })

  nuxtApp.vueApp.use(convexVue)
})

