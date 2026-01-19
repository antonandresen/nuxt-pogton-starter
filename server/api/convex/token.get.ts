import authMiddleware from '../../utils/auth'
import { convex, api } from '../../utils/convex'
import type { Id } from '../../../convex/_generated/dataModel'
import { SignJWT, importPKCS8 } from 'jose'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  await authMiddleware(event)

  const config = useRuntimeConfig()
  const userId = event.context.userId as Id<"users">
  const user = await convex.query(api.users.getById, { id: userId })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const issuer = config.convexAuthIssuer || config.public?.convexAuthIssuer
  const audience = config.convexAuthAudience || config.public?.convexAuthAudience
  const privateKey = config.convexAuthPrivateKey
  const keyId = config.convexAuthKeyId

  if (!issuer || !audience || !privateKey) {
    throw createError({ statusCode: 500, statusMessage: 'Convex auth not configured' })
  }

  const signingKey = await importPKCS8(privateKey, 'RS256')

  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    orgId: user.currentOrgId ?? null,
  })
    .setProtectedHeader({ alg: 'RS256', kid: keyId || undefined })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(user._id)
    .setExpirationTime('1h')
    .sign(signingKey)

  return { token }
})

