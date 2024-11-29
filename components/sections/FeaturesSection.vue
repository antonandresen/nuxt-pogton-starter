<template>
  <section id="features" class="py-16">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">Our Features</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <Card v-for="feature in features" :key="feature.title" class="p-6">
          <CardHeader>
            <component 
              :is="feature.icon" 
              class="mx-auto mb-4 h-12 w-12 text-primary"
            />
            <CardTitle>{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Zap, Shield, HeadphonesIcon } from 'lucide-vue-next'

const features = ref([
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Experience lightning-fast load times.',
  },
  {
    icon: Shield,
    title: 'Top-notch Security',
    description: 'Your data is safe with us.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'We are here to help anytime.',
  },
])
</script>

<style scoped>
/* Styles for Features Section */
</style>