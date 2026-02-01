import { api, useConvexQuery } from '../composables/useConvex'

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard')) return
  if (to.path.startsWith('/dashboard/onboarding')) return
  if (process.server) return

  const { data: appSettings } = useConvexQuery(api.appSettings.getPublic, {})
  const { data, isLoading } = useConvexQuery(api.onboarding.getForCurrentUser, {})

  if (isLoading.value) return
  
  // Only enforce onboarding if it's enabled in app settings
  const onboardingEnabled = appSettings.value?.onboardingEnabled ?? true
  if (!onboardingEnabled) return

  if (!data.value?.completed) {
    return navigateTo('/dashboard/onboarding')
  }
})

