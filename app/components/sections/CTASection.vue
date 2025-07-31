<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute left-1/4 top-1/2 -translate-y-1/2 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="max-w-6xl mx-auto">
        <Card class="overflow-hidden">
          <CardContent class="p-0">
            <div class="grid lg:grid-cols-2">
              <!-- Content -->
              <FadeContent :duration="800" :delay="200" :threshold="0.1">
                <div class="p-8 lg:p-12 flex flex-col justify-center">
                  <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                    Ready to transform your workflow?
                  </h2>
                  <p class="text-lg text-muted-foreground mb-8 max-w-xl">
                    Join thousands of teams who have already taken their productivity to the next level.
                    Start your free trial today.
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" as-child>
                      <NuxtLink to="/register">
                        Get Started
                        <ArrowRight class="ml-2 h-4 w-4" />
                      </NuxtLink>
                    </Button>
                    <Button size="lg" variant="outline" as-child>
                      <NuxtLink to="/">
                        Contact Sales
                        <MessageSquare class="ml-2 h-4 w-4" />
                      </NuxtLink>
                    </Button>
                  </div>
                  
                  <!-- Trust Indicators -->
                  <div class="mt-8 pt-8 border-t">
                    <p class="text-sm text-muted-foreground mb-4">Trusted by leading companies worldwide</p>
                    <div class="flex flex-wrap gap-8 items-center">
                      <div v-for="i in 4" :key="i" class="h-8 w-24 rounded bg-muted/50" />
                    </div>
                  </div>
                </div>
              </FadeContent>

              <!-- Visual -->
              <FadeContent :duration="800" :delay="400" :threshold="0.1">
                <div class="relative bg-muted lg:bg-transparent p-8 lg:p-12">
                  <!-- Stats Grid -->
                  <div class="grid grid-cols-2 gap-8">
                    <div v-for="stat in stats" :key="stat.label" class="relative">
                      <!-- Stat Card -->
                      <Card>
                        <CardContent class="p-6">
                          <div class="space-y-2">
                            <p class="text-4xl font-bold">{{ stat.value }}</p>
                            <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <!-- Decorative Elements -->
                      <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                    </div>
                  </div>
                </div>
              </FadeContent>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, MessageSquare } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FadeContent from '@/components/Animations/FadeContent.vue'

const stats = [
  { value: '10k+', label: 'Active Users' },
  { value: '95%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'Expert Support' },
  { value: '99.9%', label: 'Uptime SLA' }
]
</script>

<style>

</style>