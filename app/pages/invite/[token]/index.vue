<template>
  <div class="container flex min-h-screen items-center justify-center">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Workspace Invitation</CardTitle>
        <CardDescription v-if="!isLoading && invite">
          You've been invited to join {{ orgName }}
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="isLoading" class="flex justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>

        <div v-else-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p class="text-sm text-destructive">{{ error }}</p>
        </div>

        <div v-else-if="invite && !invite.acceptedAt && !invite.revokedAt" class="space-y-4">
          <div class="rounded-lg border bg-muted/40 p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Workspace</span>
              <span class="font-medium">{{ orgName }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Role</span>
              <Badge variant="outline">{{ invite.role }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Expires</span>
              <span class="text-sm">{{ formatDate(invite.expiresAt) }}</span>
            </div>
          </div>

          <div v-if="!user" class="space-y-2">
            <p class="text-sm text-muted-foreground">Please log in or create an account to accept this invitation.</p>
            <div class="flex gap-2">
              <Button as-child class="flex-1">
                <NuxtLink :to="`/login?redirect=/invite/${token}`">Log In</NuxtLink>
              </Button>
              <Button as-child variant="outline" class="flex-1">
                <NuxtLink :to="`/register?redirect=/invite/${token}`">Sign Up</NuxtLink>
              </Button>
            </div>
          </div>

          <div v-else class="space-y-2">
            <p class="text-sm text-muted-foreground">
              Accepting as <strong>{{ user.email }}</strong>
            </p>
            <Button class="w-full" :disabled="isAccepting" @click="handleAccept">
              <Loader2 v-if="isAccepting" class="mr-2 h-4 w-4 animate-spin" />
              Accept Invitation
            </Button>
          </div>
        </div>

        <div v-else-if="invite?.acceptedAt" class="space-y-4">
          <div class="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
            <p class="text-sm text-green-700 dark:text-green-400">
              This invitation has already been accepted.
            </p>
          </div>
          <Button as-child class="w-full">
            <NuxtLink to="/dashboard">Go to Dashboard</NuxtLink>
          </Button>
        </div>

        <div v-else-if="invite?.revokedAt" class="space-y-4">
          <div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p class="text-sm text-destructive">
              This invitation has been revoked.
            </p>
          </div>
          <Button as-child variant="outline" class="w-full">
            <NuxtLink to="/">Back to Home</NuxtLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/use-toast'
import { api, useConvexQuery, useConvexMutation } from '@/composables/useConvex'
import { useAuth } from '@/composables/use-auth'

definePageMeta({
  layout: 'default',
})

const { initSEO } = useSEO({
  title: 'Accept Invitation',
  description: 'Accept your workspace invitation.',
  noindex: true,
})

initSEO()

const route = useRoute()
const { toast } = useToast()
const { user } = useAuth()

const token = computed(() => route.params.token as string)
const { data: invite, isLoading } = useConvexQuery(
  api.invites.getByToken,
  () => ({ token: token.value })
)

const { data: org } = useConvexQuery(
  api.orgs.getById,
  () => (invite.value?.orgId ? { id: invite.value.orgId } : { id: '' as any }),
)

const orgName = computed(() => org.value?.name ?? 'a workspace')

const acceptInviteMutation = useConvexMutation(api.invites.acceptByToken)
const isAccepting = ref(false)
const error = ref<string | null>(null)

watchEffect(() => {
  if (!isLoading.value && !invite.value) {
    error.value = 'Invitation not found.'
  } else if (invite.value && invite.value.expiresAt < Date.now()) {
    error.value = 'This invitation has expired.'
  } else {
    error.value = null
  }
})

const handleAccept = async () => {
  if (!token.value || !user.value) return

  isAccepting.value = true
  try {
    await acceptInviteMutation.mutate({ token: token.value })
    toast({ title: 'Invitation accepted', description: `You've joined ${orgName.value}` })
    await navigateTo('/dashboard')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to accept invitation.'
    toast({ title: 'Error', description: message, variant: 'destructive' })
  } finally {
    isAccepting.value = false
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}
