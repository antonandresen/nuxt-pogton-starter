import { defineNuxtPlugin, useState, useRuntimeConfig } from '#app'
import * as jose from 'jose'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface User {
  id: string
  email: string
  createdAt: Date
  role: string
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
      const secret = new TextEncoder().encode(config.JWT_SECRET as string)
      const { payload } = await jose.jwtVerify(token, secret)

      const userId = payload.userId as Id<"users">

      // Note: Skipping server-side user fetch for now
      // The client will fetch user data after hydration
      if (import.meta.server) {
        // Just set a minimal user object from JWT
        user.value = {
          id: userId,
          email: '', // Will be fetched client-side
          createdAt: new Date(),
          role: (payload.role as string) || 'USER'
        }
      }
    } catch (error) {
      // Invalid token, clear the user state
      user.value = null
    }
  } else {
    user.value = null
  }
})
