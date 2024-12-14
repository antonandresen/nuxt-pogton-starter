<template>
  <Section
    id="team"
    :background="background"
    badge="Our Team"
    title="Meet the experts"
    subtitle="Dedicated professionals working to bring you the best"
  >
    <div class="grid md:grid-cols-3 gap-8">
      <Card 
        v-for="member in teamMembers" 
        :key="member.name"
        class="group overflow-hidden transition-all hover:shadow-lg"
      >
        <CardHeader class="text-center">
          <div class="relative w-32 h-32 mx-auto mb-4">
            <Avatar class="w-full h-full">
              <AvatarImage 
                :src="member.photo" 
                :alt="member.name"
                class="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <AvatarFallback>{{ member.initials }}</AvatarFallback>
            </Avatar>
            <div class="absolute inset-0 rounded-full ring-2 ring-primary/20" />
          </div>
          <CardTitle class="mb-1">{{ member.name }}</CardTitle>
          <CardDescription class="text-primary font-medium">
            {{ member.position }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-center text-muted-foreground">{{ member.bio }}</p>
        </CardContent>
        <CardFooter class="justify-center space-x-4">
          <Button variant="ghost" size="icon">
            <LinkedinIcon class="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <TwitterIcon class="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <GithubIcon class="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  </Section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Section from '@/components/sections/Section.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkedinIcon, TwitterIcon, GithubIcon } from 'lucide-vue-next'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const teamMembers = ref([
  {
    name: 'Hannah Smith',
    position: 'CEO & Founder',
    photo: '/img/team/hannah.png',
    initials: 'HS',
    bio: 'Visionary leader with 15+ years of experience in tech innovation.',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Mike Wilson',
    position: 'CTO',
    photo: '/img/team/mike.png',
    initials: 'MW',
    bio: 'Tech enthusiast driving our engineering excellence forward.',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Jane Cooper',
    position: 'Head of Design',
    photo: '/img/team/jane.png',
    initials: 'JC',
    bio: 'Creative mind behind our beautiful user experiences.',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  }
])
</script>

<style scoped>
/* Styles for Team Section */
</style>