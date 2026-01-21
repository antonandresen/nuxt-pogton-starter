<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Settings</h2>
      <p class="text-muted-foreground">Manage your account settings</p>
    </div>

    <Tabs default-value="account" class="space-y-6">
      <TabsList class="flex flex-wrap gap-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
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
      </TabsContent>

      <TabsContent value="security">
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
      </TabsContent>

      <TabsContent value="preferences">
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
      </TabsContent>

      <TabsContent value="usage">
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current usage and limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="!metrics?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No usage metrics yet.
            </div>
            <div v-else class="grid gap-4 md:grid-cols-2">
              <div v-for="metric in metrics" :key="metric._id" class="rounded-lg border p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium">{{ metric.metric }}</div>
                  <Badge v-if="metric.limit" variant="outline">
                    {{ metric.current }} / {{ metric.limit }}
                  </Badge>
                  <Badge v-else variant="secondary">{{ metric.current }}</Badge>
                </div>
                <div v-if="metric.limit" class="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary/70 to-primary transition-all"
                    :style="{ width: `${Math.min(100, (metric.current / metric.limit) * 100)}%` }"
                  />
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatDate(metric.periodStart) }} - {{ formatDate(metric.periodEnd) }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api-keys">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Issue keys for programmatic access</CardDescription>
            </div>
            <Dialog v-model:open="isCreateKeyOpen">
              <DialogTrigger as-child>
                <Button>New API Key</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>Give the key a recognizable name.</DialogDescription>
                </DialogHeader>
                <div class="space-y-4 py-2">
                  <div class="space-y-2">
                    <Label for="api-key-name">Name</Label>
                    <Input id="api-key-name" v-model="apiKeyName" placeholder="Production" />
                  </div>
                </div>
                <DialogFooter class="gap-2">
                  <Button variant="outline" @click="isCreateKeyOpen = false">Cancel</Button>
                  <Button :disabled="isCreatingKey" @click="createKey">
                    <Loader2 v-if="isCreatingKey" class="mr-2 h-4 w-4 animate-spin" />
                    Create Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog v-model:open="isTokenDialogOpen">
              <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>Copy this token now. It won&apos;t be shown again.</DialogDescription>
                </DialogHeader>
                <div class="space-y-4 py-2">
                  <div class="space-y-2">
                    <Label>Token</Label>
                    <div class="flex gap-2">
                      <Input :model-value="newKey?.token ?? ''" readonly />
                      <Button variant="outline" @click="copyToken">Copy</Button>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label>Key Prefix</Label>
                    <Input :model-value="newKey?.keyPrefix ?? ''" readonly />
                  </div>
                </div>
                <DialogFooter>
                  <Button @click="isTokenDialogOpen = false">Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div v-if="!keys?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No API keys yet. Create one to get started.
            </div>
            <div v-else class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="key in keys" :key="key._id">
                    <TableCell class="font-medium">{{ key.name }}</TableCell>
                    <TableCell>{{ key.keyPrefix }}</TableCell>
                    <TableCell>{{ formatDate(key.createdAt) }}</TableCell>
                    <TableCell>{{ key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never' }}</TableCell>
                    <TableCell>
                      <Badge v-if="key.revokedAt" variant="secondary">Revoked</Badge>
                      <Badge v-else variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell class="text-right">
                      <Button
                        v-if="!key.revokedAt"
                        variant="destructive"
                        size="sm"
                        @click="revokeKey(key._id)"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  </div>
</template>

<script setup lang="ts">
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
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-vue-next'
import { api, useConvexMutation, useConvexQuery } from '../../composables/useConvex'
import { useApiKeys } from '~/composables/useApiKeys'
import { useUsage } from '~/composables/useUsage'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Settings'
})

const { initSEO } = useSEO({
  title: 'Settings',
  description: 'Manage your account settings and preferences.',
  noindex: true
})

initSEO()

const { toast } = useToast()
const isLoading = ref(false)
const isPasswordLoading = ref(false)
const { data: currentUser } = useConvexQuery(api.users.getCurrent, {})
const updateNameMutation = useConvexMutation(api.users.updateNameForCurrentUser)
const updatePasswordMutation = useConvexMutation(api.users.updatePasswordForCurrentUser)

const form = reactive({
  email: '',
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

const { keys, create: createApiKey, revoke: revokeApiKey } = useApiKeys()
const { metrics } = useUsage()

const isCreateKeyOpen = ref(false)
const isCreatingKey = ref(false)
const apiKeyName = ref('')
const newKey = ref<null | { id: string; name: string; keyPrefix: string; token: string }>(null)
const isTokenDialogOpen = computed({
  get: () => newKey.value !== null,
  set: (value) => {
    if (!value) newKey.value = null
  }
})


watchEffect(() => {
  if (!currentUser.value) return
  form.email = currentUser.value.email
  form.name = currentUser.value.name || ''
})

const updateProfile = async () => {
  isLoading.value = true
  try {
    await updateNameMutation.mutate({ name: form.name })
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
    await updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
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

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const createKey = async () => {
  const name = apiKeyName.value.trim()
  if (!name) {
    toast({
      title: 'Missing name',
      description: 'Enter a name for the API key.',
      variant: 'destructive'
    })
    return
  }
  isCreatingKey.value = true
  try {
    newKey.value = await createApiKey(name)
    apiKeyName.value = ''
    isCreateKeyOpen.value = false
    toast({
      title: 'API key created',
      description: 'Copy the token now. It will not be shown again.'
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to create API key.',
      variant: 'destructive'
    })
  } finally {
    isCreatingKey.value = false
  }
}

const revokeKey = async (id: string) => {
  try {
    await revokeApiKey(id)
    toast({
      title: 'API key revoked',
      description: 'The key can no longer be used.'
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to revoke API key.',
      variant: 'destructive'
    })
  }
}

const copyToken = async () => {
  if (!newKey.value) return
  try {
    await navigator.clipboard.writeText(newKey.value.token)
    toast({ title: 'Copied', description: 'Token copied to clipboard.' })
  } catch (error) {
    toast({
      title: 'Copy failed',
      description: 'Could not copy token to clipboard.',
      variant: 'destructive'
    })
  }
}
</script> 