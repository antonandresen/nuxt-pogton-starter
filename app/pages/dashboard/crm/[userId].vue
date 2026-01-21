<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Customer Notes</h2>
      <p class="text-muted-foreground">Internal notes and onboarding follow-ups.</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Share context with the team</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="note">Add a note</Label>
          <Textarea id="note" v-model="noteBody" rows="4" placeholder="Call summary, onboarding issues, next steps..." />
        </div>
        <Button :disabled="isSaving || !noteBody.trim()" @click="addNote">
          <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          Add note
        </Button>

        <div v-if="!notes?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No notes yet.
        </div>
        <div v-else class="space-y-3">
          <div v-for="note in notes" :key="note._id" class="rounded-lg border p-4">
            <div class="text-sm text-muted-foreground">
              {{ note.authorEmail || 'Unknown' }} · {{ formatDate(note.createdAt) }}
            </div>
            <div class="mt-2 whitespace-pre-wrap">{{ note.body }}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { useToast } from '../../../components/ui/toast/use-toast'
import { api, useConvexMutation, useConvexQuery, type Id } from '../../../composables/useConvex'
import { useOrg } from '../../../composables/useOrg'
import { hasPermission } from '../../../utils/permissions'
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'CRM Notes',
})

const { initSEO } = useSEO({
  title: 'CRM Notes',
  description: 'Customer notes and follow-up history.',
  noindex: true,
})

initSEO()

const route = useRoute()
const { toast } = useToast()
const { orgs, currentOrgId } = useOrg()
const userId = computed(() => route.params.userId as string)

const { data: notes } = useConvexQuery(api.crm.listNotesForCurrentOrg, () => ({
  userId: userId.value as Id<'users'>,
}))

const addNoteMutation = useConvexMutation(api.crm.addNoteForCurrentOrg)
const noteBody = ref('')
const isSaving = ref(false)

const currentOrgRole = computed(() => {
  const org = orgs.value.find((item) => item.id === currentOrgId.value)
  return (org?.role as any) ?? null
})

const canRead = computed(() => hasPermission(currentOrgRole.value, "crm:read"))

watchEffect(() => {
  if (process.server) return
  if (!currentOrgRole.value) return
  if (!canRead.value) {
    toast({ title: 'No access', description: 'You do not have CRM access.', variant: 'destructive' })
    navigateTo('/dashboard')
  }
})

const addNote = async () => {
  if (!noteBody.value.trim()) return
  isSaving.value = true
  try {
    await addNoteMutation.mutate({
      userId: userId.value as Id<'users'>,
      body: noteBody.value.trim(),
    })
    noteBody.value = ''
    toast({ title: 'Note added' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to add note.', variant: 'destructive' })
  } finally {
    isSaving.value = false
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}
</script>

