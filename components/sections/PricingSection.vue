<template>
  <section 
    id="pricing" 
    :class="[
      'py-24',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" class="mb-4">Pricing</Badge>
        <h2 class="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
        <p class="text-muted-foreground text-lg">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card 
          v-for="plan in plans" 
          :key="plan.name"
          :class="[
            'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
            plan.name === 'Pro' && 'border-primary shadow-md'
          ]"
        >
          <div 
            v-if="plan.name === 'Pro'"
            class="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-bl-lg"
          >
            Popular
          </div>

          <CardHeader>
            <CardTitle class="text-2xl">{{ plan.name }}</CardTitle>
            <CardDescription>
              <span class="text-3xl font-bold">{{ plan.price }}</span>
              <span class="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div class="space-y-4">
              <div 
                v-for="feature in plan.features" 
                :key="feature"
                class="flex items-center gap-2"
              >
                <CheckCircle2 class="h-5 w-5 text-primary flex-shrink-0" />
                <span>{{ feature }}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              class="w-full" 
              :variant="plan.name === 'Pro' ? 'default' : 'outline'"
            >
              Get Started
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-vue-next'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const plans = ref([
  {
    name: 'Basic',
    price: '$9.99',
    features: [
      'Up to 10 projects',
      'Basic analytics',
      'Community support',
      'Basic integrations'
    ],
  },
  {
    name: 'Pro',
    price: '$19.99',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Advanced integrations',
      'Custom domains'
    ],
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom solutions',
      'SLA guarantee',
      'Advanced security'
    ],
  },
])
</script>

<style scoped>
/* Styles for Pricing Section */
</style>