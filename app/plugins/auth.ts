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

  if (process.server) {
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
      if (process.server) {
        // Server-side: Verify token and set minimal user data
        const secret = new TextEncoder().encode(config.JWT_SECRET as string)
        const { payload } = await jose.jwtVerify(token, secret)

        const userId = payload.userId as Id<"users">

        // Set minimal user object from JWT for SSR
        user.value = {
          id: userId,
          email: '', // Will be fetched client-side
          createdAt: new Date(),
          role: (payload.role as string) || 'USER'
        }
      } else {
        // Client-side: Fetch full user data from API
        const response = await $fetch<{ user: User }>('/api/auth/user')
        user.value = response.user
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      // Invalid token, clear the user state
      user.value = null
    }
  } else {
    user.value = null
  }
})
