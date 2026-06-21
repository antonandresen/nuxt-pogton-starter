import { defineNuxtPlugin, useState, useRequestFetch } from '#app'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  role: string
  currentOrgId?: string | null
  createdAt?: Date
}

/**
 * Universal auth plugin — runs on BOTH server and client.
 *
 * Two-phase SSR auth flow:
 *  Phase 1 (middleware/auth.ts): JWT decode → instant basic user data
 *  Phase 2 (this plugin):        API fetch → full user data with org info
 *  Phase 3 (client hydration):   Re-fetch if data is incomplete
 *
 * Sets `auth-ready = true` when done — unblocks client-side middleware.
 */
export default defineNuxtPlugin(async () => {
  const user = useState<User | null>('auth-user', () => null)
  const authReady = useState<boolean>('auth-ready', () => false)

  // Fetch full user data if we have partial data (from JWT decode) or no data
  const needsFetch = import.meta.server || !user.value || !('createdAt' in (user.value || {}))

  if (needsFetch) {
    try {
      const fetchFn = import.meta.server ? useRequestFetch() : $fetch
      const data = await fetchFn<{ user: User }>('/api/auth/me', {
        credentials: 'include',
      })
      // Enrich user state with full data from API
      if (data?.user) {
        user.value = data.user
      }
      // Don't overwrite middleware-set partial data on null response
    } catch (_) {
      // Don't overwrite middleware-set partial JWT data on error.
      // Only null out if there's nothing at all.
      if (!user.value) user.value = null
    }
  }

  authReady.value = true
})
