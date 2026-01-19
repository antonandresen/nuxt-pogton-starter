import { exportJWK, importSPKI } from 'jose'
import { createError } from 'h3'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const publicKey = config.convexAuthPublicKey
  const keyId = config.convexAuthKeyId

  if (!publicKey) {
    throw createError({ statusCode: 500, statusMessage: 'Convex public key not configured' })
  }

  const key = await importSPKI(publicKey, 'RS256')
  const jwk = await exportJWK(key)

  return {
    keys: [
      {
        ...jwk,
        use: 'sig',
        alg: 'RS256',
        kid: keyId || undefined,
      }
    ],
  }
})

