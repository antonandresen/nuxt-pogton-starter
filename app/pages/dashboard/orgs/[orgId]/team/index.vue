<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Team</h2>
      <p class="text-muted-foreground">Manage workspace members and invitations</p>
    </div>

    <Card v-if="!selectedOrg">
      <CardHeader>
        <CardTitle>Workspace not found</CardTitle>
        <CardDescription>We couldn't find that workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" as-child>
          <NuxtLink to="/dashboard/orgs">Back to workspaces</NuxtLink>
        </Button>
      </CardContent>
    </Card>

    <template v-else>
      <div
        v-if="!isCurrentOrg"
        class="rounded-md border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground"
      >
        Switch into this workspace to manage the team.
        <Button class="ml-2 h-7 px-2 text-xs" @click="switchToOrg" :disabled="isSwitching">
          Switch
        </Button>
      </div>
      <div
        v-else-if="!canManageMembers"
        class="rounded-md border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground"
      >
        You don't have permission to manage team members.
      </div>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>People who have access to this workspace</CardDescription>
          </div>
          <Dialog v-model:open="isInviteDialogOpen">
            <DialogTrigger as-child>
              <Button :disabled="!canManageMembers || !invitationsEnabled">
                <UserPlus class="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>Send an invitation to join this workspace.</DialogDescription>
              </DialogHeader>
              <div class="space-y-4 py-2">
                <div class="space-y-2">
                  <Label for="invite-email">Email</Label>
                  <Input id="invite-email" v-model="inviteForm.email" type="email" placeholder="colleague@example.com" />
                </div>
                <div class="space-y-2">
                  <Label for="invite-role">Role</Label>
                  <Select v-model="inviteForm.role">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="OWNER">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter class="gap-2">
                <Button variant="outline" @click="isInviteDialogOpen = false">Cancel</Button>
                <Button :disabled="isInviting" @click="handleInvite">
                  <Loader2 v-if="isInviting" class="mr-2 h-4 w-4 animate-spin" />
                  Send Invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div v-if="!members?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No members yet.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="member in members"
              :key="member._id"
              class="flex items-center justify-between rounded-lg border p-4"
            >
              <div class="flex items-center gap-3">
                <Avatar>
                  <AvatarImage :src="getAvatarUrl(member.userEmail, null)" />
                  <AvatarFallback>{{ member.userEmail?.charAt(0).toUpperCase() }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="font-medium">{{ member.userName || member.userEmail }}</div>
                  <div class="text-sm text-muted-foreground">{{ member.userEmail }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">{{ member.role }}</Badge>
                <Badge :variant="member.status === 'ACTIVE' ? 'default' : 'secondary'">
                  {{ member.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
          <CardDescription>Invitations that haven't been accepted yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="!pendingInvites?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No pending invites.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="invite in pendingInvites"
              :key="invite._id"
              class="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div class="font-medium">{{ invite.email }}</div>
                <div class="text-sm text-muted-foreground">
                  Role: {{ invite.role }} · Expires {{ formatDate(invite.expiresAt) }}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                :disabled="!canManageMembers"
                @click="handleRevokeInvite(invite._id)"
              >
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { UserPlus, Loader2 } from 'lucide-vue-next'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api, useConvexQuery, useConvexMutation } from '@/composables/useConvex'
import { useOrg } from '@/composables/useOrg'
import { hasPermission } from '@/utils/permissions'
import { getAvatarUrl } from '@/utils/gravatar'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Team',
})

const { initSEO } = useSEO({
  title: 'Team',
  description: 'Manage workspace team members.',
  noindex: true,
})

initSEO()

const route = useRoute()
const { toast } = useToast()
const { orgs, currentOrgId, switchOrg: switchOrgAction } = useOrg()
const { data: appSettings } = useConvexQuery(api.appSettings.getPublic, {})

const invitationsEnabled = computed(() => appSettings.value?.invitationsEnabled ?? true)

const orgId = computed(() => route.params.orgId as string)

const selectedOrg = computed(() => {
  return orgs.value.find((org: { id: string }) => org.id === orgId.value) ?? null
})

const isCurrentOrg = computed(() => selectedOrg.value?.id === currentOrgId.value)
const canManageMembers = computed(() => {
  if (!selectedOrg.value) return false
  if (selectedOrg.value.id !== currentOrgId.value) return false
  return hasPermission(selectedOrg.value.role, 'member:write')
})

const { data: members } = useConvexQuery(api.memberships.listForCurrentOrg, {})
const { data: invites } = useConvexQuery(api.invites.listForCurrentOrg, {})

const pendingInvites = computed(() => {
  return invites.value?.filter((inv: any) => !inv.acceptedAt && !inv.revokedAt) ?? []
})

const createInviteMutation = useConvexMutation(api.invites.createForCurrentOrg)
const revokeInviteMutation = useConvexMutation(api.invites.revoke)

const isInviteDialogOpen = ref(false)
const isInviting = ref(false)
const isSwitching = ref(false)
const inviteForm = reactive({
  email: '',
  role: 'MEMBER',
})

const switchToOrg = async () => {
  if (!selectedOrg.value || isCurrentOrg.value) return
  isSwitching.value = true
  try {
    await switchOrgAction(selectedOrg.value.id)
    toast({ title: 'Workspace switched' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to switch workspace.', variant: 'destructive' })
  } finally {
    isSwitching.value = false
  }
}

const handleInvite = async () => {
  if (!inviteForm.email || !inviteForm.role) {
    toast({ title: 'Missing fields', description: 'Email and role are required.', variant: 'destructive' })
    return
  }

  if (!invitationsEnabled.value) {
    toast({ title: 'Invitations disabled', description: 'Invitations are disabled by an admin.', variant: 'destructive' })
    return
  }

  isInviting.value = true
  try {
    const token = crypto.randomUUID()
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days

    await createInviteMutation.mutate({
      email: inviteForm.email,
      role: inviteForm.role,
      token,
      expiresAt,
    })

    toast({ title: 'Invite sent', description: `Invitation sent to ${inviteForm.email}` })
    inviteForm.email = ''
    inviteForm.role = 'MEMBER'
    isInviteDialogOpen.value = false
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send invite.'
    toast({ title: 'Error', description: message, variant: 'destructive' })
  } finally {
    isInviting.value = false
  }
}

const handleRevokeInvite = async (inviteId: string) => {
  try {
    await revokeInviteMutation.mutate({ id: inviteId as any })
    toast({ title: 'Invite revoked' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to revoke invite.', variant: 'destructive' })
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>
