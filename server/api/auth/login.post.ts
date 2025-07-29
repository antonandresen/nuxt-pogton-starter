import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { eq } from 'drizzle-orm'
import { users } from '../../../drizzle/schema'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const foundUser = user[0]

  if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  // Generate JWT using jose
  const secret = new TextEncoder().encode(config.jwtSecret)
  const token = await new jose.SignJWT({ userId: foundUser.id, role: foundUser.role })
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
      id: foundUser.id,
      email: foundUser.email,
      createdAt: foundUser.createdAt,
      role: foundUser.role,
    },
  }
})
