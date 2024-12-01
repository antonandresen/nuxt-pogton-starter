<template>
  <section 
    id="faq" 
    :class="[
      'py-24',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" class="mb-4">FAQ</Badge>
        <h2 class="text-4xl font-bold tracking-tight mb-4">Common questions</h2>
        <p class="text-muted-foreground text-lg">
          Find answers to frequently asked questions about our platform
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <Accordion type="single" collapsible class="w-full">
          <AccordionItem
            v-for="(faq, index) in faqs"
            :key="index"
            :value="'item-' + index"
            class="border-b-0 [&_button]:border-b"
          >
            <AccordionTrigger class="text-left hover:no-underline">
              <div class="flex items-center gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {{ index + 1 }}
                </div>
                <span class="text-lg font-medium">{{ faq.question }}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pt-4 pb-8 px-12">
              <p class="text-muted-foreground">{{ faq.answer }}</p>
              <div v-if="faq.links" class="mt-4 space-y-2">
                <div v-for="link in faq.links" :key="link.text" class="flex items-center gap-2 text-sm">
                  <ArrowRight class="h-4 w-4 text-primary" />
                  <a :href="link.url" class="text-primary hover:underline">{{ link.text }}</a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { ArrowRight } from 'lucide-vue-next'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const faqs = ref([
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply sign up for a free account and follow our quick setup guide. No credit card required for the trial period.',
    links: [
      { text: 'View Setup Guide', url: '/docs/getting-started' },
      { text: 'Watch Tutorial', url: '/tutorials/quickstart' }
    ]
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For enterprise customers, we also offer invoice-based billing.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! We offer a 14-day free trial on all plans. You\'ll have full access to all features during the trial period.',
  },
  {
    question: 'How does your pricing work?',
    answer: 'Our pricing is based on a monthly subscription model. Choose from Basic, Pro, or Enterprise plans. All plans include core features, with additional capabilities in higher tiers.',
    links: [
      { text: 'Compare Plans', url: '#pricing' }
    ]
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 support via email and chat for all customers. Enterprise customers also get dedicated phone support and a personal account manager.',
  }
])
</script>

<style>

</style>