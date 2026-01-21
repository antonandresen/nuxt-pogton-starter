import { defineEventHandler, readBody, createError, setCookie, setHeader } from 'h3'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { convex, api } from '../../utils/convex'
import { getClientIdentifier, rateLimit } from '../../utils/rate-limit'

export default defineEventHandler(async (event) => {
  const identifier = getClientIdentifier(event)
  const limit = rateLimit(`auth:login:${identifier}`, 10, 60_000)
  setHeader(event, 'x-rate-limit-remaining', String(limit.remaining))
  setHeader(event, 'x-rate-limit-reset', String(limit.resetAt))
  if (!limit.ok) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  const foundUser = await convex.query(api.users.getByEmail, { email })

  if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  // Generate JWT using jose
  const secret = new TextEncoder().encode(config.JWT_SECRET)
  const token = await new jose.SignJWT({ userId: foundUser._id, role: foundUser.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  // Set HTTP-only cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return {
    user: {
      id: foundUser._id,
      email: foundUser.email,
      createdAt: new Date(foundUser.createdAt),
      role: foundUser.role,
      avatar: foundUser.avatar,
      name: foundUser.name,
      currentOrgId: foundUser.currentOrgId ?? null,
    },
  }
})
