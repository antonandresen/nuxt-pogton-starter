<script setup lang="ts">
import { Check, ShoppingCart, Loader2, AlertCircle } from 'lucide-vue-next'
import { loadStripe } from '@stripe/stripe-js'

const config = useRuntimeConfig()
const stripe = await loadStripe(config.public.STRIPE_PUBLISHABLE_KEY)

interface Product {
  id: string
  name: string
  description: string
  price: number
  priceId: string
  image: string
  features: string[]
}

// Sample products - can be replaced later
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Development Kit',
    description: 'A comprehensive toolkit for modern web development.',
    price: 9.99,
    priceId: 'price_1QmM1vJrjUgmfuESeLauGCMR',
    image: 'img/products/premium-development-kit.jpg',
    features: [
      'Ready-to-use component library',
      'Best practices documentation',
      'Premium support access',
      'Future updates included'
    ]
  },
  {
    id: '2',
    name: 'Advanced UI Components',
    description: 'Professional-grade UI components for modern applications.',
    price: 14.99,
    priceId: 'price_1QmM1vJrjUgmfuESeLauGCMR',
    image: 'img/products/advanced-ui-components.jpg',
    features: [
      'Accessible components',
      'Dark mode support',
      'Customizable themes',
      'TypeScript ready'
    ]
  },
  {
    id: '3',
    name: 'Performance Toolkit',
    description: 'Optimize your application for maximum performance.',
    price: 19.99,
    priceId: 'price_1QmM1vJrjUgmfuESeLauGCMR',
    image: 'img/products/performance-toolkit.jpg',
    features: [
      'Performance monitoring',
      'Optimization tools',
      'Best practices guide',
      'Regular updates'
    ]
  }
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Separate state for each product's loading state
const loadingStates = ref<{ [key: string]: boolean }>(
  Object.fromEntries(products.map(p => [p.id, false]))
)

const error = ref<string | null>(null)

const handleCheckout = async (product: Product) => {
  if (!stripe) {
    error.value = 'Failed to initialize payment system'
    return
  }

  error.value = null
  loadingStates.value[product.id] = true
  
  try {
    const { sessionId } = await $fetch<{ sessionId: string }>('/api/payment/create-one-time-checkout', {
      method: 'POST',
      body: { priceId: product.priceId }
    })
    
    if (sessionId) {
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } else {
      error.value = 'Failed to create checkout session'
    }
  } catch (err) {
    console.error('Checkout error:', err)
    error.value = 'Failed to process checkout. Please try again.'
  } finally {
    loadingStates.value[product.id] = false
  }
}
</script>

<template>
  <div class="container py-12">
    <!-- Header -->
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h1 class="text-4xl font-bold tracking-tight mb-4">
        Developer Tools & Resources
      </h1>
      <p class="text-lg text-muted-foreground">
        Premium tools and resources to enhance your development workflow
      </p>
    </div>

    <!-- Products Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card 
        v-for="product in products" 
        :key="product.id"
        class="group relative overflow-hidden transition-all hover:shadow-lg flex flex-col"
      >
        <!-- Product Image -->
        <div class="aspect-[4/3] overflow-hidden bg-muted">
          <img
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
          >
        </div>

        <CardHeader>
          <CardTitle>{{ product.name }}</CardTitle>
          <CardDescription>{{ product.description }}</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4 flex-grow flex flex-col">
          <!-- Features List -->
          <ul class="space-y-2">
            <li 
              v-for="feature in product.features" 
              :key="feature"
              class="flex items-center gap-2 text-sm"
            >
              <Check class="h-4 w-4 text-green-500 shrink-0" />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <!-- Price and Buy Button -->
          <div class="flex items-center justify-between pt-4 border-t mt-auto">
            <div>
              <p class="text-sm text-muted-foreground">One-time payment</p>
              <p class="text-2xl font-bold">{{ formatPrice(product.price) }}</p>
            </div>
            <Button
              variant="default"
              size="sm"
              :disabled="loadingStates[product.id]"
              @click="handleCheckout(product)"
            >
              <Loader2
                v-if="loadingStates[product.id]"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <ShoppingCart
                v-else
                class="mr-2 h-4 w-4"
              />
              Buy Now
            </Button>
          </div>
        </CardContent>

        <!-- Decorative corner gradient -->
        <div class="absolute right-0 top-0 -z-10 h-16 w-16 rounded-bl-full bg-primary/10 transition-all group-hover:scale-150" />
      </Card>
    </div>

    <!-- Error Message -->
    <Alert v-if="error" variant="destructive" class="mt-8">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>
  </div>
</template> 