import { createError } from "h3"
import type { H3Event } from "h3"
import { convex, api } from "./convex"
import { hasPermission, type Permission, type OrgRole } from "./permissions"
import type { Id } from "../../convex/_generated/dataModel"

export async function requireOrgContext(event: H3Event) {
  const userId = event.context.userId as Id<"users"> | undefined

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const user = await convex.query(api.users.getById, { id: userId })

  if (!user || !user.currentOrgId) {
    throw createError({ statusCode: 400, statusMessage: "No org selected" })
  }

  const org = await convex.query(api.orgs.getById, { id: user.currentOrgId })
  const membership = await convex.query(api.memberships.getByUserAndOrg, {
    userId,
    orgId: user.currentOrgId,
  })

  if (!org || !membership) {
    throw createError({ statusCode: 403, statusMessage: "Org access denied" })
  }

  if (membership.status !== "ACTIVE") {
    throw createError({ statusCode: 403, statusMessage: "Org membership inactive" })
  }

  return {
    userId,
    orgId: user.currentOrgId,
    org,
    membership,
  }
}

export async function requireOrgPermission(event: H3Event, permission: Permission) {
  const context = await requireOrgContext(event)
  const role = context.membership.role as OrgRole

  if (!hasPermission(role, permission)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  return context
}

