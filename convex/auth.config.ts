import type { AuthConfig } from "convex/server"

const issuer = process.env.CONVEX_AUTH_ISSUER || "http://localhost:3000"
const jwks = process.env.CONVEX_AUTH_JWKS_URL || `${issuer}/api/convex/jwks`
const applicationID = process.env.CONVEX_AUTH_AUDIENCE || "convex"

export default {
  providers: [
    {
      type: "customJwt",
      issuer,
      jwks,
      algorithm: "RS256",
      applicationID,
    },
  ],
} satisfies AuthConfig

