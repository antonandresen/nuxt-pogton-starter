<!-- pages/pricing.vue -->
<template>
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-center mb-8">Choose a Plan</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card
          v-for="plan in plans"
          :key="plan.id"
          class="p-6 text-center border rounded-lg"
        >
          <h2 class="text-2xl font-semibold mb-4">{{ plan.name }}</h2>
          <p class="text-gray-700 mb-6">{{ plan.description }}</p>
          <p class="text-3xl font-bold mb-6">{{ plan.price }}</p>
          <Button @click="redirectToCheckout(plan.id)">Get Started</Button>
        </Card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { loadStripe } from '@stripe/stripe-js'
  
  const config = useRuntimeConfig()
  
  const plans = ref([
    {
      id: 'price_1QSjnUJrjUgmfuESouhYM4G6', // Replace with your Stripe Price ID
      name: 'Basic Plan',
      description: 'Basic features for personal use',
      price: '$9.99',
    },
    {
      id: 'price_1QSjoBJrjUgmfuESmoaKuTBA',
      name: 'Pro Plan',
      description: 'Advanced features for professionals',
      price: '$19.99',
    },
    {
      id: 'price_1QSjodJrjUgmfuES8D2ehONv',
      name: 'Enterprise Plan',
      description: 'Full features for enterprises',
      price: '$49.99',
    },
  ])
  
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
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>