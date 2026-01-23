<template>
  <div class="space-y-8">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- No plans -->
    <div v-else-if="!plans?.length" class="text-center py-12 text-muted-foreground">
      No pricing plans configured yet.
    </div>

    <!-- Plans -->
    <template v-else>
      <!-- Toggle -->
      <div class="flex justify-center items-center gap-4">
        <span class="text-sm font-medium" :class="{ 'text-primary': !isAnnual }">Monthly</span>
        <Switch :checked="isAnnual" @update:checked="isAnnual = $event" />
        <span class="text-sm font-medium" :class="{ 'text-primary': isAnnual }">
          Annual
          <Badge variant="secondary" class="ml-2">Save 20%</Badge>
        </span>
      </div>

      <!-- Cards -->
      <div class="grid gap-8 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
        <Card
          v-for="plan in plans"
          :key="plan._id"
          class="relative group transition-all hover:shadow-lg h-full flex flex-col"
          :class="{ 'border-primary ring-2 ring-primary ring-offset-2': plan.isPopular }"
        >
          <CardHeader>
            <div class="flex justify-between items-start mb-4">
              <div>
                <CardTitle class="text-xl">{{ plan.name }}</CardTitle>
                <CardDescription>{{ plan.description }}</CardDescription>
              </div>
              <Badge v-if="plan.isPopular" variant="default">Most Popular</Badge>
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

          <CardContent class="space-y-6 flex-1 flex flex-col">
            <Button
              class="w-full"
              :variant="plan.isPopular ? 'default' : 'outline'"
              :disabled="isCheckingOut"
              @click="handleSelect(plan)"
            >
              <Loader2 v-if="isCheckingOut && selectedPlanId === plan._id" class="mr-2 h-4 w-4 animate-spin" />
              {{ mode === 'dashboard' ? 'Subscribe' : 'Get Started' }}
            </Button>

            <Separator />

            <ul class="space-y-3 flex-1">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
                <Check class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span class="text-sm">{{ feature }}</span>
              </li>
            </ul>
          </CardContent>

          <div class="absolute right-0 top-0 -z-10 h-24 w-24 rounded-bl-full bg-primary/5 transition-all group-hover:scale-150" />
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Check, Loader2 } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { api, useConvexQuery } from '~/composables/useConvex'
import { useToast } from '@/components/ui/toast/use-toast'
import { loadStripe } from '@stripe/stripe-js'

interface Plan {
  _id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
  features: string[]
  isPopular: boolean
}

const props = withDefaults(defineProps<{
  mode: 'landing' | 'dashboard'
}>(), {
  mode: 'landing',
})

const config = useRuntimeConfig()
const router = useRouter()
const { toast } = useToast()

const { data: plans, isLoading } = useConvexQuery(api.pricingPlans.listActive, {})

const isAnnual = ref(false)
const isCheckingOut = ref(false)
const selectedPlanId = ref<string | null>(null)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

const handleSelect = async (plan: Plan) => {
  if (props.mode === 'landing') {
    // Redirect to login with plan info
    router.push({
      path: '/login',
      query: {
        redirect: '/dashboard/subscription',
        plan: plan._id,
        annual: isAnnual.value ? '1' : '0',
      },
    })
    return
  }

  // Dashboard mode: trigger Stripe checkout
  const priceId = isAnnual.value ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly

  if (!priceId) {
    toast({
      title: 'Plan not configured',
      description: 'This plan is not connected to Stripe yet.',
      variant: 'destructive',
    })
    return
  }

  isCheckingOut.value = true
  selectedPlanId.value = plan._id

  try {
    const stripe = await loadStripe(config.public.STRIPE_PUBLISHABLE_KEY)
    if (!stripe) {
      throw new Error('Failed to load Stripe')
    }

    const { sessionId } = await $fetch<{ sessionId: string }>('/api/payment/create-checkout-session', {
      method: 'POST',
      body: { priceId },
    })

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      throw new Error(error.message)
    }
  } catch (error: any) {
    toast({
      title: 'Checkout failed',
      description: error.message || 'Failed to start checkout. Please try again.',
      variant: 'destructive',
    })
  } finally {
    isCheckingOut.value = false
    selectedPlanId.value = null
  }
}
</script>

