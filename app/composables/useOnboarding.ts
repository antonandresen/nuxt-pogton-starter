import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useOnboarding() {
  const { data: onboardingData } = useConvexQuery(api.onboarding.getForCurrentUser, {})
  const upsertMutation = useConvexMutation(api.onboarding.upsertForCurrentUser)

  const onboarding = computed(() => {
    return (
      onboardingData.value || {
        completedSteps: [],
        completed: false,
        updatedAt: null,
      }
    )
  })

  const update = async (completedSteps: string[], completed: boolean) => {
    await upsertMutation.mutate({ completedSteps, completed })
  }

  return {
    onboarding,
    update,
  }
}

