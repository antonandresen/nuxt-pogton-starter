<template>
  <section class="relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

    <!-- Content -->
    <div class="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        <!-- Left Column -->
        <div class="max-w-2xl">
          <FadeContent :duration="800" :delay="200" :threshold="0.1">
            <h1 class="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span class="block text-primary">Modern Solutions</span>
              <span class="block">for Modern Teams</span>
            </h1>
          </FadeContent>
          
          <FadeContent :duration="800" :delay="300" :threshold="0.1">
            <p class="mt-6 text-xl text-muted-foreground max-w-xl">
              Empower your team with cutting-edge tools designed for today's workplace. 
              Streamline workflows, boost productivity, and drive success.
            </p>
          </FadeContent>
          
          <FadeContent :duration="800" :delay="400" :threshold="0.1">
            <div class="mt-10 flex items-center gap-4">
              <Button size="lg" as-child>
                <NuxtLink to="/register">Get Started</NuxtLink>
              </Button>
              <Button size="lg" variant="outline" as-child>
                <NuxtLink to="#features">Learn More</NuxtLink>
              </Button>
            </div>
          </FadeContent>
          
          <!-- Stats -->
          <FadeContent :duration="800" :delay="500" :threshold="0.1">
            <div class="mt-12 grid grid-cols-3 gap-8 border-t pt-8">
              <div>
                <p class="text-4xl font-bold">98%</p>
                <p class="mt-2 text-sm text-muted-foreground">Customer Satisfaction</p>
              </div>
              <div>
                <p class="text-4xl font-bold">24/7</p>
                <p class="mt-2 text-sm text-muted-foreground">Expert Support</p>
              </div>
              <div>
                <p class="text-4xl font-bold">10k+</p>
                <p class="mt-2 text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </FadeContent>
        </div>

        <!-- Right Column - Feature Preview -->
        <div class="relative lg:ml-8">
          <!-- Decorative Elements -->
          <div class="absolute -left-4 -top-4 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />
          <div class="absolute -right-4 -bottom-4 h-72 w-72 bg-secondary/10 rounded-full blur-3xl" />
          
          <!-- Feature Preview Card -->
          <FadeContent :duration="1000" :delay="300" :threshold="0.1">
            <div class="relative rounded-2xl border bg-card p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-8">
              <div class="space-y-1">
                <h3 class="font-semibold">Dashboard Overview</h3>
                <p class="text-sm text-muted-foreground">Real-time analytics and insights</p>
              </div>
              <Badge variant="secondary">Pro Feature</Badge>
            </div>
            
            <!-- Mock Chart -->
            <div class="space-y-4">
              <div class="h-2 w-full rounded-full bg-muted">
                <div class="h-2 w-3/4 rounded-full bg-primary" />
              </div>
              <div class="grid grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="space-y-2">
                  <div class="h-2 w-full rounded-full bg-muted">
                    <div 
                      class="h-2 rounded-full bg-primary" 
                      :style="{ width: `${Math.random() * 100}%` }"
                    />
                  </div>
                  <div class="h-2 w-2/3 rounded-full bg-muted" />
                </div>
              </div>
            </div>

            <!-- Mock Stats -->
            <div class="mt-8 grid grid-cols-3 gap-4">
              <div v-for="i in 3" :key="i" class="rounded-lg border p-4">
                <div class="h-2 w-12 rounded-full bg-muted mb-2" />
                <div class="h-6 w-16 rounded-lg bg-muted" />
              </div>
            </div>
          </div>
          </FadeContent>

          <!-- Floating Elements -->
          <FadeContent :duration="800" :delay="600" :threshold="0.1">
            <div class="absolute -right-4 top-16 md:top-24 lg:right-0 xl:-right-4 w-max">
              <div class="rounded-xl border bg-card p-4 shadow-lg">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check class="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium">Task Completed</p>
                    <p class="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeContent>
          
          <FadeContent :duration="800" :delay="700" :threshold="0.1">
            <div class="absolute -left-4 bottom-16 md:bottom-24 lg:left-0 xl:-left-4 w-max">
              <div class="rounded-xl border bg-card p-4 shadow-lg">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp class="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p class="text-sm font-medium">Revenue Up</p>
                    <p class="text-xs text-muted-foreground">+12.3% this week</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeContent>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, TrendingUp } from 'lucide-vue-next'
import FadeContent from '@/components/Animations/FadeContent.vue'


onMounted(() => {
  // Add a CSS background pattern
  const style = document.createElement('style')
  style.textContent = `
  .bg-grid-pattern {
    background-image: linear-gradient(to right, rgb(var(--foreground) / 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgb(var(--foreground) / 0.1) 1px, transparent 1px);
    background-size: 4rem 4rem;
  }
`
  document.head.appendChild(style)
})
</script>

<style scoped>
.hero {
  background-image: url('/images/hero-background.jpg');
  background-size: cover;
  background-position: center;
}
</style>