<template>
  <Section
    id="features"
    :background="background"
    badge="Features"
    title="Everything you need"
    subtitle="Our platform provides all the features you need to succeed"
  >
    <div class="grid gap-8 md:grid-cols-3">
      <Card v-for="feature in features" :key="feature.title">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <component :is="feature.icon" class="h-5 w-5" />
            {{ feature.title }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">{{ feature.description }}</p>
          <HoverCard v-if="feature.extendedDescription">
            <HoverCardTrigger>
              <Button variant="link" class="p-0 h-auto">Learn more</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              {{ feature.extendedDescription }}
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>
    </div>
  </Section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Section from '@/components/sections/Section.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Button } from '@/components/ui/button'
import { Zap, Shield, HeadphonesIcon } from 'lucide-vue-next'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const features = ref([
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing fast performance.',
  },
  {
    icon: Shield,
    title: 'Bank-grade Security',
    description: 'Your data is protected 24/7.',
    extendedDescription: 'Enterprise-level security with end-to-end encryption and regular security audits.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Always Here',
    description: 'Support when you need it.',
    extendedDescription: '24/7 dedicated support team ready to help you with any questions or concerns.'
  },
])
</script>

<style scoped>
/* Styles for Features Section */
</style>