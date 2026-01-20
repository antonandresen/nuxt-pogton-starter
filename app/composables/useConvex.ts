/**
 * Convex Vue Composables
 * 
 * Real-time reactive data from Convex.
 * Uses @convex-vue/core for Vue integration.
 * 
 * @see https://docs.convex.dev/client/vue
 */

import { useConvexQuery as _useConvexQuery, useConvexMutation as _useConvexMutation, useConvexAction as _useConvexAction } from '@convex-vue/core'

// Manual type definitions to avoid import issues
export type Id<T extends string> = string & { __tableName: T }

// Manual API type - update this when adding new Convex functions
export const api = {
  users: {
    getByEmail: 'users:getByEmail',
    getById: 'users:getById',
    getByStripeCustomerId: 'users:getByStripeCustomerId',
    getAdmins: 'users:getAdmins',
    list: 'users:list',
    create: 'users:create',
    updateStripeCustomerId: 'users:updateStripeCustomerId',
    updateRole: 'users:updateRole',
    updateAvatar: 'users:updateAvatar',
    updatePassword: 'users:updatePassword',
    updateCurrentOrg: 'users:updateCurrentOrg',
    updateName: 'users:updateName',
    getCurrent: 'users:getCurrent',
    updateNameForCurrentUser: 'users:updateNameForCurrentUser',
    updatePasswordForCurrentUser: 'users:updatePasswordForCurrentUser',
    updateAvatarForCurrentUser: 'users:updateAvatarForCurrentUser',
  },
  subscriptions: {
    getByUserId: 'subscriptions:getByUserId',
    deleteByUserId: 'subscriptions:deleteByUserId',
    create: 'subscriptions:create',
  },
  purchases: {
    getByUserId: 'purchases:getByUserId',
    create: 'purchases:create',
  },
  orgs: {
    getById: 'orgs:getById',
    getBySlug: 'orgs:getBySlug',
    listMine: 'orgs:listMine',
    createForCurrentUser: 'orgs:createForCurrentUser',
    switchCurrentOrg: 'orgs:switchCurrentOrg',
  },
  memberships: {
    getByOrgAndUser: 'memberships:getByOrgAndUser',
    listByOrg: 'memberships:listByOrg',
    listByUser: 'memberships:listByUser',
  },
  invites: {
    listByOrg: 'invites:listByOrg',
    createForCurrentOrg: 'invites:createForCurrentOrg',
    acceptForCurrentUser: 'invites:acceptForCurrentUser',
  },
  auditLogs: {
    listForCurrentOrg: 'auditLogs:listForCurrentOrg',
  },
  featureFlags: {
    listForCurrentOrg: 'featureFlags:listForCurrentOrg',
    upsertForCurrentOrg: 'featureFlags:upsertForCurrentOrg',
  },
  usage: {
    listForCurrentOrg: 'usage:listForCurrentOrg',
  },
  notifications: {
    listForCurrentUser: 'notifications:listForCurrentUser',
    markReadForCurrentUser: 'notifications:markReadForCurrentUser',
    markAllReadForCurrentUser: 'notifications:markAllReadForCurrentUser',
  },
  apiKeys: {
    listForCurrentOrg: 'apiKeys:listForCurrentOrg',
    createForCurrentOrg: 'apiKeys:createForCurrentOrg',
    revokeForCurrentOrg: 'apiKeys:revokeForCurrentOrg',
  },
  webhooks: {
    listEndpointsForCurrentOrg: 'webhooks:listEndpointsForCurrentOrg',
    createEndpointForCurrentOrg: 'webhooks:createEndpointForCurrentOrg',
    updateEndpointForCurrentOrg: 'webhooks:updateEndpointForCurrentOrg',
    deleteEndpointForCurrentOrg: 'webhooks:deleteEndpointForCurrentOrg',
    listDeliveriesForCurrentOrg: 'webhooks:listDeliveriesForCurrentOrg',
  },
  onboarding: {
    getForCurrentUser: 'onboarding:getForCurrentUser',
    upsertForCurrentUser: 'onboarding:upsertForCurrentUser',
  },
} as const

// Re-export composables
export function useConvexQuery(...args: any[]) {
  if (process.server) {
    return {
      data: ref(null),
      isLoading: ref(false),
      error: ref(null),
    }
  }
  return (_useConvexQuery as any)(...args)
}

export function useConvexMutation(mutation: any) {
  return (_useConvexMutation as any)(mutation)
}

export function useConvexAction(action: any) {
  return (_useConvexAction as any)(action)
}

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
