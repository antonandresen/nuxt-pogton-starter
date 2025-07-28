<template>
  <AuthLayout
    title="Reset your password"
    description="Enter your email address and we'll send you a link to reset your password."
    quote="Security is our top priority. Let's get you back on track."
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input 
          id="email" 
          v-model="email" 
          type="email" 
          placeholder="hello@example.com"
          :class="{ 'border-destructive': error }"
        />
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      </div>

      <Button type="submit" class="w-full" :disabled="isLoading">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Send Reset Link
      </Button>
    </form>

    <template #footer>
      Remember your password?
      <NuxtLink to="/login" class="text-primary hover:underline">Sign in</NuxtLink>
    </template>

    <PasswordResetDialog
      :is-open="showSuccessDialog"
      @update:open="showSuccessDialog = $event"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'

const email = ref('')
const error = ref('')
const isLoading = ref(false)
const showSuccessDialog = ref(false)

const handleSubmit = async () => {
  error.value = ''
  if (!email.value) {
    error.value = 'Email is required'
    return
  }

  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Reset email field after successful submission
    email.value = ''
    showSuccessDialog.value = true
  } catch (err) {
    error.value = 'Failed to send reset link. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Add any additional styles here */
</style>