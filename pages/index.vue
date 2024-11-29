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
</script>

<style>

</style>