import { ConvexHttpClient } from "convex/browser"
import type { Id } from "../../convex/_generated/dataModel"

const convexUrl = process.env.CONVEX_URL || ""

if (!convexUrl) {
  console.warn("CONVEX_URL not set")
}

export const convex = new ConvexHttpClient(convexUrl)

// Manually typed API object to avoid import issues
export const api = {
  users: {
    getByEmail: "users:getByEmail",
    getById: "users:getById",
    getByStripeCustomerId: "users:getByStripeCustomerId",
    list: "users:list",
    create: "users:create",
    updateStripeCustomerId: "users:updateStripeCustomerId",
    updateRole: "users:updateRole"
  },
  subscriptions: {
    getByUserId: "subscriptions:getByUserId",
    deleteByUserId: "subscriptions:deleteByUserId",
    create: "subscriptions:create"
  },
  purchases: {
    getByUserId: "purchases:getByUserId",
    create: "purchases:create"
  }
} as const

export type { Id }
