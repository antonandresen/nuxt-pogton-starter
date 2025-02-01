import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import prisma from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { sendWelcomeEmail } from '~/server/utils/onesignal'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'Email already in use' })
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

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

  // Send welcome email
  try {
    await sendWelcomeEmail(email, email.split('@')[0])
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't throw error here, as the user is already registered
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  }
})
