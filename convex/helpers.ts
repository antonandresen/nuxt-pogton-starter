/**
 * Convex Helper Functions
 * 
 * Per Convex best practices, shared business logic should be in helper functions.
 * These can be used across queries, mutations, and actions.
 * 
 * @see https://docs.convex.dev/understanding/best-practices/
 */

import type { QueryCtx, MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { hasPermission, type OrgRole, type Permission } from "./permissions"

/**
 * Get a user by their ID with null safety
 */
export async function getUserById(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  return await ctx.db.get(userId)
}

/**
 * Get a user by email
 */
export async function getUserByEmail(ctx: QueryCtx | MutationCtx, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first()
}

/**
 * Get a user by Stripe customer ID
 */
export async function getUserByStripeCustomerId(ctx: QueryCtx | MutationCtx, stripeCustomerId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", stripeCustomerId))
    .first()
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const now = Date.now()
  const subscription = await ctx.db
    .query("subscriptions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(
        q.eq(q.field("deletedAt"), undefined),
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "trialing"),
          q.and(
            q.eq(q.field("status"), "canceled"),
            q.gt(q.field("currentPeriodEnd"), now)
          )
        )
      )
    )
    .first()
  
  return subscription !== null
}

/**
 * Get the current timestamp
 */
export function now() {
  return Date.now()
}

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error("Unauthorized")
  }
  const userId = identity.subject as Id<"users">
  const user = await ctx.db.get(userId)
  if (!user) {
    throw new Error("User not found")
  }
  return { identity, userId, user }
}

export async function requireCurrentOrg(ctx: QueryCtx | MutationCtx) {
  const { userId, user } = await requireUser(ctx)
  if (!user.currentOrgId) {
    throw new Error("No org selected")
  }
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_orgId_userId", (q) =>
      q.eq("orgId", user.currentOrgId).eq("userId", userId)
    )
    .filter((q) => q.eq(q.field("deletedAt"), undefined))
    .first()

  if (!membership || membership.status !== "ACTIVE") {
    throw new Error("Org access denied")
  }

  return {
    userId,
    user,
    orgId: user.currentOrgId,
    membership,
  }
}

export async function requireOrgPermission(ctx: QueryCtx | MutationCtx, permission: Permission) {
  const context = await requireCurrentOrg(ctx)
  const role = context.membership.role as OrgRole
  if (!hasPermission(role, permission)) {
    throw new Error("Forbidden")
  }
  return context
}

