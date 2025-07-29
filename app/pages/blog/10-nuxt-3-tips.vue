<template>
  <article class="relative py-16 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 top-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    <div class="absolute left-1/4 bottom-1/4 w-1/2 aspect-square bg-secondary/5 rounded-full blur-3xl" />
    
    <div class="container max-w-4xl mx-auto px-4 sm:px-6 relative">
      <!-- Breadcrumbs -->
      <BlogBreadcrumbs title="10 Nuxt 4 Tips and Tricks for Better Development" />

      <!-- Article Header -->
      <header class="text-center mb-16">
        <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar class="h-4 w-4" />
          <time>March 12, 2024</time>
          <span>•</span>
          <Clock class="h-4 w-4" />
          <span>8 min read</span>
        </div>
        
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          10 Nuxt 4 Tips and Tricks for Better Development
        </h1>
        
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Level up your Nuxt 4 development with these powerful tips and tricks that will improve your workflow and application performance.
        </p>
      </header>

      <!-- Table of Contents -->
      <Card class="mb-12">
        <CardHeader>
          <CardTitle>Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <nav>
            <ol class="space-y-2">
              <li v-for="(tip, i) in tips" :key="i">
                <a :href="'#tip-' + (i + 1)" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <span class="font-mono text-sm">{{ String(i + 1).padStart(2, '0') }}</span>
                  {{ tip.title }}
                </a>
              </li>
            </ol>
          </nav>
        </CardContent>
      </Card>

      <!-- Article Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <section v-for="(tip, i) in tips" :id="'tip-' + (i + 1)" :key="i" class="mb-16">
          <Card class="overflow-hidden">
            <CardHeader>
              <CardTitle class="flex items-center gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {{ i + 1 }}
                </div>
                {{ tip.title }}
              </CardTitle>
              <CardDescription>{{ tip.description }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <p>{{ tip.content }}</p>
              
              <!-- Code Example -->
              <div v-if="tip.code" class="relative">
                <div class="absolute top-3 right-3 flex items-center gap-2">
                  <Button variant="ghost" size="icon" @click="copyCode(tip.code)">
                    <Copy class="h-4 w-4" />
                  </Button>
                </div>
                <pre class="language-typescript"><code>{{ tip.code }}</code></pre>
              </div>

              <!-- Pro Tip -->
              <Alert v-if="tip.proTip" variant="default" class="mt-4">
                <Lightbulb class="h-4 w-4" />
                <AlertTitle>Pro Tip</AlertTitle>
                <AlertDescription>{{ tip.proTip }}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        <!-- Author Bio -->
        <Card class="mt-16">
          <CardContent class="p-6">
            <div class="flex items-center gap-4">
              <Avatar class="h-12 w-12">
                <AvatarImage src="https://github.com/antonandresen.png" />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <div>
                <h3 class="font-semibold">Anton Andresen</h3>
                <p class="text-sm text-muted-foreground">Full Stack Developer & Nuxt Enthusiast</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Share Links -->
        <div class="flex justify-center gap-4 mt-8">
          <Button variant="outline" size="sm">
            <Twitter class="h-4 w-4 mr-2" />
            Share on Twitter
          </Button>
          <Button variant="outline" size="sm">
            <Linkedin class="h-4 w-4 mr-2" />
            Share on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Calendar, Clock, Copy, Lightbulb, Twitter, Linkedin } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import BlogBreadcrumbs from '@/components/BlogBreadcrumbs.vue'

// 🎯 SEO Configuration for Blog Article
const { initSEO } = useSEO({
  title: '10 Nuxt 4 Tips and Tricks for Better Development',
  description: 'Level up your Nuxt 4 development with these powerful tips and tricks that will improve your workflow and application performance.',
  type: 'article',
  image: '/img/blog/10-nuxt-3-tips.jpg',
  publishedTime: '2024-03-12T00:00:00Z',
  modifiedTime: '2024-03-12T00:00:00Z',
  section: 'Web Development',
  tags: ['Nuxt 4', 'Vue.js', 'JavaScript', 'Web Development', 'Frontend', 'Tips', 'Performance'],
  author: 'Anton Andresen'
})
initSEO()

// Article Schema with detailed information
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "10 Nuxt 4 Tips and Tricks for Better Development",
        "description": "Level up your Nuxt 4 development with these powerful tips and tricks that will improve your workflow and application performance.",
        "image": "https://nuxt-pogton-starter.netlify.app/img/blog/10-nuxt-3-tips.jpg",
        "author": {
          "@type": "Person",
          "name": "Anton Andresen",
          "url": "https://x.com/anton_andresen"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Pogton",
          "logo": {
            "@type": "ImageObject",
            "url": "https://nuxt-pogton-starter.netlify.app/logo.png"
          }
        },
        "datePublished": "2024-03-12T00:00:00Z",
        "dateModified": "2024-03-12T00:00:00Z",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://nuxt-pogton-starter.netlify.app/blog/10-nuxt-3-tips"
        },
        "wordCount": 1200,
        "timeRequired": "PT8M",
        "keywords": ["Nuxt 4", "Vue.js", "JavaScript", "Web Development", "Frontend", "Tips", "Performance"],
        "about": {
          "@type": "Thing",
          "name": "Nuxt 4 Development"
        }
      })
    }
  ]
})

