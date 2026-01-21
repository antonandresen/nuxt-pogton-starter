<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">New Page</h2>
      <p class="text-muted-foreground">Draft a new CMS page</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Page details</CardTitle>
        <CardDescription>Define content, SEO, and publishing status</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Title</Label>
          <Input id="title" v-model="form.title" placeholder="Release notes" />
        </div>
        <div class="space-y-2">
          <Label for="slug">Slug</Label>
          <Input id="slug" v-model="form.slug" placeholder="release-notes" />
        </div>
        <div class="space-y-2">
          <Label for="excerpt">Excerpt</Label>
          <Textarea id="excerpt" v-model="form.excerpt" placeholder="Short summary for previews" />
        </div>
        <div class="space-y-2">
          <Label for="content">Content</Label>
          <Textarea id="content" v-model="form.content" rows="12" placeholder="Write HTML or markdown" />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="seo-title">SEO Title</Label>
            <Input id="seo-title" v-model="form.seoTitle" placeholder="Custom SEO title" />
          </div>
          <div class="space-y-2">
            <Label for="seo-description">SEO Description</Label>
            <Input id="seo-description" v-model="form.seoDescription" placeholder="Custom SEO description" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <Label>Status</Label>
            <p class="text-xs text-muted-foreground">Publish to make it available publicly</p>
          </div>
          <Select v-model="form.status">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-2">
          <Button :disabled="isSaving" @click="handleSave">
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            Save page
          </Button>
          <Button variant="outline" as-child>
            <NuxtLink to="/dashboard/cms">Back</NuxtLink>
          </Button>
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
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { api, useConvexMutation } from '../../../composables/useConvex'
import { useOrg } from '../../../composables/useOrg'
import { hasPermission } from '../../../utils/permissions'
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'New Page',
})

const { initSEO } = useSEO({
  title: 'New CMS Page',
  description: 'Create a new CMS page.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { orgs, currentOrgId } = useOrg()
const upsertMutation = useConvexMutation(api.cms.upsertForCurrentOrg)
const isSaving = ref(false)

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
})

const currentOrgRole = computed(() => {
  const org = orgs.value.find((item) => item.id === currentOrgId.value)
  return (org?.role as any) ?? null
})

const canWrite = computed(() => hasPermission(currentOrgRole.value, "cms:write"))

watchEffect(() => {
  if (process.server) return
  if (!currentOrgRole.value) return
  if (!canWrite.value) {
    toast({ title: 'No access', description: 'You do not have CMS access.', variant: 'destructive' })
    navigateTo('/dashboard')
  }
})

const handleSave = async () => {
  if (!form.title.trim() || !form.content.trim()) {
    toast({ title: 'Missing fields', description: 'Title and content are required.', variant: 'destructive' })
    return
  }

  isSaving.value = true
  try {
    const id = await upsertMutation.mutate({
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      status: form.status,
      content: form.content,
      excerpt: form.excerpt.trim() || undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
    })
    toast({ title: 'Page saved', description: 'Your page draft is ready.' })
    navigateTo(`/dashboard/cms/${id}`)
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to save page.', variant: 'destructive' })
  } finally {
    isSaving.value = false
  }
}
</script>

