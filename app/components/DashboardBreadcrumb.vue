<template>
  <div class="flex items-center gap-2 text-sm text-muted-foreground">
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.route">
      <NuxtLink
        v-if="!breadcrumb.isCurrent"
        :to="breadcrumb.route"
        class="hover:text-foreground transition-colors"
      >
        {{ breadcrumb.title }}
      </NuxtLink>
      <span v-else class="font-medium text-foreground">
        {{ breadcrumb.title }}
      </span>
      <span v-if="index < breadcrumbs.length - 1" class="text-muted-foreground/50">/</span>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  title: string
  route: string
  isCurrent: boolean
}

interface Props {
  breadcrumbs: Breadcrumb[]
}

defineProps<Props>()
</script>
