<template>
  <div class="space-y-4">
    <div class="grid grid-cols-3 gap-4">
      <Button variant="outline" @click="emit('social-login', 'github')" class="space-x-2">
        <Github class="h-4 w-4" />
        <span class="sr-only md:not-sr-only">GitHub</span>
      </Button>
      <Button variant="outline" @click="emit('social-login', 'google')" class="space-x-2">
        <Chrome class="h-4 w-4" />
        <span class="sr-only md:not-sr-only">Google</span>
      </Button>
      <Button variant="outline" @click="emit('social-login', 'twitter')" class="space-x-2">
        <Twitter class="h-4 w-4" />
        <span class="sr-only md:not-sr-only">Twitter</span>
      </Button>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Github, Chrome, Twitter } from 'lucide-vue-next'

const emit = defineEmits<{
  'social-login': [provider: string]
}>()
</script>