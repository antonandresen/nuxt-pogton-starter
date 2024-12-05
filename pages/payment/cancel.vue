<!-- pages/cancel.vue -->
<template>
    <div class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold mb-4">Payment Cancelled</h1>
      <p class="text-lg mb-6">You have cancelled the payment.</p>
      <Button href="/pricing">Return to Pricing</Button>
    </div>
  </template>
  
  <script setup>
  // Add any necessary logic here
  import Button from '~/components/ui/Button.vue'
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>