<!-- pages/pricing.vue -->
<template>
  <div class="relative py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 top-1/2 -translate-y-1/2 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Simple, transparent pricing
        </h1>
        <p class="mt-4 text-xl text-muted-foreground">
          Choose the perfect plan for your needs. No hidden fees.
        </p>
      </div>

      <!-- Pricing Plans Component -->
      <PricingPlans mode="landing" />

      <!-- Enterprise -->
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

      <!-- FAQ Section -->
      <div class="mt-24">
        <FAQSection />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FAQSection from '@/components/sections/FAQSection.vue'

// 🎯 SEO Configuration
const { initSEO } = useSEO({
  title: 'Pricing - Simple, Transparent Plans',
  description: 'Choose the perfect plan for your needs. Simple and transparent pricing with no hidden fees. Start your free trial today.',
  type: 'website'
})
initSEO()

// Product Schema for pricing plans
useSchemaOrg([
  defineProduct({
    name: 'Nuxt SaaS Starter - Pro Plan',
    description: 'Complete SaaS solution with advanced features',
    offers: {
      '@type': 'Offer',
      price: 79,
      priceCurrency: 'USD',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      url: 'https://nuxt-pogton-starter.netlify.app/pricing',
      availability: 'https://schema.org/InStock'
    }
  })
])
</script>

<style scoped>
/* Add your styles here */
</style>
