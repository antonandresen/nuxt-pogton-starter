<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Workspace Settings</h2>
      <p class="text-muted-foreground">Edit workspace details and configuration.</p>
    </div>

    <Card v-if="!selectedOrg">
      <CardHeader>
        <CardTitle>Workspace not found</CardTitle>
        <CardDescription>We couldn’t find that workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" as-child>
          <NuxtLink to="/dashboard/orgs">Back to workspaces</NuxtLink>
        </Button>
      </CardContent>
    </Card>

    <Card v-else>
      <CardHeader>
        <CardTitle>{{ selectedOrg.name }}</CardTitle>
        <CardDescription>Update the name and slug for this workspace.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div
          v-if="!isCurrentOrg"
          class="rounded-md border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          Switch into this workspace to edit its settings.
          <Button class="ml-2 h-7 px-2 text-xs" @click="switchToOrg" :disabled="isSwitching">
            Switch
          </Button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSave">
          <div class="space-y-2">
            <Label for="org-name">Workspace name</Label>
            <Input id="org-name" v-model="form.name" :disabled="!isCurrentOrg || isSaving" />
          </div>
          <div class="space-y-2">
            <Label for="org-slug">Slug</Label>
            <Input id="org-slug" v-model="form.slug" :disabled="!isCurrentOrg || isSaving" />
          </div>
          <div>
            <Button type="submit" :disabled="!isCurrentOrg || isSaving">
              <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useToast } from '../../components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { api, useConvexMutation } from '../../composables/useConvex'
import { useOrg } from '../../composables/useOrg'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Workspace',
})

const { initSEO } = useSEO({
  title: 'Workspace Settings',
  description: 'Edit workspace settings.',
  noindex: true,
})

initSEO()

const route = useRoute()
const { toast } = useToast()
const { orgs, currentOrgId, switchOrg: switchOrgAction } = useOrg()

const updateNameMutation = useConvexMutation(api.orgs.updateNameForCurrentOrg)
const updateSlugMutation = useConvexMutation(api.orgs.updateSlugForCurrentOrg)

const orgId = computed(() => route.params.orgId as string)

const selectedOrg = computed(() => {
  return orgs.value.find((org: { id: string }) => org.id === orgId.value) ?? null
})

const isCurrentOrg = computed(() => selectedOrg.value?.id === currentOrgId.value)

const form = reactive({
  name: '',
  slug: '',
})

const isSaving = ref(false)
const isSwitching = ref(false)

watch(
  selectedOrg,
  (org) => {
    if (!org) return
    form.name = org.name ?? ''
    form.slug = org.slug ?? ''
  },
  { immediate: true }
)

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

const handleSave = async () => {
  if (!selectedOrg.value) return
  if (!isCurrentOrg.value) {
    toast({ title: 'Switch required', description: 'Switch to edit this workspace.', variant: 'destructive' })
    return
  }

  const name = form.name.trim()
  const slug = form.slug.trim()

  if (!name) {
    toast({ title: 'Name required', description: 'Workspace name can’t be empty.', variant: 'destructive' })
    return
  }

  if (!slug) {
    toast({ title: 'Slug required', description: 'Workspace slug can’t be empty.', variant: 'destructive' })
    return
  }

  const updates: Promise<unknown>[] = []
  if (name !== selectedOrg.value.name) {
    updates.push(updateNameMutation.mutate({ name }))
  }
  if (slug !== selectedOrg.value.slug) {
    updates.push(updateSlugMutation.mutate({ slug }))
  }

  if (!updates.length) {
    toast({ title: 'No changes to save' })
    return
  }

  isSaving.value = true
  try {
    await Promise.all(updates)
    toast({ title: 'Workspace updated' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to update workspace.', variant: 'destructive' })
  } finally {
    isSaving.value = false
  }
}
</script>

