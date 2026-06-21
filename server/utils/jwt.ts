import { SignJWT, importPKCS8 } from 'jose'

interface TokenUser {
  id: string
  email: string
  name?: string
  role: string
  currentOrgId?: string | null
}

/**
 * Sign an RS256 session JWT for the given user.
 * Uses the same RSA keypair as Convex auth tokens — no separate JWT_SECRET needed.
 */
export async function signSessionToken(user: TokenUser): Promise<string> {
  const config = useRuntimeConfig()

  const privateKey = config.convexAuthPrivateKey as string
  const issuer = config.convexAuthIssuer as string
  const audience = config.convexAuthAudience as string
  const keyId = config.convexAuthKeyId as string

  if (!privateKey) {
    throw new Error('CONVEX_AUTH_PRIVATE_KEY not configured')
  }

  const formattedKey = privateKey.replace(/\\n/g, '\n')
  const signingKey = await importPKCS8(formattedKey, 'RS256')

  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    currentOrgId: user.currentOrgId ?? null,
  })
    .setProtectedHeader({ alg: 'RS256', kid: keyId || undefined })
    .setIssuedAt()
    .setIssuer(issuer || 'pogton-starter')
    .setAudience(audience || 'convex')
    .setSubject(user.id)
    .setExpirationTime('7d')
    .sign(signingKey)
}
