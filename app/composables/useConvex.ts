/**
 * Convex Vue Composables
 * 
 * Real-time reactive data from Convex.
 * Uses @convex-vue/core for Vue integration.
 * 
 * @see https://docs.convex.dev/client/vue
 */

import { useConvexQuery, useConvexMutation, useConvexAction } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

// Re-export for convenience
export { api, useConvexQuery, useConvexMutation, useConvexAction }
export type { Id }

/**
 * Get current user's subscription with real-time updates
 * 
 * @example
 * const { data: subscription, isLoading } = useCurrentUserSubscription(() => user.value?.id)
 */
export function useCurrentUserSubscription(userId: () => string | null | undefined) {
  return useConvexQuery(
    api.subscriptions.getByUserId,
    () => {
      const id = userId()
      // Skip query if no user ID
      return id ? { userId: id as Id<"users"> } : { userId: '' as Id<"users"> }
    }
  )
}

/**
 * Get current user's purchases with real-time updates
 */
export function useUserPurchases(userId: () => string | null | undefined) {
  return useConvexQuery(
    api.purchases.getByUserId,
    () => {
      const id = userId()
      return id ? { userId: id as Id<"users"> } : { userId: '' as Id<"users"> }
    }
  )
}

/**
 * Get all users list (admin) with real-time updates
 */
export function useUsersList() {
  return useConvexQuery(api.users.list, {})
}

/**
 * Mutation hook for updating user role
 */
export function useUpdateUserRole() {
  return useConvexMutation(api.users.updateRole)
}
