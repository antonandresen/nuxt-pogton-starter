<template>
  <section id="testimonials" class="relative py-24 overflow-hidden bg-muted/50">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Loved by teams worldwide
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Don't just take our word for it. Here's what our customers have to say.
        </p>
      </div>

      <!-- Featured Testimonial -->
      <div class="mb-16">
        <Card class="relative overflow-hidden">
          <CardContent class="p-8">
            <div class="grid gap-8 md:grid-cols-2 items-center">
              <!-- Quote -->
              <div class="relative">
                <Quote class="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                <blockquote class="pl-8 pt-8">
                  <p class="text-xl font-medium italic mb-6">
                    "This platform has completely transformed how our team works. The automation features alone have saved us countless hours, and the analytics provide insights we never had before. It's been a game-changer for our business."
                  </p>
                  <footer>
                    <div class="flex items-center gap-4">
                      <Avatar class="h-12 w-12">
                        <AvatarImage src="https://i.pravatar.cc/100?u=1" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p class="font-semibold">John Doe</p>
                        <p class="text-sm text-muted-foreground">CEO at TechCorp</p>
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-8 p-8 bg-muted/50 rounded-2xl">
                <div v-for="stat in featuredStats" :key="stat.label" class="text-center">
                  <p class="text-3xl font-bold">{{ stat.value }}</p>
                  <p class="text-sm text-muted-foreground mt-1">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Testimonial Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="testimonial in testimonials" :key="testimonial.author" class="relative group">
          <CardContent class="p-6 flex flex-col h-full">
            <!-- Rating -->
            <div class="flex gap-1 mb-4">
              <Star
                v-for="i in 5" :key="i" 
                class="h-4 w-4" 
                :class="i <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'" 
              />
            </div>

            <!-- Quote -->
            <blockquote class="mb-6 flex-grow">
              <p class="text-sm">{{ testimonial.quote }}</p>
            </blockquote>

            <!-- Author -->
            <footer class="flex items-center gap-3 mt-auto">
              <Avatar class="h-10 w-10">
                <AvatarImage :src="`https://i.pravatar.cc/100?u=${testimonial.id}`" />
                <AvatarFallback>{{ testimonial.author[0] }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="font-medium text-sm">{{ testimonial.author }}</p>
                <p class="text-xs text-muted-foreground">{{ testimonial.title }}</p>
              </div>
            </footer>

            <!-- Decorative corner gradient -->
            <div class="absolute right-0 top-0 -z-10 h-24 w-24 rounded-bl-full bg-primary/5 transition-all group-hover:scale-150" />
          </CardContent>
        </Card>
      </div>

      <!-- CTA -->
      <div class="mt-16 text-center">
        <Button size="lg" as-child>
          <NuxtLink to="/register">
            Join these happy teams
            <ArrowRight class="ml-2 h-4 w-4" />
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Quote, Star, ArrowRight } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const featuredStats = [
  { value: '500%', label: 'Productivity Increase' },
  { value: '2.5M', label: 'Hours Saved' },
  { value: '99%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'Support Available' }
]

const testimonials = [
  {
    id: 2,
    author: 'Sarah Johnson',
    title: 'Product Manager at InnovateCo',
    quote: 'The analytics dashboard has given us insights we never had before. We can now make data-driven decisions with confidence.',
    rating: 5
  },
  {
    id: 3,
    author: 'Michael Chen',
    title: 'CTO at StartupX',
    quote: 'Implementation was smooth, and the support team was incredibly helpful. Our team adapted to the platform within days.',
    rating: 5
  },
  {
    id: 4,
    author: 'Emily Rodriguez',
    title: 'HR Director at TechGrowth',
    quote: 'The automation features have streamlined our workflows significantly. What used to take hours now takes minutes.',
    rating: 4
  },
  {
    id: 5,
    author: 'David Kim',
    title: 'Operations Lead at ScaleUp',
    quote: 'Security was our top concern, and this platform exceeded our expectations. The features are robust yet user-friendly.',
    rating: 5
  },
  {
    id: 6,
    author: 'Lisa Thompson',
    title: 'Marketing Director at BrandCo',
    quote: 'The integration capabilities are fantastic. We connected all our tools seamlessly, improving our team\'s efficiency.',
    rating: 4
  },
  {
    id: 7,
    author: 'James Wilson',
    title: 'Engineering Lead at DevTeam',
    quote: 'The platform\'s performance and reliability have been outstanding. It\'s become an essential part of our daily operations.',
    rating: 5
  }
]
</script>

<style scoped>
/* Styles for Testimonials Section */
</style>
