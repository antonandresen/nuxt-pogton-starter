<template>
  <main>
    <!-- Hero Section -->
    <section class="relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div class="container mx-auto px-4 py-24">
        <div class="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="outline" class="animate-fade-in">About Us</Badge>
          <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl animate-slide-up">
            Building the Future of Web Development
          </h1>
          <p class="text-muted-foreground text-lg sm:text-xl max-w-2xl animate-slide-up-delayed">
            We're a team of passionate developers, designers, and creators dedicated to making web development more accessible and enjoyable.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-accent">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card v-for="stat in stats" :key="stat.label" class="text-center animate-fade-in">
            <CardHeader>
              <CardTitle class="text-4xl font-bold text-primary">{{ stat.value }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">{{ stat.label }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-24">
      <div class="container mx-auto px-4">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 md:p-12">
          <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10" />
          <div class="relative max-w-3xl mx-auto text-center space-y-8">
            <Badge variant="outline">Our Mission</Badge>
            <h2 class="text-3xl font-bold tracking-tighter md:text-4xl">
              Empowering Developers to Build Better
            </h2>
            <div class="space-y-4 text-muted-foreground">
              <p>
                Our mission is to provide developers with the tools and resources they need to create exceptional web experiences.
              </p>
              <p>
                We believe in open source, community collaboration, and making advanced development techniques accessible to everyone.
              </p>
            </div>
            <div class="pt-4">
              <Button>
                Learn More
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-24 bg-accent">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" class="mb-4">Our Values</Badge>
          <h2 class="text-4xl font-bold tracking-tight mb-4">What We Stand For</h2>
          <p class="text-muted-foreground text-lg">Our core values drive everything we do</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <HoverCard v-for="value in values" :key="value.title">
            <HoverCardTrigger>
              <Card class="overflow-hidden transition-all hover:shadow-lg flex flex-col">
                <CardHeader>
                  <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <component :is="value.icon" class="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle class="text-xl mb-2">{{ value.title }}</CardTitle>
                </CardHeader>
                <CardContent class="flex-grow">
                  <p class="text-muted-foreground leading-relaxed">{{ value.description }}</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent class="w-80">
              <div class="space-y-2">
                <h4 class="text-sm font-semibold">{{ value.title }}</h4>
                <p class="text-sm text-muted-foreground">
                  {{ value.extendedDescription || value.description }}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <TeamSection />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Lightbulb, Users, Lock, Rocket, Code } from 'lucide-vue-next'
import TeamSection from '~/components/sections/TeamSection.vue'

// 🎯 SEO Configuration
const { initSEO } = useSEO({
  title: 'About Us - Building the Future of Web Development',
  description: 'Learn about our mission to make web development more accessible and enjoyable. Meet our team of passionate developers, designers, and creators.',
  type: 'website',
  image: '/img/team/team-photo.jpg'
})
initSEO()

// Organization Schema
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Pogton",
        "description": "Building the Future of Web Development",
        "url": "https://nuxt-pogton-starter.netlify.app/about",
        "logo": "https://nuxt-pogton-starter.netlify.app/logo.png",
        "foundingDate": "2024",
        "founders": [
          {
            "@type": "Person",
            "name": "Anton Andresen",
            "jobTitle": "Founder & Lead Developer"
          }
        ],
        "sameAs": [
          "https://x.com/anton_andresen"
        ]
      })
    }
  ]
})

const stats = ref([
  { value: '10K+', label: 'Active Users' },
  { value: '50+', label: 'Team Members' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
])

const values = ref([
  {
    icon: Heart,
    title: 'User-First',
    description: 'Everything we build is focused on providing the best possible user experience.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly push boundaries and explore new technologies.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in the power of community and collaborative development.'
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Security is at the core of everything we build and maintain.'
  },
  {
    icon: Rocket,
    title: 'Performance',
    description: 'We optimize for speed without compromising on quality.'
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'We contribute to and support open source development.'
  },
])
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

.animate-slide-up-delayed {
  animation: slideUp 0.5s ease-out 0.2s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.bg-grid-black {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>