import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useOnboarding() {
  const upsertMutation = useConvexMutation(api.onboarding.upsertForCurrentUser)
  const isHydrated = useState<boolean>('onboarding-hydrated', () => false)
  
  // SSR: Fetch onboarding from our API (runs on server AND client first load)
  const { data: ssrOnboarding } = useFetch('/api/auth/onboarding', {
    credentials: 'include',
    key: 'onboarding-ssr',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  })

  // Client-side: Convex subscription for real-time updates
  const { data: convexOnboarding } = process.client 
    ? useConvexQuery(api.onboarding.getForCurrentUser, {})
    : { data: ref(null) }

  // Mark hydrated when SSR data is available
  watchEffect(() => {
    if (ssrOnboarding.value !== undefined) {
      isHydrated.value = true
    }
  })

  // Merge SSR and Convex data - Convex takes priority when available (client-side)
  const onboarding = computed(() => {
    // Prefer Convex data on client (real-time)
    if (process.client && convexOnboarding.value) {
      return convexOnboarding.value
    }
    
    // Fall back to SSR data
    if (ssrOnboarding.value?.onboarding) {
      return ssrOnboarding.value.onboarding
    }
    
    // Default (not onboarded)
    return {
      completedSteps: [],
      completed: false,
      data: {},
      updatedAt: null,
    }
  })

  const update = async (completedSteps: string[], completed: boolean, data?: Record<string, unknown>) => {
    await upsertMutation.mutate({ completedSteps, completed, data })
  }

  return {
    onboarding,
    isHydrated,
    update,
  }
}

