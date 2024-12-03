import { computed } from 'vue'
import { useAsyncData } from '#app'

interface User {
  id: number
  email: string
  createdAt: string
}

export function useAuth() {
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  // Define getUser before using it
  const getUser = async () => {
    try {
      const response = await $fetch('/api/auth/user', {
        credentials: 'include',
      })
      user.value = response.user
      return response.user
    } catch (error) {
      user.value = null
      return null
    }
  }

  // Initialize auth state on first use
  if (process.client && user.value === null) {
    getUser()
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      })
      user.value = response.user
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
      user.value = response.user
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
    getUser,
  }
}