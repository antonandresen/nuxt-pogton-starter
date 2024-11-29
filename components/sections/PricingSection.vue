<template>
  <section 
    id="pricing" 
    :class="[
      'py-16',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">Pricing Plans</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <Card v-for="plan in plans" :key="plan.name" class="p-6">
          <CardHeader>
            <CardTitle>{{ plan.name }}</CardTitle>
            <CardDescription class="text-3xl font-bold mb-4">{{ plan.price }}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="text-left mb-6">
              <li v-for="feature in plan.features" :key="feature" class="mb-2 flex items-center">
                <Check class="mr-2 h-4 w-4 text-primary" /> {{ feature }}
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button class="w-full">Choose Plan</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-vue-next'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const plans = ref([
  {
    name: 'Basic',
    price: '$9.99/mo',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    name: 'Pro',
    price: '$19.99/mo',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
  {
    name: 'Enterprise',
    price: '$49.99/mo',
    features: ['All Features', 'Priority Support', 'Custom Solutions'],
  },
])
</script>

<style scoped>
/* Styles for Pricing Section */
</style>