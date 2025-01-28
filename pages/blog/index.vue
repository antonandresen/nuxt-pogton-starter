<template>
  <div class="relative py-16 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 top-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    <div class="absolute left-1/4 bottom-1/4 w-1/2 aspect-square bg-secondary/5 rounded-full blur-3xl" />
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Header -->
      <header class="text-center mb-16">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Blog & Resources
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover tips, tutorials, and insights about Nuxt development and web technologies.
        </p>
      </header>

      <!-- Categories -->
      <div class="flex flex-wrap justify-center gap-2 mb-12">
        <Button 
          v-for="category in categories" 
          :key="category.id"
          :variant="selectedCategory === category.id ? 'default' : 'outline'"
          @click="selectedCategory = category.id"
        >
          <component :is="category.icon" class="h-4 w-4 mr-2" />
          {{ category.name }}
        </Button>
      </div>

      <!-- Featured Post -->
      <Card class="mb-16 group hover:shadow-lg transition-all">
        <CardContent class="p-0">
          <div class="grid lg:grid-cols-2">
            <!-- Image -->
            <div class="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
              <img 
                :src="featuredPost.image" 
                :alt="featuredPost.title"
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              >
              <Badge class="absolute top-4 left-4" variant="default">Featured</Badge>
            </div>
            <!-- Content -->
            <div class="p-8 lg:p-12 flex flex-col justify-center">
              <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar class="h-4 w-4" />
                <time>{{ featuredPost.date }}</time>
                <span>•</span>
                <Clock class="h-4 w-4" />
                <span>{{ featuredPost.readTime }} read</span>
              </div>
              <h2 class="text-2xl font-bold mb-4">{{ featuredPost.title }}</h2>
              <p class="text-muted-foreground mb-6">{{ featuredPost.excerpt }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="featuredPost.author.avatar" />
                    <AvatarFallback>{{ featuredPost.author.initials }}</AvatarFallback>
                  </Avatar>
                  <span class="text-sm font-medium">{{ featuredPost.author.name }}</span>
                </div>
                <Button as-child>
                  <NuxtLink :to="featuredPost.slug">
                    Read More
                    <ArrowRight class="h-4 w-4 ml-2" />
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Posts Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="post in filteredPosts" :key="post.slug" class="group hover:shadow-lg transition-all">
          <CardContent class="p-0 flex flex-col h-full">
            <!-- Image -->
            <div class="relative aspect-[16/9] overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              >
              <Badge 
                class="absolute top-4 left-4" 
                :variant="post.category.variant"
              >
                {{ post.category.name }}
              </Badge>
            </div>
            <!-- Content -->
            <div class="p-6 flex flex-col flex-grow">
              <div class="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar class="h-4 w-4" />
                <time>{{ post.date }}</time>
                <span>•</span>
                <Clock class="h-4 w-4" />
                <span>{{ post.readTime }} read</span>
              </div>
              <h3 class="text-xl font-semibold mb-3">{{ post.title }}</h3>
              <p class="text-muted-foreground text-sm mb-4 flex-grow">{{ post.excerpt }}</p>
              <div class="flex items-center justify-between pt-4 border-t mt-auto">
                <div class="flex items-center gap-2">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="post.author.avatar" />
                    <AvatarFallback>{{ post.author.initials }}</AvatarFallback>
                  </Avatar>
                  <span class="text-sm font-medium">{{ post.author.name }}</span>
                </div>
                <Button variant="ghost" size="sm" as-child>
                  <NuxtLink :to="post.slug">Read More</NuxtLink>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Load More -->
      <div v-if="hasMorePosts" class="mt-12 text-center">
        <Button variant="outline" size="lg" @click="loadMorePosts">
          Load More Posts
          <ChevronDown class="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, ArrowRight, ChevronDown, Code, Book, Lightbulb, Zap } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const selectedCategory = ref('all')
const page = ref(1)
const postsPerPage = 6

const categories = [
  { id: 'all', name: 'All Posts', icon: Book },
  { id: 'tutorials', name: 'Tutorials', icon: Code },
  { id: 'tips', name: 'Tips & Tricks', icon: Lightbulb },
  { id: 'performance', name: 'Performance', icon: Zap }
]

const featuredPost = {
  title: '10 Nuxt 3 Tips and Tricks for Better Development',
  slug: '/blog/10-nuxt-3-tips',
  excerpt: 'Level up your Nuxt 3 development with these powerful tips and tricks that will improve your workflow and application performance.',
  date: 'March 12, 2024',
  readTime: '8 min',
  image: 'img/blog/10-nuxt-3-tips.jpg',
  author: {
    name: 'Anton Andresen',
    avatar: 'https://github.com/antonandresen.png',
    initials: 'AA'
  }
}

const allPosts = [
  {
    title: '10 Nuxt 3 Tips and Tricks for Better Development',
    slug: '/blog/10-nuxt-3-tips',
    excerpt: 'Level up your Nuxt 3 development with these powerful tips and tricks.',
    date: 'March 12, 2024',
    readTime: '8 min',
    image: 'img/blog/10-nuxt-3-tips.jpg',
    category: { name: 'Tips & Tricks', id: 'tips', variant: 'secondary' as const },
    author: {
      name: 'Anton Andresen',
      avatar: 'https://github.com/antonandresen.png',
      initials: 'AA'
    }
  },
  {
    title: 'Building a Modern Blog with Nuxt 3',
    slug: '/blog/modern-blog-nuxt-3',
    excerpt: 'Create a beautiful and performant blog using Nuxt 3 and modern tools.',
    date: 'March 10, 2024',
    readTime: '12 min',
    image: 'img/blog/modern-blog-nuxt-3.jpg',
    category: { name: 'Tutorials', id: 'tutorials', variant: 'default' as const },
    author: {
      name: 'Anton Andresen',
      avatar: 'https://github.com/antonandresen.png',
      initials: 'AA'
    }
  },
  {
    title: 'Optimizing Nuxt 3 Performance',
    slug: '/blog/nuxt-3-performance',
    excerpt: 'Learn how to optimize your Nuxt 3 application for maximum performance.',
    date: 'March 8, 2024',
    readTime: '10 min',
    image: 'img/blog/nuxt-3-performance.jpg',
    category: { name: 'Performance', id: 'performance', variant: 'outline' as const },
    author: {
      name: 'Anton Andresen',
      avatar: 'https://github.com/antonandresen.png',
      initials: 'AA'
    }
  }
]

const filteredPosts = computed(() => {
  let posts = allPosts
  if (selectedCategory.value !== 'all') {
    posts = posts.filter(post => post.category.id === selectedCategory.value)
  }
  return posts.slice(0, page.value * postsPerPage)
})

const hasMorePosts = computed(() => {
  const filteredLength = selectedCategory.value === 'all' 
    ? allPosts.length 
    : allPosts.filter(post => post.category.id === selectedCategory.value).length
  return filteredLength > page.value * postsPerPage
})

const loadMorePosts = () => {
  page.value++
}
</script> 
