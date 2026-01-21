import { ConvexHttpClient } from "convex/browser"

// Manual type to avoid import resolution issues
export type Id<T extends string> = string & { __tableName: T }

const convexUrl = process.env.CONVEX_URL || ""

if (!convexUrl) {
  console.warn("CONVEX_URL not set")
}

export const convex = new ConvexHttpClient(convexUrl)

// Manual API object - mirrors convex/_generated/api
export const api = {
  users: {
    getByEmail: 'users:getByEmail' as any,
    getById: 'users:getById' as any,
    getByStripeCustomerId: 'users:getByStripeCustomerId' as any,
    list: 'users:list' as any,
    create: 'users:create' as any,
    updateStripeCustomerId: 'users:updateStripeCustomerId' as any,
    updateRole: 'users:updateRole' as any,
    updateAvatar: 'users:updateAvatar' as any,
    getCurrent: 'users:getCurrent' as any,
  },
  subscriptions: {
    getByUserId: 'subscriptions:getByUserId' as any,
    deleteByUserId: 'subscriptions:deleteByUserId' as any,
    create: 'subscriptions:create' as any,
  },
  purchases: {
    getByUserId: 'purchases:getByUserId' as any,
    create: 'purchases:create' as any,
  },
  orgs: {
    listMine: 'orgs:listMine' as any,
    createForCurrentUser: 'orgs:createForCurrentUser' as any,
    switchCurrentOrg: 'orgs:switchCurrentOrg' as any,
  },
  cms: {
    listPublishedSummaries: 'cms:listPublishedSummaries' as any,
  },
  aiChat: {
    getPublicConfig: 'aiChat:getPublicConfig' as any,
    getAdminConfig: 'aiChat:getAdminConfig' as any,
    getRuntimeConfig: 'aiChat:getRuntimeConfig' as any,
  },
} as const
