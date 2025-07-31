<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 bottom-1/2 translate-y-1/2 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    
    <FadeContent :duration="1000" :delay="200" :threshold="0.1">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Meet our team
          </h2>
          <p class="mt-4 text-lg text-muted-foreground">
            The talented people behind our success.
          </p>
        </div>

        <!-- Leadership Team -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card v-for="member in team" :key="member.name" class="group relative overflow-hidden">
            <CardContent class="p-6">
              <!-- Image -->
              <div class="relative w-full aspect-[4/5] mb-6 overflow-hidden rounded-lg">
                <img 
                  :src="member.image" 
                  :alt="member.name"
                  class="object-cover w-full h-full transition-transform group-hover:scale-105"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                <!-- Social Links -->
                <div class="absolute bottom-4 left-4 flex gap-2">
                  <Button
  v-for="social in member.social" :key="social.platform" 
                    variant="secondary" size="icon"
                    @click="window.open(social.url, '_blank')"
                  >
                    <component :is="social.icon" class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <!-- Info -->
              <div class="space-y-2">
                <h3 class="font-semibold text-lg">{{ member.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ member.role }}</p>
                <p class="text-sm">{{ member.bio }}</p>
            </div>
          </CardContent>

            <!-- Decorative corner gradient -->
            <div class="absolute right-0 top-0 -z-10 h-24 w-24 rounded-bl-full bg-primary/5 transition-all group-hover:scale-150" />
          </Card>
        </div>

        <!-- Join the Team CTA -->
        <div class="mt-16 text-center">
          <Card class="max-w-2xl mx-auto overflow-hidden">
            <CardContent class="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="text-left">
                <h3 class="text-xl font-semibold mb-2">Join our team</h3>
                <p class="text-muted-foreground">
                  We're always looking for talented people to join our mission.
                </p>
              </div>
              <Button size="lg" as-child>
                <NuxtLink to="/">
                  View Open Positions
                  <ArrowRight class="ml-2 h-4 w-4" />
                </NuxtLink>
            </Button>
            </CardContent>
        </Card>
        </div>
      </div>
    </FadeContent>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FadeContent from '@/components/Animations/FadeContent.vue'

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-founder',
    bio: 'Visionary leader with 15+ years of experience in tech. Previously led product at major tech companies.',
    image: 'https://i.pravatar.cc/400?img=9',
    social: [
      { platform: 'twitter', icon: Twitter, url: 'https://x.com/anton_andresen' },
      { platform: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/anton-andr%C3%A9sen-164703161/' }
    ]
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    bio: 'Tech innovator with a passion for building scalable solutions. 10+ years of engineering leadership.',
    image: 'https://i.pravatar.cc/400?img=11',
    social: [
      { platform: 'github', icon: Github, url: 'https://x.com/anton_andresen' },
      { platform: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/anton-andr%C3%A9sen-164703161/' }
    ]
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Design',
    bio: 'Award-winning designer focused on creating beautiful and intuitive user experiences.',
    image: 'https://i.pravatar.cc/400?img=10',
    social: [
      { platform: 'twitter', icon: Twitter, url: 'https://x.com/anton_andresen' },
      { platform: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/anton-andr%C3%A9sen-164703161/' }
    ]
  },
  {
    name: 'David Kim',
    role: 'Head of Product',
    bio: 'Product strategist with a track record of launching successful B2B solutions.',
    image: 'https://i.pravatar.cc/400?img=12',
    social: [
      { platform: 'twitter', icon: Twitter, url: 'https://x.com/anton_andresen' },
      { platform: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/anton-andr%C3%A9sen-164703161/' }
    ]
  },
  {
    name: 'Lisa Thompson',
    role: 'Head of Marketing',
    bio: 'Marketing expert specializing in growth strategies and brand development.',
    image: 'https://i.pravatar.cc/400?img=5',
    social: [
      { platform: 'twitter', icon: Twitter, url: 'https://x.com/anton_andresen' },
      { platform: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/anton-andr%C3%A9sen-164703161/' }
    ]
  },
  {
    name: 'James Wilson',
    role: 'Head of Sales',
    bio: 'Sales leader with expertise in building high-performing enterprise sales teams.',
    image: 'https://i.pravatar.cc/400?img=13',
    social: [
      { platform: 'twitter', icon: Twitter, url: 'https://x.com/anton_andresen' },
      { platform: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/anton-andr%C3%A9sen-164703161/' }
    ]
  }
]
</script>

<style scoped>
/* Styles for Team Section */
</style>