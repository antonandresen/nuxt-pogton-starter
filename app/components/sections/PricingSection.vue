<template>
  <section id="pricing" class="relative py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 top-1/2 -translate-y-1/2 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Section Header -->
      <FadeContent :duration="800" :delay="200" :threshold="0.1">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p class="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </div>
      </FadeContent>

      <!-- Dynamic Pricing Plans -->
      <FadeContent :duration="800" :delay="400" :threshold="0.1">
        <PricingPlans mode="landing" />
      </FadeContent>

      <!-- Enterprise -->
      <FadeContent :duration="800" :delay="1200" :threshold="0.1">
        <div class="mt-16 max-w-3xl mx-auto">
          <Card>
            <CardContent class="p-8">
              <div class="flex items-center justify-between gap-8">
                <div>
                  <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
                  <p class="text-muted-foreground">
                    Need a custom solution? Let's talk about your specific requirements.
                  </p>
                </div>
                <Button variant="outline" size="lg" as-child>
                  <NuxtLink to="/">Contact Sales</NuxtLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeContent>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FadeContent from '@/components/Animations/FadeContent.vue'
</script>

<style scoped>
/* Styles for Pricing Section */
</style>
