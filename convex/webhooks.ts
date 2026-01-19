import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireOrgPermission } from "./helpers"

export const listEndpointsByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("webhookEndpoints")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()
  },
})

export const getEndpointById = query({
  args: { id: v.id("webhookEndpoints") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createEndpoint = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    url: v.string(),
    secret: v.string(),
    events: v.array(v.string()),
    enabled: v.boolean(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("webhookEndpoints", {
      orgId: args.orgId,
      name: args.name,
      url: args.url,
      secret: args.secret,
      events: args.events,
      enabled: args.enabled,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateEndpoint = mutation({
  args: {
    id: v.id("webhookEndpoints"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    secret: v.optional(v.string()),
    events: v.optional(v.array(v.string())),
    enabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    }

    if (args.name !== undefined) updates.name = args.name
    if (args.url !== undefined) updates.url = args.url
    if (args.secret !== undefined) updates.secret = args.secret
    if (args.events !== undefined) updates.events = args.events
    if (args.enabled !== undefined) updates.enabled = args.enabled

    await ctx.db.patch(args.id, updates)
  },
})

export const deleteEndpoint = mutation({
  args: { id: v.id("webhookEndpoints") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const listDeliveriesByOrg = query({
  args: { orgId: v.id("organizations"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100
    return await ctx.db
      .query("webhookDeliveries")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(limit)
  },
})

export const createDelivery = mutation({
  args: {
    orgId: v.id("organizations"),
    endpointId: v.id("webhookEndpoints"),
    event: v.string(),
    status: v.string(),
    requestBody: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("webhookDeliveries", {
      orgId: args.orgId,
      endpointId: args.endpointId,
      event: args.event,
      status: args.status,
      requestBody: args.requestBody,
      createdAt: Date.now(),
    })
  },
})

export const updateDelivery = mutation({
  args: {
    id: v.id("webhookDeliveries"),
    status: v.optional(v.string()),
    statusCode: v.optional(v.number()),
    responseBody: v.optional(v.string()),
    error: v.optional(v.string()),
    finishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {}
    if (args.status !== undefined) updates.status = args.status
    if (args.statusCode !== undefined) updates.statusCode = args.statusCode
    if (args.responseBody !== undefined) updates.responseBody = args.responseBody
    if (args.error !== undefined) updates.error = args.error
    if (args.finishedAt !== undefined) updates.finishedAt = args.finishedAt

    await ctx.db.patch(args.id, updates)
  },
})

function randomHex(bytes: number) {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export const listEndpointsForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "webhook:read")
    return await ctx.db
      .query("webhookEndpoints")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()
  },
})

export const createEndpointForCurrentOrg = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    events: v.array(v.string()),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = await requireOrgPermission(ctx, "webhook:write")
    const now = Date.now()
    const secret = randomHex(24)
    const id = await ctx.db.insert("webhookEndpoints", {
      orgId,
      name: args.name,
      url: args.url,
      secret,
      events: args.events,
      enabled: args.enabled,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id,
      name: args.name,
      url: args.url,
      events: args.events,
      enabled: args.enabled,
      secret,
    }
  },
})

export const updateEndpointForCurrentOrg = mutation({
  args: {
    id: v.id("webhookEndpoints"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    secret: v.optional(v.string()),
    events: v.optional(v.array(v.string())),
    enabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "webhook:write")
    const endpoint = await ctx.db.get(args.id)
    if (!endpoint || endpoint.orgId !== orgId) {
      throw new Error("Webhook endpoint not found")
    }
    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    }
    if (args.name !== undefined) updates.name = args.name
    if (args.url !== undefined) updates.url = args.url
    if (args.secret !== undefined) updates.secret = args.secret
    if (args.events !== undefined) updates.events = args.events
    if (args.enabled !== undefined) updates.enabled = args.enabled
    await ctx.db.patch(args.id, updates)
  },
})

export const deleteEndpointForCurrentOrg = mutation({
  args: { id: v.id("webhookEndpoints") },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "webhook:write")
    const endpoint = await ctx.db.get(args.id)
    if (!endpoint || endpoint.orgId !== orgId) {
      throw new Error("Webhook endpoint not found")
    }
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const listDeliveriesForCurrentOrg = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "webhook:read")
    const limit = args.limit ?? 100
    return await ctx.db
      .query("webhookDeliveries")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(limit)
  },
})

