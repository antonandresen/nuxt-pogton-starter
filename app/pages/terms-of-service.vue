<template>
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div class="prose dark:prose-invert max-w-none">
        <p class="mb-4">Last updated: {{ new Date().toLocaleDateString() }}</p>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using [Your Company Name]'s services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">2. Use License</h2>
          <p class="mb-4">
            Permission is granted to temporarily access the materials (information or software) on [Your Company Name]'s website for personal, non-commercial transitory viewing only.
          </p>
          <p>This license shall automatically terminate if you violate any of these restrictions.</p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">3. User Account</h2>
          <p class="mb-4">When you create an account with us, you must provide accurate and complete information.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must notify us immediately of any unauthorized access</li>
            <li>You may not use another user's account</li>
          </ul>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">4. Service Modifications</h2>
          <p>
            We reserve the right to withdraw or modify our service, and any service or material we provide, in our sole discretion without notice.
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">5. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at:
            <br />
            Email: [Your Contact Email]
            <br />
            Address: [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'default'
  })
  </script>