<template>
  <section 
    id="team" 
    :class="[
      'py-16',
      background === 'muted' ? 'bg-accent' : 
      background === 'primary' ? 'bg-primary text-primary-foreground' : 
      'bg-background'
    ]"
  >
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">Meet Our Team</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <Card v-for="member in teamMembers" :key="member.name">
          <CardHeader>
            <Avatar class="w-24 h-24 mx-auto mb-4">
              <AvatarImage :src="member.photo" :alt="member.name" />
              <AvatarFallback>{{ member.initials }}</AvatarFallback>
            </Avatar>
            <CardTitle>{{ member.name }}</CardTitle>
            <CardDescription>{{ member.position }}</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ member.bio }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { SectionBackground } from '@/types/section'

defineProps<{
  background?: SectionBackground
}>()

const teamMembers = ref([
  {
    name: 'John Doe',
    position: 'CEO',
    photo: '/team/john.jpg',
    initials: 'JD',
    bio: 'Passionate about creating amazing products.',
  },
  {
    name: 'Jane Smith',
    position: 'CTO',
    photo: '/team/jane.jpg',
    initials: 'JS',
    bio: 'Leading the tech team with innovation.',
  },
  {
    name: 'Mike Johnson',
    position: 'COO',
    photo: '/team/mike.jpg',
    initials: 'MJ',
    bio: 'Ensuring smooth operations across the company.',
  },
])
</script>

<style scoped>
/* Styles for Team Section */
</style>