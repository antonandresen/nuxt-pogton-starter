<template>
  <div class="flex items-center gap-3">
    <Label v-if="showLabel" class="text-sm font-medium">Edit Language:</Label>
    <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
      <SelectTrigger class="w-[200px]">
        <SelectValue>
          <div class="flex items-center gap-2">
            <span class="text-base">{{ currentLanguage?.flag }}</span>
            <span>{{ currentLanguage?.label }}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="[code, lang] in Object.entries(LANGUAGE_NAMES)"
          :key="code"
          :value="code"
        >
          <div class="flex items-center gap-2">
            <span class="text-base">{{ lang.flag }}</span>
            <span>{{ lang.label }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LANGUAGE_NAMES } from '~/composables/useI18nContent'

const props = defineProps<{
  modelValue: string
  showLabel?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentLanguage = computed(() => {
  return LANGUAGE_NAMES[props.modelValue as keyof typeof LANGUAGE_NAMES]
})
</script>
