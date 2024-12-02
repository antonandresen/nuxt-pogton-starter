import { defineEventHandler, getCookie, createError } from 'h3'
import * as jose from 'jose'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const secret = new TextEncoder().encode(config.jwtSecret)
    const { payload } = await jose.jwtVerify(token, secret)
    event.context.userId = payload.userId as number
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
