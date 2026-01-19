import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useWebhooks() {
  const { data: endpoints } = useConvexQuery(api.webhooks.listEndpointsForCurrentOrg, {})
  const createMutation = useConvexMutation(api.webhooks.createEndpointForCurrentOrg)
  const updateMutation = useConvexMutation(api.webhooks.updateEndpointForCurrentOrg)
  const deleteMutation = useConvexMutation(api.webhooks.deleteEndpointForCurrentOrg)
  const deliveriesQuery = useConvexQuery(api.webhooks.listDeliveriesForCurrentOrg, { limit: 100 })

  const createEndpoint = async (payload: { name: string; url: string; events: string[]; enabled?: boolean }) => {
    return await createMutation.mutate({
      name: payload.name,
      url: payload.url,
      events: payload.events,
      enabled: payload.enabled ?? true,
    })
  }

  const updateEndpoint = async (id: string, payload: { name?: string; url?: string; events?: string[]; enabled?: boolean; secret?: string }) => {
    await updateMutation.mutate({
      id,
      name: payload.name,
      url: payload.url,
      events: payload.events,
      enabled: payload.enabled,
      secret: payload.secret,
    })
  }

  const deleteEndpoint = async (id: string) => {
    await deleteMutation.mutate({ id })
  }

  const listDeliveries = () => {
    return deliveriesQuery.data.value ?? []
  }

  return {
    endpoints,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    listDeliveries,
  }
}

