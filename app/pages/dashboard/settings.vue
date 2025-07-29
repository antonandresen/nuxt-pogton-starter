<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Settings</h2>
      <p class="text-muted-foreground">Manage your account settings</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input 
              id="email" 
              v-model="form.email" 
              type="email"
              disabled
            />
          </div>

          <div class="space-y-2">
            <Label for="name">Display Name</Label>
            <Input 
              id="name" 
              v-model="form.name" 
              placeholder="Your display name"
            />
          </div>

          <Button type="submit" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div class="space-y-2">
            <Label for="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              v-model="passwordForm.currentPassword" 
              type="password"
            />
          </div>

          <div class="space-y-2">
            <Label for="new-password">New Password</Label>
            <Input 
              id="new-password" 
              v-model="passwordForm.newPassword" 
              type="password"
            />
          </div>

          <div class="space-y-2">
            <Label for="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              v-model="passwordForm.confirmPassword" 
              type="password"
            />
          </div>

          <Button type="submit" :disabled="isPasswordLoading">
            <Loader2 v-if="isPasswordLoading" class="mr-2 h-4 w-4 animate-spin" />
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Email Notifications</Label>
              <p class="text-sm text-muted-foreground">
                Receive email notifications about your account
              </p>
            </div>
            <Switch v-model="preferences.emailNotifications" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Theme</Label>
              <p class="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Settings'
})

const { toast } = useToast()
const isLoading = ref(false)
const isPasswordLoading = ref(false)

const form = reactive({
  email: 'user@example.com', // Replace with actual user email
  name: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = reactive({
  emailNotifications: true
})

const updateProfile = async () => {
  isLoading.value = true
  try {
    // Implement profile update logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.'
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update profile.',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast({
      title: 'Error',
      description: 'New passwords do not match.',
      variant: 'destructive'
    })
    return
  }

  isPasswordLoading.value = true
  try {
    // Implement password update logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toast({
      title: 'Password updated',
      description: 'Your password has been updated successfully.'
    })
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update password.',
      variant: 'destructive'
    })
  } finally {
    isPasswordLoading.value = false
  }
}
</script> 