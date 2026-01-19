import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useNotifications() {
  const { data: notifications } = useConvexQuery(api.notifications.listForCurrentUser, {})
  const markReadMutation = useConvexMutation(api.notifications.markReadForCurrentUser)
  const markAllReadMutation = useConvexMutation(api.notifications.markAllReadForCurrentUser)

  const markRead = async (id: string) => {
    await markReadMutation.mutate({ id })
  }

  const markAllRead = async () => {
    await markAllReadMutation.mutate({})
  }

  return {
    notifications,
    markRead,
    markAllRead,
  }
}

