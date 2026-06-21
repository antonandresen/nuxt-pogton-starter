import { getCookie } from 'h3'

/**
 * Decode a JWT payload without verification (verification happens at API layer).
 * Returns the parsed payload object or null if decoding fails.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const loginRedirect = {
    path: '/login',
    query: { redirect: to.fullPath },
  }

  // ── Server-side: decode JWT from cookie directly (no network call) ──────
  if (import.meta.server) {
    const event = useRequestEvent()
    if (!event) return navigateTo(loginRedirect)

    const token = getCookie(event, 'auth_token')
    if (!token) return navigateTo(loginRedirect)

    // Populate user state for subsequent middleware + layout rendering
    const user = useState<any>('auth-user')
    if (!user.value) {
      const payload = decodeJwtPayload(token)
      if (!payload || !payload.sub) return navigateTo(loginRedirect)

      // Check expiry
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return navigateTo(loginRedirect)
      }

      user.value = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        currentOrgId: payload.currentOrgId ?? null,
      }
    }
    return
  }

  // ── Client-side: wait for auth plugin to finish loading ─────────────────
  const user = useState('auth-user')
  const authReady = useState<boolean>('auth-ready', () => false)

  if (!authReady.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(authReady, (ready) => {
        if (ready) {
          stop()
          resolve()
        }
      }, { immediate: true })
    })
  }

  if (!user.value) {
    return navigateTo(loginRedirect)
  }
})