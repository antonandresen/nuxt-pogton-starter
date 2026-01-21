<template>
  <div class="container max-w-6xl py-8 space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <IconLoader2 class="w-8 h-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 mb-4">Failed to load subscription details</p>
      <Button @click="refresh">Try Again</Button>
    </div>

    <!-- Subscription Details -->
    <div v-else-if="subscription" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>Manage your subscription and billing details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Subscription Status -->
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium">Status</p>
              <p class="text-2xl font-bold">
                <span
                  :class="{
                    'text-green-500': subscription.status === 'active',
                    'text-yellow-500': subscription.status === 'trialing',
                    'text-red-500': ['canceled', 'incomplete'].includes(subscription.status)
                  }"
                >
                  {{ capitalize(subscription.status) }}
                </span>
              </p>
            </div>
            <div v-if="subscription.status === 'active'" class="space-y-1 text-right">
              <p class="text-sm font-medium">Next Payment</p>
              <p class="text-2xl font-bold">
                {{ subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A' }}
              </p>
            </div>
          </div>

          <!-- Payment Method -->
          <div v-if="subscription.paymentMethodBrand" class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="space-y-1">
                <p class="text-sm font-medium">Payment Method</p>
                <p class="text-muted-foreground">
                  {{ capitalize(subscription.paymentMethodBrand) }} ending in {{ subscription.paymentMethodLast4 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Auto-renewal Status -->
          <div v-if="subscription.status === 'active'" class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="space-y-1">
                <p class="text-sm font-medium">Auto-renewal</p>
                <p class="text-muted-foreground">
                  {{ subscription.cancelAtPeriodEnd ? 'Your subscription will end on the next billing date' : 'Your subscription will automatically renew' }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-4">
          <Button v-if="!subscription.cancelAtPeriodEnd" variant="destructive">
            Cancel Subscription
          </Button>
          <Button v-else variant="default">
            Resume Subscription
          </Button>
          <Button variant="outline">
            Update Payment Method
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Show pricing plans if no active subscription -->
    <div v-else>
      <PricingSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConvexQuery, api, type Id } from '~/composables/useConvex'

definePageMeta({
  middleware: ['auth']
})

const { initSEO } = useSEO({
  title: 'Subscription',
  description: 'Manage your subscription and billing.',
  noindex: true
})

initSEO()

const { user } = useAuth()

// Real-time subscription data from Convex
const { data: subscription, isLoading, error } = useConvexQuery(
  api.subscriptions.getByUserId,
  () => user.value?.id ? { userId: user.value.id as Id<"users"> } : 'skip'
)

const refresh = () => {
  // Convex auto-refreshes, but we can trigger a re-render
  window.location.reload()
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
