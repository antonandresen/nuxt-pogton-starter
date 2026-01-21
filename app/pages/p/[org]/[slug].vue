<template>
  <div class="container py-12">
    <div v-if="!page" class="text-muted-foreground">Loading page...</div>
    <div v-else class="prose max-w-none dark:prose-invert">
      <h1>{{ page.title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="page.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, useConvexQuery } from '../../../composables/useConvex'

const route = useRoute()
const orgSlug = computed(() => route.params.org as string)
const slug = computed(() => route.params.slug as string)

const { data: page } = useConvexQuery(api.cms.getPublishedByOrgSlugAndSlug, () => ({
  orgSlug: orgSlug.value,
  slug: slug.value,
}))

watchEffect(() => {
  if (!page.value) return
  useSeoMeta({
    title: page.value.seoTitle || page.value.title,
    description: page.value.seoDescription || page.value.excerpt || '',
  })
})
</script>

