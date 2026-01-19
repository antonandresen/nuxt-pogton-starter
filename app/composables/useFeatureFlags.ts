import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useFeatureFlags() {
  const { data: flags } = useConvexQuery(api.featureFlags.listForCurrentOrg, {})
  const upsertMutation = useConvexMutation(api.featureFlags.upsertForCurrentOrg)

  const isEnabled = (key: string) => {
    return flags.value?.find((flag) => flag.key === key)?.enabled ?? false
  }

  const upsert = async (key: string, enabled: boolean, rules?: unknown) => {
    return await upsertMutation.mutate({ key, enabled, rules })
  }

  return {
    flags,
    upsert,
    isEnabled,
  }
}

