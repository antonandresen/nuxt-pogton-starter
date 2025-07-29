import { defineNuxtPlugin, useState, useRuntimeConfig } from '#app'
import * as jose from 'jose'

interface User {
  id: number
  email: string
  createdAt: string
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useState<User | null>('auth-user', () => null)
  const config = useRuntimeConfig()

  // If user is already set, do nothing
  if (user.value) return

  let token: string | undefined

  if (import.meta.server) {
    // On server, get token from the event context
    const event = nuxtApp.ssrContext?.event
    token = event?.req.headers.cookie?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1]
  } else {
    // On client, get token from document.cookie
    token = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1]
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(config.jwtSecret)
      const { payload } = await jose.jwtVerify(token, secret)

      const userId = payload.userId as number

      if (import.meta.server) {
        // Dynamically import db only on the server
        const { default: db } = await import('../../server/utils/db')
        const { users } = await import('../../drizzle/schema')
        const { eq } = await import('drizzle-orm')
        
        // Fetch user data from the database on the server
        const dbUserResult = await db.select({
          id: users.id,
          email: users.email,
          createdAt: users.createdAt,
          role: users.role
        }).from(users).where(eq(users.id, userId)).limit(1)

        user.value = dbUserResult[0] || null
      }
    } catch (error) {
      // Invalid token, clear the user state
      user.value = null
    }
  } else {
    user.value = null
  }
})