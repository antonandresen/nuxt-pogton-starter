<template>
  <Select @update:modelValue="localeRef = $event" v-model="localeRef" class="w-[100px]">
    <SelectTrigger>
      <SelectValue :placeholder="localeRef" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem 
        v-for="loc in locales" 
        :key="loc.code" 
        :value="loc.code"
      >
        {{ loc.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { locale, locales, setLocale } = useI18n()

const localeRef = ref(locale)

watch(localeRef, (newLocale) => {
  setLocale(newLocale)
})
</script> 
