import { computed } from 'vue'

interface User {
  id: number
  email: string
  createdAt: string
}

export function useAuth() {
  const user = useState<User | null>('auth-user')
  const isAuthenticated = computed(() => !!user.value)
  
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
  }
}