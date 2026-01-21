<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">CMS</h2>
        <p class="text-muted-foreground">Create and manage published content</p>
      </div>
      <Button as-child>
        <NuxtLink to="/dashboard/cms/new">New page</NuxtLink>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Pages</CardTitle>
        <CardDescription>Manage drafts and published content</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!pages?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No pages yet. Create your first page to get started.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="page in pages"
            :key="page._id"
            class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ page.title }}</span>
                <Badge :variant="page.status === 'published' ? 'default' : 'secondary'">
                  {{ page.status }}
                </Badge>
              </div>
              <div class="text-sm text-muted-foreground">
                /p/{{ currentOrgSlug }}/{{ page.slug }} · Updated {{ formatDate(page.updatedAt) }}
              </div>
            </div>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink :to="`/dashboard/cms/${page._id}`">Edit</NuxtLink>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../../components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { api, useConvexQuery } from '../../../composables/useConvex'
import { useOrg } from '../../../composables/useOrg'
import { hasPermission } from '../../../utils/permissions'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'CMS',
})

const { initSEO } = useSEO({
  title: 'CMS',
  description: 'Create and manage published content.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { orgs, currentOrgId } = useOrg()
const { data: pages } = useConvexQuery(api.cms.listForCurrentOrg, {})

const currentOrgRole = computed(() => {
  const org = orgs.value.find((item) => item.id === currentOrgId.value)
  return (org?.role as any) ?? null
})

const currentOrgSlug = computed(() => {
  const org = orgs.value.find((item) => item.id === currentOrgId.value)
  return org?.slug ?? 'org'
})

const canRead = computed(() => hasPermission(currentOrgRole.value, "cms:read"))

watchEffect(() => {
  if (process.server) return
  if (!currentOrgRole.value) return
  if (!canRead.value) {
    toast({ title: 'No access', description: 'You do not have CMS access.', variant: 'destructive' })
    navigateTo('/dashboard')
  }
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}
</script>

