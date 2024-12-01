<template>
  <section 
    id="features" 
    :class="[
      'py-24',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" class="mb-4">Features</Badge>
        <h2 class="text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
        <p class="text-muted-foreground text-lg">
          Carefully crafted features to help you succeed
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <HoverCard v-for="feature in features" :key="feature.title">
          <HoverCardTrigger>
            <Card class="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <div class="flex items-center gap-4">
                  <div class="p-2 rounded-lg bg-primary/10">
                    <component 
                      :is="feature.icon" 
                      class="h-6 w-6 text-primary"
                    />
                  </div>
                  <CardTitle>{{ feature.title }}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">{{ feature.description }}</p>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent class="w-80">
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">{{ feature.title }}</h4>
              <p class="text-sm text-muted-foreground">
                {{ feature.extendedDescription }}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
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
    extendedDescription: 'Built on cutting-edge technology to ensure your application runs at peak performance.'
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