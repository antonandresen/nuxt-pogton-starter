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

      <!-- Pricing Toggle -->
      <div class="flex justify-center items-center gap-4 mb-8">
        <span class="text-sm font-medium" :class="{ 'text-primary': !isAnnual }">Monthly</span>
        <Switch :checked="isAnnual" @update:checked="isAnnual = $event" />
        <span class="text-sm font-medium" :class="{ 'text-primary': isAnnual }">
          Annual
          <Badge variant="secondary" class="ml-2">Save 20%</Badge>
        </span>
      </div>

      <!-- Pricing Cards -->
      <div class="grid gap-8 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
        <Card
          v-for="plan in plans"
          :key="plan.id"
          class="relative group transition-all hover:shadow-lg"
          :class="{ 'border-primary ring-2 ring-primary ring-offset-2': plan.popular }"
        >
          <CardHeader>
            <div class="flex justify-between items-start mb-4">
              <div>
                <CardTitle class="text-xl">{{ plan.name }}</CardTitle>
                <CardDescription>{{ plan.description }}</CardDescription>
              </div>
              <Badge v-if="plan.popular" variant="default">Most Popular</Badge>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold">
                {{ formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice) }}
              </span>
              <span class="text-muted-foreground">/mo</span>
            </div>
            <p v-if="isAnnual" class="text-sm text-muted-foreground mt-1">
              Billed annually ({{ formatPrice(plan.annualPrice * 12) }}/year)
            </p>
          </CardHeader>
          
          <CardContent class="space-y-6">
            <Button class="w-full" :variant="plan.popular ? 'default' : 'outline'" @click="subscribe(plan)">
              Get Started
            </Button>

            <Separator />

            <ul class="space-y-3">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
                <Check class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span class="text-sm">{{ feature }}</span>
              </li>
            </ul>
          </CardContent>

          <!-- Decorative corner gradient -->
          <div class="absolute right-0 top-0 -z-10 h-24 w-24 rounded-bl-full bg-primary/5 transition-all group-hover:scale-150" />
        </Card>
      </div>

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
                <NuxtLink to="/contact">Contact Sales</NuxtLink>
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
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import FAQSection from '@/components/sections/FAQSection.vue'

const isAnnual = ref(false)

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  monthlyPriceId: string
  annualPriceId: string
  popular?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams just getting started',
    monthlyPrice: 29,
    annualPrice: 23,
    monthlyPriceId: 'price_starter_monthly',
    annualPriceId: 'price_starter_annual',
    features: [
      'Up to 5 team members',
      '5GB storage',
      'Basic analytics',
      'Basic integrations',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Ideal for growing businesses',
    monthlyPrice: 79,
    annualPrice: 63,
    monthlyPriceId: 'price_pro_monthly',
    annualPriceId: 'price_pro_annual',
    popular: true,
    features: [
      'Up to 20 team members',
      '50GB storage',
      'Advanced analytics',
      'All integrations',
      'Priority support',
      'Custom reporting',
      'API access'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For larger organizations with specific needs',
    monthlyPrice: 149,
    annualPrice: 119,
    monthlyPriceId: 'price_business_monthly',
    annualPriceId: 'price_business_annual',
    features: [
      'Unlimited team members',
      '500GB storage',
      'Enterprise analytics',
      'Custom integrations',
      '24/7 phone support',
      'Advanced security',
      'Custom branding',
      'SLA guarantee'
    ]
  }
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

const subscribe = async (plan: Plan) => {
  navigateTo({
    path: '/login',
    query: {
      redirect: '/dashboard/subscription',
      plan: plan.id
    }
  })
}
</script>

<style scoped>
/* Add your styles here */
</style>