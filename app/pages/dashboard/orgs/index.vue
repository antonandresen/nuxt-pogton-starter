<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Workspaces</h2>
      <p class="text-muted-foreground">Create, switch, and manage workspaces</p>
    </div>

    <div
      v-if="!workspacesEnabled"
      class="rounded-md border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground"
    >
      Workspaces are currently disabled by an admin.
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Create Workspace</CardTitle>
        <CardDescription>Spin up a new org for a team or project</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleCreate" class="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div class="flex-1 space-y-2">
            <Label for="org-name">Workspace name</Label>
            <Input id="org-name" v-model="form.name" placeholder="Acme Inc." />
          </div>
          <div class="flex-1 space-y-2">
            <Label for="org-slug">Slug (optional)</Label>
            <Input id="org-slug" v-model="form.slug" placeholder="acme" />
          </div>
          <Button type="submit" :disabled="isLoading || !workspacesEnabled">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Create
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Your Workspaces</CardTitle>
        <CardDescription>Switch between workspaces you belong to</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="org in orgs"
            :key="org.id"
            class="flex flex-col gap-2 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div class="font-medium">{{ org.name }}</div>
              <div class="text-sm text-muted-foreground">
                {{ org.slug }} · {{ org.role || 'Member' }}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              :disabled="org.id === currentOrgId || !workspacesEnabled"
              @click="switchOrg(org.id)"
            >
              {{ org.id === currentOrgId ? 'Current' : 'Switch' }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
import { Loader2 } from 'lucide-vue-next'
import { api, useConvexQuery } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Workspaces',
})

const { initSEO } = useSEO({
  title: 'Workspaces',
  description: 'Create and manage your workspaces.',
  noindex: true
})

initSEO()

const { toast } = useToast()
const { orgs, currentOrgId, create, switchOrg: switchOrgAction } = useOrg()
const isLoading = ref(false)
const { data: appSettings } = useConvexQuery(api.appSettings.getPublic, {})

const workspacesEnabled = computed(() => appSettings.value?.workspacesEnabled ?? true)

const form = reactive({
  name: '',
  slug: '',
})

const handleCreate = async () => {
  if (!workspacesEnabled.value) {
    toast({ title: 'Workspaces disabled', description: 'Workspaces are disabled by an admin.' })
    return
  }
  if (!form.name) return
  isLoading.value = true
  try {
    await create(form.name, form.slug || undefined)
    form.name = ''
    form.slug = ''
    toast({ title: 'Workspace created', description: 'New workspace is ready.' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to create workspace.', variant: 'destructive' })
  } finally {
    isLoading.value = false
  }
}

const switchOrg = async (id: string) => {
  if (!workspacesEnabled.value) {
    toast({ title: 'Workspaces disabled', description: 'Workspaces are disabled by an admin.' })
    return
  }
  try {
    await switchOrgAction(id)
    toast({ title: 'Workspace switched' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to switch workspace.', variant: 'destructive' })
  }
}
</script>
