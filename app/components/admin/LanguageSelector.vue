<template>
  <div class="flex items-center gap-2">
    <Label v-if="showLabel" class="text-sm font-medium">Edit Language:</Label>
    <div class="flex rounded-md border overflow-hidden">
      <button
        v-for="lang in languages"
        :key="lang.code"
        type="button"
        class="px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent flex items-center gap-2"
        :class="{
          'bg-primary text-primary-foreground hover:bg-primary/90': modelValue === lang.code,
          'text-muted-foreground': modelValue !== lang.code
        }"
        @click="$emit('update:modelValue', lang.code)"
      >
        <span class="text-base">{{ lang.flag }}</span>
        <span>{{ lang.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Language {
  code: string
  label: string
  flag: string
}

defineProps<{
  modelValue: string
  showLabel?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const languages: Language[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]
</script>
