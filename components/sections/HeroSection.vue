<template>
  <section class="relative min-h-[calc(100vh-4rem)]">
    <!-- Background Pattern -->
    <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
    
    <div class="container mx-auto px-4 py-24 md:py-32 min-h-[calc(100vh-4rem)] flex items-center">
      <div class="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
        <span class="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
          🚀 Launching something special
        </span>
        
        <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          {{ $t('title') }}
        </h1>
        
        <p class="text-muted-foreground text-lg sm:text-xl">
          Empower your team with cutting-edge tools and insights. Join thousands of successful businesses already using our platform.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Book a Demo
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div class="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div class="flex items-center">
            <CheckCircle class="mr-1 h-4 w-4" />
            Free Trial
          </div>
          <div class="flex items-center">
            <CheckCircle class="mr-1 h-4 w-4" />
            No Credit Card
          </div>
          <div class="flex items-center">
            <CheckCircle class="mr-1 h-4 w-4" />
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-vue-next'

const getStarted = () => {
  // Handle get started action
}
</script>

<style scoped>
.hero {
  background-image: url('/images/hero-background.jpg');
  background-size: cover;
  background-position: center;
}
</style>