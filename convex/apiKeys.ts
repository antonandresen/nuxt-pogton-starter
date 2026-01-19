import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireOrgPermission } from "./helpers"

export const listByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect()
  },
})

export const getByPrefix = query({
  args: { keyPrefix: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_keyPrefix", (q) => q.eq("keyPrefix", args.keyPrefix))
      .first()
  },
})

export const create = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    keyPrefix: v.string(),
    hashedKey: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("apiKeys", {
      orgId: args.orgId,
      name: args.name,
      keyPrefix: args.keyPrefix,
      hashedKey: args.hashedKey,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    })
  },
})

export const revoke = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      revokedAt: Date.now(),
    })
  },
})

export const touchLastUsed = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastUsedAt: Date.now(),
    })
  },
})

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function hashSha256(value: string) {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return toHex(digest)
}

function randomHex(bytes: number) {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "api_key:read")
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .collect()
  },
})

export const createForCurrentOrg = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const { orgId, userId } = await requireOrgPermission(ctx, "api_key:write")
    const raw = `pk_${randomHex(24)}`
    const keyPrefix = raw.slice(0, 10)
    const hashedKey = await hashSha256(raw)

    const id = await ctx.db.insert("apiKeys", {
      orgId,
      name: args.name,
      keyPrefix,
      hashedKey,
      createdBy: userId,
      createdAt: Date.now(),
    })

    return {
      id,
      name: args.name,
      keyPrefix,
      token: raw,
    }
  },
})

export const revokeForCurrentOrg = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "api_key:write")
    const key = await ctx.db.get(args.id)
    if (!key || key.orgId !== orgId) {
      throw new Error("API key not found")
    }
    await ctx.db.patch(args.id, {
      revokedAt: Date.now(),
    })
  },
})

