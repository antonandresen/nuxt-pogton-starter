<template>
  <Select v-model="currentLocale">
    <SelectTrigger class="w-[140px]">
      <SelectValue>
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ currentFlag }}</span>
          <span class="text-sm">{{ currentLanguageName }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="lang in availableLanguages"
        :key="lang.code"
        :value="lang.code"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { locale, setLocale } = useI18n()

// Define available languages with flags
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
]

// Use computed to ensure reactivity
const currentLocale = computed({
  get: () => locale.value,
  set: (newLocale) => {
    setLocale(newLocale)
  }
})

// Get current language info
const currentLanguageInfo = computed(() => {
  return availableLanguages.find(lang => lang.code === locale.value) || availableLanguages[0]
})

const currentFlag = computed(() => currentLanguageInfo.value.flag)
const currentLanguageName = computed(() => currentLanguageInfo.value.name)
</script> 
