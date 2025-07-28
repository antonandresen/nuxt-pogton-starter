<template>
  <Card 
    :class="[
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col',
      isPopular && 'border-primary shadow-md'
    ]"
  >
    <!-- Popular Badge -->
    <div 
      v-if="isPopular"
      class="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-bl-lg"
    >
      Popular
    </div>

    <!-- Current Plan Badge -->
    <div 
      v-if="isCurrent"
      class="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-bl-lg"
    >
      Current Plan
    </div>

    <CardHeader>
      <CardTitle class="text-2xl">{{ plan.name }}</CardTitle>
      <CardDescription>
        <span class="text-3xl font-bold">{{ formatPrice(plan.price) }}</span>
        <span class="text-muted-foreground">/month</span>
      </CardDescription>
    </CardHeader>

    <CardContent class="flex-grow">
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

    <CardFooter class="mt-auto">
      <Button 
        class="w-full" 
        :variant="isPopular ? 'default' : 'outline'"
        :disabled="isCurrent"
        @click="$emit('select', plan)"
      >
        <template v-if="isCurrent">
          Current Plan
        </template>
        <template v-else>
          Get Started
          <ArrowRight class="ml-2 h-4 w-4" />
        </template>
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { CheckCircle2, ArrowRight } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
}

const props = defineProps<{
  plan: Plan
  isPopular?: boolean
  isCurrent?: boolean
}>()

const emit = defineEmits<{
  select: [plan: Plan]
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
</script> 