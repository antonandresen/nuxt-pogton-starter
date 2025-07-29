<template>
  <Button variant="ghost" size="icon" @click="toggleTheme">
    <Sun v-if="colorMode.value === 'dark'" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>

<script setup lang="ts">
import { useColorMode } from '#imports'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-vue-next'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style>

</style>