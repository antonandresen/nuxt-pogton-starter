<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Subscription</h2>
      <p class="text-muted-foreground">Manage your subscription and billing</p>
    </div>

    <!-- Current Plan -->
    <Card v-if="currentSubscription">
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>You are currently on the {{ currentSubscription.plan }} plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ currentSubscription.plan }}</p>
              <p class="text-sm text-muted-foreground">
                {{ formatPrice(currentSubscription.price) }}/month
              </p>
            </div>
            <Badge>Active</Badge>
          </div>
          <div class="text-sm text-muted-foreground">
            <p>Next billing date: {{ formatDate(currentSubscription.nextBillingDate) }}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" @click="showCancelDialog = true">Cancel Subscription</Button>
      </CardFooter>
    </Card>

    <!-- Available Plans -->
    <div v-else>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PriceCard
          v-for="plan in plans"
          :key="plan.id"
          :plan="plan"
          :is-popular="plan.name === 'Pro'"
          :is-current="currentSubscription?.plan === plan.name"
          @select="subscribe(plan)"
        />
      </div>
    </div>

    <!-- Cancel Subscription Dialog -->
    <Dialog v-model:open="showCancelDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" @click="showCancelDialog = false">Keep Subscription</Button>
          <Button variant="destructive" @click="cancelSubscription">Cancel Subscription</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PriceCard from '@/components/PriceCard.vue'
import { loadStripe } from '@stripe/stripe-js'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

interface Plan {
  id: string
  priceId: string
  name: string
  description: string
  price: number
  features: string[]
}

interface Subscription {
  id: string
  plan: string
  price: number
  nextBillingDate: string
}

const config = useRuntimeConfig()

const { toast } = useToast()
const showCancelDialog = ref(false)
const currentSubscription = ref<Subscription | null>(null)

// Example plans - replace with your actual plans
const plans = ref<Plan[]>([
  {
    id: 'basic',
    priceId: 'price_1QSjnUJrjUgmfuESouhYM4G6',
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 9.99,
    features: [
      'Basic features',
      '5 projects',
      'Basic support'
    ]
  },
  {
    id: 'pro',
    priceId: 'price_1QSjoBJrjUgmfuESmoaKuTBA',
    name: 'Pro',
    description: 'For professional developers',
    price: 19.99,
    features: [
      'All Basic features',
      'Unlimited projects',
      'Priority support',
      'Advanced analytics'
    ]
  },
  {
    id: 'enterprise',
    priceId: 'price_1QSjodJrjUgmfuES8D2ehONv',
    name: 'Enterprise',
    description: 'For large teams',
    price: 49.99,
    features: [
      'All Pro features',
      'Custom integrations',
      '24/7 support',
      'Dedicated account manager'
    ]
  }
])

// Format price to currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Subscribe to a plan
const subscribe = async (plan: Plan) => {
  try {
    await redirectToCheckout(plan.priceId)
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to start subscription',
      variant: 'destructive',
    })
  }
}

// Cancel subscription
const cancelSubscription = async () => {
  try {
    // TODO: Implement subscription cancellation
    showCancelDialog.value = false
    currentSubscription.value = null
    toast({
      title: 'Subscription cancelled',
      description: 'Your subscription will end at the end of the billing period',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to cancel subscription',
      variant: 'destructive',
    })
  }
}

const redirectToCheckout = async (priceId) => {
    const stripe = await loadStripe(config.public.STRIPE_PUBLISHABLE_KEY)
  
    try {
      // Call the server to create a Checkout Session
      const { sessionId } = await $fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        body: { priceId },
      })
  
      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
    }
  }

// Fetch current subscription on mount
onMounted(async () => {
  try {
    // TODO: Implement fetching current subscription
    // For now, let's simulate no subscription
    currentSubscription.value = null
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to fetch subscription details',
      variant: 'destructive',
    })
  }
})
</script> 