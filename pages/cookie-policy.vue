<template>
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div class="prose dark:prose-invert max-w-none">
        <p class="mb-4">Last updated: {{ new Date().toLocaleDateString() }}</p>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small pieces of text sent to your web browser by a website you visit. They help that website remember information about your visit, which can both make it easier to visit the site again and make the site more useful to you.
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p class="mb-4">We use cookies for several purposes, including:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Authentication and security</li>
            <li>Preferences and features</li>
            <li>Analytics and performance</li>
            <li>Advertising (if applicable)</li>
          </ul>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <div class="mb-4">
            <h3 class="text-xl font-semibold mb-2">Essential Cookies</h3>
            <p>Required for the operation of our website. Include cookies for authentication and security.</p>
          </div>
          <div class="mb-4">
            <h3 class="text-xl font-semibold mb-2">Analytical Cookies</h3>
            <p>Allow us to analyze website usage and improve user experience.</p>
          </div>
          <div class="mb-4">
            <h3 class="text-xl font-semibold mb-2">Functional Cookies</h3>
            <p>Remember your preferences and settings.</p>
          </div>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
          <p class="mb-4">
            Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience using our website.
          </p>
          <p>
            To learn more about cookies and how to manage them, visit:
            <a href="https://www.aboutcookies.org/" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AboutCookies.org</a>
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
          </p>
        </section>
  
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at:
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