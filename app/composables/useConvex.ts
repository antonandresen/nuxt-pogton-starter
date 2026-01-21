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
    listStripeCustomersForAdmin: 'users:listStripeCustomersForAdmin',
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
    listAllForAdmin: 'subscriptions:listAllForAdmin',
  },
  purchases: {
    getByUserId: 'purchases:getByUserId',
    create: 'purchases:create',
    listAllForAdmin: 'purchases:listAllForAdmin',
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
    listMine: 'memberships:listMine',
    listForCurrentOrg: 'memberships:listForCurrentOrg',
  },
  invites: {
    listByOrg: 'invites:listByOrg',
    listForCurrentOrg: 'invites:listForCurrentOrg',
    createForCurrentOrg: 'invites:createForCurrentOrg',
    acceptByToken: 'invites:acceptByToken',
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
  cms: {
    listForCurrentOrg: 'cms:listForCurrentOrg',
    getByIdForCurrentOrg: 'cms:getByIdForCurrentOrg',
    getBySlugForCurrentOrg: 'cms:getBySlugForCurrentOrg',
    getPublishedByOrgSlugAndSlug: 'cms:getPublishedByOrgSlugAndSlug',
    listPublishedSummaries: 'cms:listPublishedSummaries',
    upsertForCurrentOrg: 'cms:upsertForCurrentOrg',
    deleteForCurrentOrg: 'cms:deleteForCurrentOrg',
  },
  aiChat: {
    getPublicConfig: 'aiChat:getPublicConfig',
    getAdminConfig: 'aiChat:getAdminConfig',
    upsertAdminConfig: 'aiChat:upsertAdminConfig',
    ask: 'aiChat:ask',
  },
  crm: {
    listForCurrentOrg: 'crm:listForCurrentOrg',
    upsertForCurrentOrg: 'crm:upsertForCurrentOrg',
    addNoteForCurrentOrg: 'crm:addNoteForCurrentOrg',
    listNotesForCurrentOrg: 'crm:listNotesForCurrentOrg',
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
  if (process.server) {
    return {
      mutate: async () => {
        throw new Error('Convex mutations are client-only')
      },
      isLoading: ref(false),
      error: ref(null),
    }
  }
  return (_useConvexMutation as any)(mutation)
}

export function useConvexAction(action: any) {
  if (process.server) {
    return {
      run: async () => {
        throw new Error('Convex actions are client-only')
      },
      isLoading: ref(false),
      error: ref(null),
    }
  }
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
