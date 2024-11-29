<template>
  <section class="py-16 bg-primary">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold text-primary-foreground mb-4">
        Ready to Get Started?
      </h2>
      <p class="text-xl text-primary-foreground/90 mb-8">
        Join thousands of satisfied customers today.
      </p>
      <Button size="lg" variant="secondary" @click="handleCTA">
        Start Your Free Trial
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

const handleCTA = () => {
  // Handle CTA click
}
</script>

<style>

</style>