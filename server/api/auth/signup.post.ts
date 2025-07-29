import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { eq } from 'drizzle-orm'
import { users } from '../../../drizzle/schema'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
  
  if (existingUser.length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'User already exists' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const [newUser] = await db.insert(users).values({
    email,
    password: hashedPassword,
  }).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    role: users.role,
  })

  // Generate JWT using jose
  const secret = new TextEncoder().encode(config.jwtSecret)
  const token = await new jose.SignJWT({ userId: newUser.id, role: newUser.role })
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
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      role: newUser.role,
    },
  }
})
