<template>
  <section 
    id="testimonials" 
    :class="[
      'py-16',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">What Our Clients Say</h2>
      <Carousel class="max-w-3xl mx-auto">
        <CarouselContent>
          <CarouselItem v-for="testimonial in testimonials" :key="testimonial.author">
            <Card>
              <CardContent class="pt-6">
                <blockquote class="text-xl italic mb-4">
                  "{{ testimonial.quote }}"
                </blockquote>
                <Text class="font-semibold">{{ testimonial.author }}</Text>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const testimonials = ref([
  {
    quote: 'This service is fantastic! Highly recommended.',
    author: 'John Doe',
  },
  {
    quote: 'An exceptional experience from start to finish.',
    author: 'Jane Smith',
  },
  {
    quote: 'Their customer support is top-notch.',
    author: 'Mike Williams',
  },
])
</script>

<style scoped>
/* Styles for Testimonials Section */
</style>