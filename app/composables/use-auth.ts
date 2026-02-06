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
  // SSR: Fetch user from our API (this runs on server AND client first load)
  // The server has access to auth cookies and can query Convex
  const { data: ssrUser } = useFetch('/api/auth/me', {
    credentials: 'include',
    key: 'auth-user-ssr',
    lazy: false, // Block SSR until auth data is fetched - ensures admin role is available immediately
    // Don't refetch on client navigation - Convex handles real-time updates
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  })

  // Transform SSR data into User format synchronously using computed
  const userFromSSR = computed(() => {
    const userData = ssrUser.value?.user as {
      id: string
      email: string
      role: 'USER' | 'ADMIN'
      createdAt: number
      avatar?: string
      name?: string
      currentOrgId?: string | null
    } | null | undefined
    
    if (!userData) return null
    
    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      createdAt: new Date(userData.createdAt),
      avatar: userData.avatar,
      name: userData.name,
      currentOrgId: userData.currentOrgId ?? null,
    }
  })

  // Initialize state with SSR data
  const user = useState<User | null>('auth-user', () => userFromSSR.value)
  const convexAuthState = useState<boolean>('convex-authenticated', () => true)
  const isHydrated = useState<boolean>('auth-hydrated', () => !!ssrUser.value)
  
  // Keep user in sync with SSR data
  watch(userFromSSR, (newUser) => {
    if (newUser) {
      user.value = newUser
      isHydrated.value = true
    } else if (ssrUser.value && !ssrUser.value.user) {
      // SSR returned but user is null (not authenticated)
      user.value = null
      isHydrated.value = true
    }
  }, { immediate: true })

  // Client-side: Convex subscription for real-time updates (avatar changes, etc.)
  const { data: convexUser } = process.client 
    ? useConvexQuery(api.users.getCurrent, {})
    : { data: ref(null) }

  // When Convex updates (client-only), sync to user state
  watchEffect(() => {
    if (process.client && convexUser.value) {
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
    isHydrated,
    login,
    register,
    logout,
  }
}
