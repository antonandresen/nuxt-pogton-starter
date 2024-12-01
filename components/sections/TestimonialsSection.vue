<template>
  <section 
    id="testimonials" 
    :class="[
      'py-24',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" class="mb-4">Testimonials</Badge>
        <h2 class="text-4xl font-bold tracking-tight mb-4">Loved by businesses</h2>
        <p class="text-muted-foreground text-lg">
          Don't just take our word for it - hear from our satisfied customers
        </p>
      </div>

      <Carousel :opts="{ loop: true }" class="max-w-4xl mx-auto">
        <CarouselContent>
          <CarouselItem v-for="testimonial in testimonials" :key="testimonial.author">
            <Card class="border-0 bg-background/50 backdrop-blur">
              <CardContent class="pt-10 px-8 pb-8">
                <div class="mb-6">
                  <Star 
                    v-for="n in 5" 
                    :key="n" 
                    class="inline-block w-5 h-5 text-yellow-400 fill-current" 
                  />
                </div>
                <blockquote class="text-xl mb-6 relative">
                  <QuoteIcon class="absolute -top-4 -left-4 w-8 h-8 text-muted-foreground/20" />
                  "{{ testimonial.quote }}"
                </blockquote>
                <div class="flex items-center gap-4">
                  <Avatar class="w-12 h-12">
                    <AvatarImage :src="testimonial.avatar" :alt="testimonial.author" />
                    <AvatarFallback>{{ testimonial.initials }}</AvatarFallback>
                  </Avatar>
                  <div class="text-left">
                    <div class="font-semibold">{{ testimonial.author }}</div>
                    <div class="text-sm text-muted-foreground">{{ testimonial.position }}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="-left-12" />
        <CarouselNext class="-right-12" />
      </Carousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import { Star, QuoteIcon } from 'lucide-vue-next'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const testimonials = ref([
  {
    quote: "This platform has transformed how we operate. The efficiency gains have been remarkable, and the support team is always there when we need them.",
    author: "Alex Thompson",
    position: "CTO at TechCorp",
    avatar: "/img/testimonials/alex.jpg",
    initials: "AT"
  },
  {
    quote: "The best investment we've made for our business. The features are exactly what we needed, and the interface is incredibly intuitive.",
    author: "Sarah Chen",
    position: "Founder at InnovateCo",
    avatar: "/img/testimonials/sarah.jpg",
    initials: "SC"
  },
  {
    quote: "Outstanding platform and even better support. They've thought of everything a growing business needs.",
    author: "James Wilson",
    position: "CEO at GrowthLabs",
    avatar: "/img/testimonials/james.jpg",
    initials: "JW"
  }
])
</script>

<style scoped>
/* Styles for Testimonials Section */
</style>