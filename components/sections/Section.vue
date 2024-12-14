<template>
  <section 
    :id="id"
    :class="[
      'py-24',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div v-if="title || subtitle" class="text-center max-w-3xl mx-auto mb-16">
        <Badge 
          v-if="badge" 
          :class="[
            'mb-4',
            'border-primary'
          ]"
          variant="outline"
        >
          {{ badge }}
        </Badge>
        <h2 class="text-4xl font-bold tracking-tight mb-4">{{ title }}</h2>
        <p v-if="subtitle" class="text-muted-foreground text-lg">
          {{ subtitle }}
        </p>
      </div>

      <!-- Section Content -->
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { SectionBackground } from '@/types/section'

defineProps<{
  id?: string
  background?: SectionBackground
  badge?: string
  title?: string
  subtitle?: string
}>()
</script> 