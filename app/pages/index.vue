<template>
  <main>
    <HeroSection />
    <FeaturesSection background="muted" />
    <PricingSection />
    <TeamSection background="muted" />
    <TestimonialsSection />
    <FAQSection background="muted" />
    <CTASection background="primary" />
  </main>
</template>

<script setup lang="ts">
import HeroSection from '~/components/sections/HeroSection.vue'
import FeaturesSection from '~/components/sections/FeaturesSection.vue'
import PricingSection from '~/components/sections/PricingSection.vue'
import TeamSection from '~/components/sections/TeamSection.vue'
import TestimonialsSection from '~/components/sections/TestimonialsSection.vue'
import FAQSection from '~/components/sections/FAQSection.vue'
import CTASection from '~/components/sections/CTASection.vue'

// 🚀 GIGA ULTRA SEO OPTIMIZATION
const { initSEO, generateFAQSchema } = useSEO({
  title: 'Ultimate Nuxt.js SaaS Starter Kit',
  description: 'Build your next SaaS with Nuxt 4, Drizzle ORM, Tailwind CSS, Stripe Payments, and Authentication. Production-ready starter kit with modern UI components.',
  type: 'website'
})

// Initialize comprehensive SEO
const { breadcrumbs } = initSEO()

// 📊 FAQ STRUCTURED DATA
const faqs = [
  {
    question: "What is included in the Pogton Starter?",
    answer: "Pogton Starter includes Nuxt 4, Drizzle ORM, Tailwind CSS, Stripe payments, authentication, modern UI components, and production-ready features."
  },
  {
    question: "Is this suitable for production?",
    answer: "Yes! Pogton Starter is production-ready with security best practices, performance optimizations, and scalable architecture."
  },
  {
    question: "What payment methods are supported?",
    answer: "We support all major payment methods through Stripe integration including credit cards, digital wallets, and bank transfers."
  },
  {
    question: "Can I customize the design?",
    answer: "Absolutely! The starter kit uses Tailwind CSS and Shadcn/ui components that are fully customizable to match your brand."
  }
]

generateFAQSchema(faqs)

// 🎯 ADDITIONAL STRUCTURED DATA
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Pogton Starter',
        description: 'The Ultimate Nuxt.js SaaS Starter Kit',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        },
        creator: {
          '@type': 'Organization',
          name: 'Pogton Technologies'
        }
      })
    }
  ]
})
</script>

<style>

</style>