const tips = [
  {
    title: 'Auto-imports for Composables',
    description: 'Leverage Nuxt 4 auto-import feature for cleaner code',
    content: 'Nuxt 4 automatically imports your composables from the composables/ directory. This means you can use them anywhere in your application without explicit imports.',
    code: `// composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return {
    count,
    increment,
    decrement
  }
}

// Use anywhere in your app
const { count, increment } = useCounter()`,
    proTip: 'Create an index.ts file in your composables directory to organize and export all your composables in one place.'
  },
  {
    title: 'Server Routes with Event Handling',
    description: 'Create powerful server routes with event handling',
    content: 'Nuxt 4 server routes can handle events and return different response types. You can use them to create powerful APIs directly in your Nuxt application.',
    code: `// server/api/events/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Handle different HTTP methods
  if (event.method === 'POST') {
    return { status: 'created', id }
  }
  
  return { status: 'success', id }
})`,
    proTip: 'Use server routes for sensitive operations and to reduce client-side bundle size.'
  },
  {
    title: 'Dynamic Page Metadata',
    description: 'Optimize SEO with dynamic page metadata',
    content: 'Use useHead composable to dynamically set page metadata for better SEO and social sharing.',
    code: `// pages/blog/[slug].vue
useHead({
  title: computed(() => post.value?.title),
  meta: [
    {
      name: 'description',
      content: computed(() => post.value?.description)
    },
    {
      property: 'og:image',
      content: computed(() => post.value?.image)
    }
  ]
})`,
    proTip: 'Create a reusable composable for common metadata patterns across your site.'
  },
  {
    title: 'Middleware Shortcuts',
    description: 'Use middleware shortcuts for quick route guards',
    content: 'Nuxt 4 provides a convenient shorthand for defining route middleware inline, perfect for simple auth checks.',
    code: `// pages/admin.vue
definePageMeta({
  middleware: auth => {
    if (!auth.isAuthenticated) {
      return navigateTo('/login')
    }
  }
})`,
    proTip: 'For complex auth logic, create a separate middleware file in the middleware/ directory.'
  },
  {
    title: 'State Management with useState',
    description: 'Efficient state management without external libraries',
    content: 'Use the built-in useState composable for persistent state management across components and pages.',
    code: `// composables/useAppState.ts
export const useAppState = () => useState('app', () => ({
  theme: 'light',
  sidebar: false,
  notifications: []
}))

// Use in components
const appState = useAppState()
appState.value.theme = 'dark'`,
    proTip: 'useState is SSR-friendly and automatically handles hydration.'
  },
  {
    title: 'Custom Plugins with Hooks',
    description: 'Extend Nuxt with custom plugins and hooks',
    content: 'Create plugins that hook into Nuxt\'s lifecycle for advanced functionality.',
    code: `// plugins/analytics.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    console.log('Page navigation complete')
  })
  
  return {
    provide: {
      analytics: {
        track: (event: string) => {
          // Track user events
        }
      }
    }
  }
})`,
    proTip: 'Use TypeScript for better type safety and autocompletion in plugins.'
  },
  {
    title: 'Lazy Loading Components',
    description: 'Improve initial load time with lazy loading',
    content: 'Use the lazy prefix to automatically lazy-load components only when they\'re needed.',
    code: `<!-- Lazy load heavy components -->
<template>
  <div>
    <LazyHeavyChart v-if="showChart" :data="chartData" />
  </div>
</template>`,
    proTip: 'Combine with v-if for conditional rendering to avoid unnecessary loads.'
  },
  {
    title: 'Runtime Config',
    description: 'Handle environment variables and runtime configuration',
    content: 'Use runtime config to safely expose environment variables to your application.',
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', // Server-only
    public: {
      apiBase: '' // Client & Server
    }
  }
})

// Access in components
const config = useRuntimeConfig()
const { data } = await useFetch(config.public.apiBase + '/posts')`,
    proTip: 'Use .env files for local development and proper environment variables in production.'
  },
  {
    title: 'Error Handling',
    description: 'Graceful error handling and custom error pages',
    content: 'Create custom error pages and handle errors gracefully throughout your application.',
    code: `// error.vue
const handleError = () => clearError({ redirect: '/' })

// Example usage in components
try {
  await someAsyncOperation()
} catch (error) {
  handleError()
}`,
    proTip: 'Use try-catch in async operations and provide meaningful error messages.'
  },
  {
    title: 'Asset Handling',
    description: 'Optimize asset loading and management',
    content: 'Use Nuxt\'s built-in asset handling features for optimized images and other static assets.',
    code: `// Automatic image optimization
<template>
  <nuxt-img
    src="/hero.jpg"
    sizes="sm:100vw md:50vw lg:400px"
    format="webp"
    loading="lazy"
    placeholder
  />
</template>`,
    proTip: 'Use the nuxt-image module for advanced image optimization features.'
  }
]

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
}
</script>

<style>
/* Add any custom styles here */
</style> 
