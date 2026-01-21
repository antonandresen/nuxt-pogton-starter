<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">{{ page?.title || 'Edit Page' }}</h2>
      <p class="text-muted-foreground">Update content and publishing status</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Page details</CardTitle>
        <CardDescription>Changes update instantly for published pages</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="!page" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Loading page details...
        </div>
        <div v-else class="space-y-4">
          <div class="space-y-2">
            <Label for="title">Title</Label>
            <Input id="title" v-model="form.title" />
          </div>
          <div class="space-y-2">
            <Label for="slug">Slug</Label>
            <Input id="slug" v-model="form.slug" />
          </div>
          <div class="space-y-2">
            <Label for="excerpt">Excerpt</Label>
            <Textarea id="excerpt" v-model="form.excerpt" />
          </div>
          <div class="space-y-2">
            <Label for="content">Content</Label>
            <Textarea id="content" v-model="form.content" rows="12" />
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="seo-title">SEO Title</Label>
              <Input id="seo-title" v-model="form.seoTitle" />
            </div>
            <div class="space-y-2">
              <Label for="seo-description">SEO Description</Label>
              <Input id="seo-description" v-model="form.seoDescription" />
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
          <div class="flex flex-wrap items-center gap-2">
            <Button :disabled="isSaving" @click="handleSave">
              <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
              Save changes
            </Button>
            <Button variant="outline" as-child>
              <NuxtLink to="/dashboard/cms">Back</NuxtLink>
            </Button>
            <Button variant="destructive" :disabled="isDeleting" @click="handleDelete">
              <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
              Delete page
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
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { api, useConvexMutation, useConvexQuery, type Id } from '../../../composables/useConvex'
import { useOrg } from '../../../composables/useOrg'
import { hasPermission } from '../../../utils/permissions'
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Edit Page',
})

const { initSEO } = useSEO({
  title: 'Edit CMS Page',
  description: 'Update CMS page content.',
  noindex: true,
})

initSEO()

const route = useRoute()
const { toast } = useToast()
const { orgs, currentOrgId } = useOrg()
const pageId = computed(() => route.params.id as string)

const { data: page } = useConvexQuery(api.cms.getByIdForCurrentOrg, () => ({
  id: pageId.value as Id<'cmsPages'>,
}))

const upsertMutation = useConvexMutation(api.cms.upsertForCurrentOrg)
const deleteMutation = useConvexMutation(api.cms.deleteForCurrentOrg)
const isSaving = ref(false)
const isDeleting = ref(false)

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

watchEffect(() => {
  if (!page.value) return
  form.title = page.value.title
  form.slug = page.value.slug
  form.excerpt = page.value.excerpt ?? ''
  form.content = page.value.content
  form.seoTitle = page.value.seoTitle ?? ''
  form.seoDescription = page.value.seoDescription ?? ''
  form.status = page.value.status
})

const handleSave = async () => {
  if (!page.value) return
  if (!form.title.trim() || !form.content.trim()) {
    toast({ title: 'Missing fields', description: 'Title and content are required.', variant: 'destructive' })
    return
  }

  isSaving.value = true
  try {
    await upsertMutation.mutate({
      id: page.value._id,
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      status: form.status,
      content: form.content,
      excerpt: form.excerpt.trim() || undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
    })
    toast({ title: 'Page updated', description: 'Changes saved successfully.' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to update page.', variant: 'destructive' })
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async () => {
  if (!page.value) return
  isDeleting.value = true
  try {
    await deleteMutation.mutate({ id: page.value._id })
    toast({ title: 'Page deleted' })
    navigateTo('/dashboard/cms')
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to delete page.', variant: 'destructive' })
  } finally {
    isDeleting.value = false
  }
}
</script>

