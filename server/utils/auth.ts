import { defineEventHandler, getCookie, createError } from 'h3'
import * as jose from 'jose'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const secretValue = (config.JWT_SECRET || config.jwtSecret) as string | undefined
    if (!secretValue) {
      throw new Error('Missing JWT secret')
    }
    const secret = new TextEncoder().encode(secretValue)
    const { payload } = await jose.jwtVerify(token, secret)
    event.context.userId = payload.userId as string
    event.context.role = payload.role as string | undefined
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
