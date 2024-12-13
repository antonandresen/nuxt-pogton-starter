import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import prisma from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  // Generate JWT using jose
  const secret = new TextEncoder().encode(config.jwtSecret)
  const token = await new jose.SignJWT({ userId: user.id, role: user.role })
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
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  }
})
