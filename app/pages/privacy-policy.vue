<template>
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div class="prose dark:prose-invert max-w-none">
        <p class="mb-4">Last updated: {{ new Date().toLocaleDateString() }}</p>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to [Your Company Name] ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p class="mb-4">We collect information that you provide directly to us, including:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Communications with us</li>
          </ul>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p class="mb-4">We use the information we collect to:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
          </ul>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">4. Information Sharing</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share your information in the following situations:
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>
            You have certain rights regarding your personal information, including:
          </p>
          <ul class="list-disc pl-6 mb-4">
            <li>Right to access your data</li>
            <li>Right to correct your data</li>
            <li>Right to delete your data</li>
            <li>Right to data portability</li>
          </ul>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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