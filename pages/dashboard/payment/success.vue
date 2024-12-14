<!-- pages/success.vue -->
<template>
    <div class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p class="text-lg mb-6">Thank you for your purchase.</p>
      <Button href="/">Go to Dashboard</Button>
    </div>
  </template>
  
  <script setup>

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>