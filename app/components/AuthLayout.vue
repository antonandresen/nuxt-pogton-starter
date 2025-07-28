<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <!-- Left Side - Form -->
    <div class="flex items-center justify-center p-8">
      <Card class="w-full max-w-md">
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl font-bold">{{ title }}</CardTitle>
          <CardDescription>
            {{ description }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <slot />
        </CardContent>
        <CardFooter>
          <p class="text-sm text-muted-foreground">
            <slot name="footer" />
          </p>
        </CardFooter>
      </Card>
    </div>

    <!-- Right Side - Decorative -->
    <div class="hidden lg:block relative overflow-hidden bg-accent">
      <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent" />
      <div class="relative h-full flex items-center justify-center p-8">
        <div class="space-y-6 max-w-lg">
          <div class="relative h-40 w-40 mx-auto">
            <div class="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
            <Zap class="h-full w-full text-primary" />
          </div>
          <p class="text-xl sm:text-2xl font-medium text-foreground italic">
            {{ quote }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Zap } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  quote: string
}>()
</script>
<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' fill-opacity='0.1' d='M1 0h2v2H1V0zm4 0h2v2H5V0zm4 0h2v2H9V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zm4 0h2v2h-2V0zM1 4h2v2H1V4zm4 0h2v2H5V4zm4 0h2v2H9V4zm4 0h2v2h-2V4zm4 0h2v2h-2V4zm4 0h2v2h-2V4zM1 8h2v2H1V8zm4 0h2v2H5V8zm4 0h2v2H9V8zm4 0h2v2h-2V8zm4 0h2v2h-2V8zm4 0h2v2h-2V8zM1 12h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM1 16h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM1 20h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z'/%3E%3C/svg%3E");
}
</style>
