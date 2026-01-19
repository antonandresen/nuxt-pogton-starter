import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
    stripeCustomerId: v.optional(v.string()),
    role: v.union(v.literal("USER"), v.literal("ADMIN")),
    name: v.optional(v.string()),
    currentOrgId: v.optional(v.id("organizations")),
    avatar: v.optional(v.string()), // Custom avatar URL or null to use Gravatar
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_stripeCustomerId", ["stripeCustomerId"])
    .index("by_role", ["role"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    priceId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.boolean(),
    paymentMethodBrand: v.optional(v.string()),
    paymentMethodLast4: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

  purchases: defineTable({
    userId: v.id("users"),
    stripeSessionId: v.string(),
    stripePaymentId: v.string(),
    productId: v.string(),
    productName: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeSessionId", ["stripeSessionId"])
    .index("by_stripePaymentId", ["stripePaymentId"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_createdBy", ["createdBy"]),

  memberships: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_orgId", ["orgId"])
    .index("by_orgId_userId", ["orgId", "userId"]),

  invites: defineTable({
    orgId: v.id("organizations"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    createdBy: v.id("users"),
    acceptedBy: v.optional(v.id("users")),
    acceptedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  auditLogs: defineTable({
    orgId: v.id("organizations"),
    actorId: v.id("users"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    meta: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_actorId", ["actorId"]),

  featureFlags: defineTable({
    orgId: v.id("organizations"),
    key: v.string(),
    enabled: v.boolean(),
    rules: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_orgId_key", ["orgId", "key"]),

  usageMetrics: defineTable({
    orgId: v.id("organizations"),
    metric: v.string(),
    current: v.number(),
    limit: v.optional(v.number()),
    period: v.string(),
    periodStart: v.number(),
    periodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_orgId_metric", ["orgId", "metric"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    type: v.string(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_readAt", ["userId", "readAt"]),

  apiKeys: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    keyPrefix: v.string(),
    hashedKey: v.string(),
    createdBy: v.id("users"),
    lastUsedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_keyPrefix", ["keyPrefix"]),

  webhookEndpoints: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    url: v.string(),
    secret: v.string(),
    events: v.array(v.string()),
    enabled: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_orgId_enabled", ["orgId", "enabled"]),

  webhookDeliveries: defineTable({
    orgId: v.id("organizations"),
    endpointId: v.id("webhookEndpoints"),
    event: v.string(),
    status: v.string(),
    statusCode: v.optional(v.number()),
    requestBody: v.optional(v.string()),
    responseBody: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    finishedAt: v.optional(v.number()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_endpointId", ["endpointId"]),

  onboarding: defineTable({
    userId: v.id("users"),
    completedSteps: v.array(v.string()),
    completed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),
})

