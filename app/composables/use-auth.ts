import { computed, watchEffect } from 'vue'
import { api, useConvexQuery } from './useConvex'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  role: 'USER' | 'STAFF' | 'ADMIN'
  currentOrgId?: string | null
  currentOrg?: {
    id: string
    name: string
    slug: string
  } | null
  membership?: {
    id: string
    role: string
    status: string
  } | null
  createdAt?: Date
}

export function useAuth() {
  const user = useState<User | null>('auth-user')
  const isAuthenticated = computed(() => !!user.value)

  // Client-side: Convex subscription for real-time updates (avatar, name, role changes)
  const { data: convexUser } = import.meta.client
    ? useConvexQuery(api.users.getCurrent, {})
    : { data: ref(null) }

  // When Convex updates (client-only), sync to user state
  watchEffect(() => {
    if (import.meta.client && convexUser.value) {
      user.value = {
        id: convexUser.value._id,
        email: convexUser.value.email,
        role: convexUser.value.role,
        createdAt: new Date(convexUser.value.createdAt),
        avatar: convexUser.value.avatar,
        name: convexUser.value.name,
        currentOrgId: convexUser.value.currentOrgId ?? null,
      }
    }
  })

  /** Check if the current user has a specific permission (ADMIN implicitly has all) */
  const hasPermission = (permission: string) => {
    if (!user.value) return false
    if (user.value.role === 'ADMIN') return true
    return false // Extend: check user.value.permissions array if you add per-user permissions
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      })
      // Reload to trigger SSR auth flow with new cookie
      window.location.href = '/dashboard'
      return response
    } catch (error: any) {
      throw new Error(error.data?.message || error.message)
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      })
      // Reload to trigger SSR auth flow with new cookie
      window.location.href = '/dashboard'
      return response
    } catch (error: any) {
      throw new Error(error.data?.message || error.message)
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      user.value = null
      const convexToken = useState<string | null>('convex-auth-token')
      convexToken.value = null
      window.location.href = '/login'
    } catch (error: any) {
      throw new Error(error.data?.message || error.message)
    }
  }

  /** Re-fetch user data from the server */
  const refreshUser = async () => {
    try {
      const response = await $fetch<{ user: User }>('/api/auth/me', {
        credentials: 'include',
      })
      user.value = response.user
    } catch (_) {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    hasPermission,
    login,
    register,
    logout,
    refreshUser,
  }
}
