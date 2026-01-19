import { computed, watchEffect } from 'vue'
import { api, useConvexQuery } from './useConvex'

interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  avatar?: string
  name?: string
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
}

export function useAuth() {
  const user = useState<User | null>('auth-user', () => null)
  const convexAuthState = useState<boolean>('convex-authenticated', () => true)
  
  // Only query on client-side (Convex client plugin is .client.ts)
  const { data: currentUser } = process.client 
    ? useConvexQuery(api.users.getCurrent, {})
    : { data: ref(null) }

  watchEffect(() => {
    if (process.client && currentUser.value) {
      user.value = {
        id: currentUser.value._id,
        email: currentUser.value.email,
        role: currentUser.value.role,
        createdAt: new Date(currentUser.value.createdAt),
        avatar: currentUser.value.avatar,
        name: currentUser.value.name,
        currentOrgId: currentUser.value.currentOrgId ?? null,
      }
    }
  })

  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      })
      convexAuthState.value = true
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
      convexAuthState.value = true
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
      convexAuthState.value = false
      window.location.href = '/login'
    } catch (error: any) {
      throw new Error(error.data?.message || error.message)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
