<template>
  <section id="faq" class="relative py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute left-1/4 bottom-1/2 translate-y-1/2 w-1/2 aspect-square bg-secondary/5 rounded-full blur-3xl" />
    
    <FadeContent :duration="1000" :delay="200" :threshold="0.1">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Frequently asked questions
          </h2>
          <p class="mt-4 text-lg text-muted-foreground">
            Everything you need to know about our platform and services.
          </p>
        </div>

        <!-- FAQ Grid -->
        <div class="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          <div class="space-y-4">
            <Accordion v-for="(faq, i) in faqs.slice(0, Math.ceil(faqs.length/2))" :key="i" type="single" collapsible class="w-full">
              <AccordionItem :value="'faq-' + i">
                <AccordionTrigger class="text-left">{{ faq.question }}</AccordionTrigger>
                <AccordionContent>
                  <p class="text-muted-foreground">{{ faq.answer }}</p>
                  <div v-if="faq.links" class="mt-4 flex gap-4">
                    <Button v-for="link in faq.links" :key="link.text" variant="outline" size="sm" as-child>
                      <NuxtLink :to="link.url">
                        {{ link.text }}
                        <ArrowRight class="ml-2 h-4 w-4" />
                      </NuxtLink>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div class="space-y-4">
            <Accordion v-for="(faq, i) in faqs.slice(Math.ceil(faqs.length/2))" :key="i" type="single" collapsible class="w-full">
              <AccordionItem :value="'faq-' + (i + Math.ceil(faqs.length/2))">
                <AccordionTrigger class="text-left">{{ faq.question }}</AccordionTrigger>
                <AccordionContent>
                  <p class="text-muted-foreground">{{ faq.answer }}</p>
                  <div v-if="faq.links" class="mt-4 flex gap-4">
                    <Button v-for="link in faq.links" :key="link.text" variant="outline" size="sm" as-child>
                      <NuxtLink :to="link.url">
                        {{ link.text }}
                        <ArrowRight class="ml-2 h-4 w-4" />
                      </NuxtLink>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- Contact CTA -->
        <div class="mt-16 text-center">
          <p class="text-muted-foreground mb-4">Still have questions?</p>
          <Button size="lg" as-child>
            <NuxtLink to="/">
              Contact Support
              <MessageCircle class="ml-2 h-4 w-4" />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </FadeContent>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, MessageCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import FadeContent from '@/components/Animations/FadeContent.vue'

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access to all features. No credit card required. At the end of the trial, you can choose to upgrade to a paid plan or continue with limited features.',
    links: [
      { text: 'Start Trial', url: '/register' },
      { text: 'View Pricing', url: '#pricing' }
    ]
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and offer invoice payment for annual enterprise plans.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time. Plan changes take effect immediately, and we will prorate any payments.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No, our services are provided on a month-to-month basis. You can cancel at any time without penalty. For annual plans, we offer a 30-day money-back guarantee.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We offer email support for all plans, priority support for Pro plans, and 24/7 phone support for Enterprise customers. Our average response time is under 2 hours.',
    links: [{ text: 'Contact Support', url: '/' }]
  },
  {
    question: 'How secure is my data?',
    answer: 'We use industry-standard encryption and security practices. Your data is stored in secure, SOC 2 compliant data centers, and we perform regular security audits.',
    links: [{ text: 'Security Details', url: '/security' }]
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export your data at any time in standard formats (CSV, JSON). We also offer API access for automated data synchronization.',
  },
  {
    question: 'Do you offer custom solutions?',
    answer: 'Yes, our Enterprise plan includes custom integration options, dedicated support, and can be tailored to your specific needs. Contact our sales team to learn more.',
    links: [{ text: 'Contact Sales', url: '/' }]
  }
]
</script>

<style>
</style>