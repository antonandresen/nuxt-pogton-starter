import { defineEventHandler, readBody, createError, setCookie, setHeader } from 'h3'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { convex, api } from '../../utils/convex'
import { toSlug } from '../../utils/slug'
import crypto from 'node:crypto'
import { getClientIdentifier, rateLimit } from '../../utils/rate-limit'

export default defineEventHandler(async (event) => {
  const identifier = getClientIdentifier(event)
  const limit = rateLimit(`auth:signup:${identifier}`, 5, 60_000)
  setHeader(event, 'x-rate-limit-remaining', String(limit.remaining))
  setHeader(event, 'x-rate-limit-reset', String(limit.resetAt))
  if (!limit.ok) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  // Check if user already exists
  const existingUser = await convex.query(api.users.getByEmail, { email })
  
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'User already exists' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const userId = await convex.mutation(api.users.create, {
    email,
    password: hashedPassword,
  })

  const baseSlug = toSlug(email.split('@')[0] || 'workspace')
  const slug = `${baseSlug}-${crypto.randomBytes(3).toString('hex')}`

  const orgId = await convex.mutation(api.orgs.create, {
    name: 'My Workspace',
    slug,
    createdBy: userId,
  })

  await convex.mutation(api.memberships.create, {
    orgId,
    userId,
    role: 'OWNER',
    status: 'ACTIVE',
  })

  await convex.mutation(api.users.updateCurrentOrg, {
    id: userId,
    currentOrgId: orgId,
  })

  await convex.mutation(api.onboarding.upsert, {
    userId,
    completedSteps: [],
    completed: false,
  })

  await convex.mutation(api.auditLogs.create, {
    orgId,
    actorId: userId,
    action: 'org.created',
    targetType: 'organization',
    targetId: orgId,
    meta: { source: 'signup' },
  })

  // Get the created user
  const newUser = await convex.query(api.users.getById, { id: userId })

  if (!newUser) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
  }

  // Generate JWT using jose
  const secret = new TextEncoder().encode(config.JWT_SECRET)
  const token = await new jose.SignJWT({ userId: newUser._id, role: newUser.role })
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
      id: newUser._id,
      email: newUser.email,
      createdAt: new Date(newUser.createdAt),
      role: newUser.role,
      avatar: newUser.avatar,
      name: newUser.name,
      currentOrgId: newUser.currentOrgId ?? null,
    },
  }
})
