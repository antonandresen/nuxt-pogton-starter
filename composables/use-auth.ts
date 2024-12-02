import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  createdAt: string
}

const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      user.value = response.user
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: { email, password }
      })
      user.value = response.user
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const getUser = async () => {
    try {
      const response = await $fetch('/api/auth/user')
      user.value = response.user
      return response.user
    } catch (error) {
      user.value = null
      return null
    }
  }

  // Initialize auth state
  if (!user.value) {
    getUser()
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    getUser
  }
}