import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useApiKeys() {
  const { data: keys } = useConvexQuery(api.apiKeys.listForCurrentOrg, {})
  const createMutation = useConvexMutation(api.apiKeys.createForCurrentOrg)
  const revokeMutation = useConvexMutation(api.apiKeys.revokeForCurrentOrg)

  const create = async (name: string) => {
    return await createMutation.mutate({ name })
  }

  const revoke = async (id: string) => {
    await revokeMutation.mutate({ id })
  }

  return {
    keys,
    create,
    revoke,
  }
}

