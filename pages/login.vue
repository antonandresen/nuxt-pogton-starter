<template>
  <AuthLayout
    title="Welcome back"
    description="Enter your credentials to sign in"
    quote="Welcome back! We're excited to see what you'll build next with Pogton."
  >
    <SocialLoginButtons @social-login="socialLogin" />
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input 
          id="email" 
          v-model="form.email" 
          type="email" 
          placeholder="hello@example.com"
          :class="{ 'border-destructive': errors.email }"
        />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label for="password">Password</Label>
          <NuxtLink 
            to="/forgot-password" 
            class="text-sm text-primary hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <Input 
            id="password" 
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :class="{ 'border-destructive': errors.password }"
          />
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            class="absolute right-2 top-1/2 -translate-y-1/2"
            @click="showPassword = !showPassword"
          >
            <Eye v-if="!showPassword" class="h-4 w-4" />
            <EyeOff v-else class="h-4 w-4" />
          </Button>
        </div>
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>

      <Button type="submit" class="w-full" :disabled="isLoading">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Sign In
      </Button>
    </form>

    <template #footer>
      Don't have an account?
      <NuxtLink to="/register" class="text-primary hover:underline">Sign up</NuxtLink>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form submitted:', form)
    // Handle successful login
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const socialLogin = (provider: string) => {
  console.log(`Logging in with ${provider}`)
  // Implement social login logic
}
</script>