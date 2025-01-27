<!-- components/BlogBreadcrumbs.vue -->
<template>
  <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-8">
    <NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink>
    <ChevronRight class="h-4 w-4" />
    <NuxtLink to="/blog" class="hover:text-primary transition-colors">Blog</NuxtLink>
    <ChevronRight class="h-4 w-4" />
    <span class="text-foreground">{{ title }}</span>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  title: string
}>()
</script> 