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
      const secret = new TextEncoder().encode(config.jwtSecret)
      const { payload } = await jose.jwtVerify(token, secret)

      const userId = payload.userId as number

      if (process.server) {
        // Dynamically import prisma only on the server
        const { default: prisma } = await import('~/server/utils/prisma')
        
        // Fetch user data from the database on the server
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            createdAt: true,
            role: true
          },
        })

        user.value = dbUser
      }
    } catch (error) {
      // Invalid token, clear the user state
      user.value = null
    }
  } else {
    user.value = null
  }
})