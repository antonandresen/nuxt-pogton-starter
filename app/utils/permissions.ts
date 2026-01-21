const rolePermissions = {
  OWNER: [
    "org:read",
    "org:write",
    "member:read",
    "member:write",
    "billing:read",
    "billing:write",
    "audit:read",
    "feature_flag:read",
    "feature_flag:write",
    "usage:read",
    "usage:write",
    "api_key:read",
    "api_key:write",
    "webhook:read",
    "webhook:write",
    "cms:read",
    "cms:write",
    "crm:read",
    "crm:write",
  ],
  ADMIN: [
    "org:read",
    "org:write",
    "member:read",
    "member:write",
    "billing:read",
    "audit:read",
    "feature_flag:read",
    "feature_flag:write",
    "usage:read",
    "usage:write",
    "api_key:read",
    "api_key:write",
    "webhook:read",
    "webhook:write",
    "cms:read",
    "cms:write",
    "crm:read",
    "crm:write",
  ],
  STAFF: [
    "org:read",
    "member:read",
    "cms:read",
    "cms:write",
    "crm:read",
    "crm:write",
  ],
  MEMBER: [
    "org:read",
    "member:read",
    "billing:read",
    "audit:read",
    "feature_flag:read",
    "usage:read",
    "api_key:read",
    "webhook:read",
  ],
} as const

export type OrgRole = keyof typeof rolePermissions
export type Permission = (typeof rolePermissions)[OrgRole][number]

export function hasPermission(role: OrgRole | null | undefined, permission: Permission) {
  if (!role) return false
  return (rolePermissions[role] as readonly Permission[] | undefined)?.includes(permission) ?? false
}

