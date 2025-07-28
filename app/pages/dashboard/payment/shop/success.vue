<template>
  <div class="container max-w-2xl py-12">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">
          <template v-if="isVerifying">
            Verifying Payment...
          </template>
          <template v-else-if="error">
            Payment Verification Failed
          </template>
          <template v-else>
            Thank you for your purchase!
          </template>
        </CardTitle>
        <CardDescription v-if="!error && !isVerifying">
          Your payment has been confirmed and your purchase is complete.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col items-center space-y-6">
        <!-- Loading State -->
        <div v-if="isVerifying" class="py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center space-y-4">
          <AlertCircle class="h-12 w-12 text-destructive mx-auto" />
          <p class="text-destructive">{{ error }}</p>
        </div>

        <!-- Success State -->
        <div v-else class="w-full space-y-6">
          <div class="flex justify-center">
            <CheckCircle class="h-12 w-12 text-green-500" />
          </div>

          <!-- Purchase Details -->
          <div class="rounded-lg border bg-card p-6 space-y-4">
            <h3 class="font-semibold text-lg text-center mb-4">Purchase Details</h3>
            
            <!-- Product -->
            <div class="flex items-start gap-4">
              <Package class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="font-medium">Product</p>
                <p class="text-muted-foreground">{{ purchase?.productName }}</p>
              </div>
            </div>

            <!-- Amount -->
            <div class="flex items-start gap-4">
              <CreditCard class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="font-medium">Amount</p>
                <p class="text-muted-foreground">
                  {{ purchase ? formatAmount(purchase.amount, purchase.currency) : '-' }}
                </p>
              </div>
            </div>

            <!-- Date -->
            <div class="flex items-start gap-4">
              <Calendar class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="font-medium">Purchase Date</p>
                <p class="text-muted-foreground">
                  {{ purchase?.date ? formatDate(purchase.date) : '-' }}
                </p>
              </div>
            </div>

            <!-- Order ID -->
            <div class="pt-4 mt-4 border-t text-center">
              <p class="text-sm text-muted-foreground">
                Order ID: {{ purchase?.paymentId }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-center pt-6">
        <Button @click="backToShop">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CheckCircle, Loader2, AlertCircle, Package, Calendar, CreditCard } from 'lucide-vue-next'

interface PurchaseResponse {
  id: number
  productName: string
  amount: number
  currency: string
  date: string
  paymentId: string
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Success'
})

const route = useRoute()
const router = useRouter()

// State management
const isVerifying = ref(true)
const error = ref<string | null>(null)
const purchase = ref<PurchaseResponse | null>(null)

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format currency
const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Verify the payment
onMounted(async () => {
  const sessionId = route.query.session_id as string

  if (!sessionId) {
    error.value = 'No session ID provided'
    isVerifying.value = false
    return
  }

  try {
    const response = await $fetch<{ success: boolean; purchase: PurchaseResponse }>('/api/payment/verify-one-time-payment', {
      method: 'POST',
      body: { sessionId }
    })

    if (response.success) {
      purchase.value = response.purchase
    } else {
      throw new Error('Payment verification failed')
    }
  } catch (err) {
    console.error('Payment verification error:', err)
    error.value = 'Failed to verify payment. Please contact support.'
  } finally {
    isVerifying.value = false
  }
})

// Navigate back to shop
const backToShop = () => {
  router.push('/shop')
}
</script>