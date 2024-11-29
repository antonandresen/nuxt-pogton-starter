<template>
  <section id="faq" class="py-16">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div class="max-w-3xl mx-auto">
        <Accordion type="single" collapsible>
          <AccordionItem
            v-for="faq in faqs"
            :key="faq.question"
            :value="faq.question"
          >
            <AccordionTrigger>{{ faq.question }}</AccordionTrigger>
            <AccordionContent>
              {{ faq.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = ref([
  {
    question: 'How can I get started?',
    answer: 'Simply sign up for an account and follow our quick setup guide.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and PayPal.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, we offer a 14-day free trial with no credit card required.',
  },
])
</script>

<style>

</style>