## Convex conventions (this repo)

- **Client data access**: default to Convex queries/mutations (`useConvexQuery` / `useConvexMutation`) for app data.
- **Auth + permissions**:
  - All Convex functions that touch user/org data must enforce `ctx.auth` and org permissions.
  - Don’t add CRUD-style `server/api` endpoints for app data. If it can be a Convex function, it must be.
- **Allowed `server/api/**`**:
  - auth session issuance
  - Convex auth token/JWKS
  - Stripe (checkout/portal/success) + webhooks
  - other non-Convex side effects requiring secrets
- **Generated client API map** (CRITICAL):
  - When adding/renaming Convex functions, **you MUST update** the manual `api` object in `app/composables/useConvex.ts`
  - Format: `moduleName: { functionName: 'moduleName:functionName' }`
  - Without this, the Vue pages will fail silently (blank page, no errors)
  - See [`.cursor/rules/convex-api.mdc`](../../.cursor/rules/convex-api.mdc) for details
