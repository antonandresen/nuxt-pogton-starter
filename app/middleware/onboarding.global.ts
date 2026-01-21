import { api, useConvexQuery } from '../composables/useConvex'

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard')) return
  if (to.path.startsWith('/dashboard/onboarding')) return
  if (process.server) return

  const { data, isLoading } = useConvexQuery(api.onboarding.getForCurrentUser, {})

  if (isLoading.value) return
  if (!data.value?.completed) {
    return navigateTo('/dashboard/onboarding')
  }
})

