<template>
  <Section
    id="pricing"
    :background="background"
    badge="Pricing"
    title="Simple, transparent pricing"
    subtitle="Choose the perfect plan for your needs"
  >
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <PriceCard
        v-for="plan in plans" 
        :key="plan.name"
        :plan="plan"
        :is-popular="plan.name === 'Pro'"
        @select="handlePlanSelect"
      />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Section from '@/components/sections/Section.vue'
import PriceCard from '@/components/PriceCard.vue'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const router = useRouter()

const plans = ref([
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: [
      'Up to 10 projects',
      'Basic analytics',
      'Community support',
      'Basic integrations'
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Advanced integrations',
      'Custom domains'
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom solutions',
      'SLA guarantee',
      'Advanced security'
    ],
  },
])

const handlePlanSelect = (plan: any) => {
  // Redirect to login page with plan selection in query params
  router.push({
    path: '/login',
    query: {
      redirect: '/dashboard/subscription',
      plan: plan.id
    }
  })
}
</script>

<style scoped>
/* Styles for Pricing Section */
</style>