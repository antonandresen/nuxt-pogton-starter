<template>
  <article class="relative py-16 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 top-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    <div class="absolute left-1/4 bottom-1/4 w-1/2 aspect-square bg-secondary/5 rounded-full blur-3xl" />
    
    <div class="container max-w-4xl mx-auto px-4 sm:px-6 relative">
      <!-- Breadcrumbs -->
      <BlogBreadcrumbs title="Optimizing Nuxt 3 Performance" />

      <!-- Article Header -->
      <header class="text-center mb-16">
        <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar class="h-4 w-4" />
          <time>March 8, 2024</time>
          <span>•</span>
          <Clock class="h-4 w-4" />
          <span>10 min read</span>
        </div>
        
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Optimizing Nuxt 3 Performance
        </h1>
        
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn how to optimize your Nuxt 3 application for maximum performance, from initial load time to runtime optimization.
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
              <li v-for="(section, i) in sections" :key="i">
                <a :href="'#section-' + (i + 1)" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <span class="font-mono text-sm">{{ String(i + 1).padStart(2, '0') }}</span>
                  {{ section.title }}
                </a>
              </li>
            </ol>
          </nav>
        </CardContent>
      </Card>

      <!-- Article Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <section v-for="(section, i) in sections" :id="'section-' + (i + 1)" :key="i" class="mb-16">
          <Card class="overflow-hidden">
            <CardHeader>
              <CardTitle class="flex items-center gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {{ i + 1 }}
                </div>
                {{ section.title }}
              </CardTitle>
              <CardDescription>{{ section.description }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <p>{{ section.content }}</p>
              
              <!-- Code Example -->
              <div v-if="section.code" class="relative">
                <div class="absolute top-3 right-3 flex items-center gap-2">
                  <Button variant="ghost" size="icon" @click="copyCode(section.code)">
                    <Copy class="h-4 w-4" />
                  </Button>
                </div>
                <pre class="language-typescript"><code>{{ section.code }}</code></pre>
              </div>

              <!-- Pro Tip -->
              <Alert v-if="section.proTip" variant="default" class="mt-4">
                <Lightbulb class="h-4 w-4" />
                <AlertTitle>Pro Tip</AlertTitle>
                <AlertDescription>{{ section.proTip }}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        <!-- Author Bio -->
        <Card class="mt-16">
          <CardContent class="p-6">
            <div class="flex items-center gap-4">
              <Avatar class="h-12 w-12">
                <AvatarImage src="https://avatars.githubusercontent.com/u/17236766?v=4" />
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

const sections = [
  {
    title: 'Image Optimization',
    description: 'Optimize images for faster loading and better Core Web Vitals',
    content: 'Learn how to use Nuxt Image module to automatically optimize images, implement lazy loading, and serve the right image size for each device.',
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    provider: 'ipx',
    presets: {
      avatar: {
        modifiers: { format: 'webp', width: 80, height: 80 }
      },
      hero: {
        modifiers: { format: 'webp', quality: 80 }
      }
    },
    densities: [1, 2],
    format: ['webp', 'avif']
  }
})

// Usage in components
<nuxt-img
  src="/hero.jpg"
  preset="hero"
  width="1200"
  height="600"
  loading="lazy"
  placeholder
/>`,
    proTip: 'Use the blur placeholder feature for a better loading experience on hero images.'
  },
  {
    title: 'Code Splitting and Lazy Loading',
    description: 'Implement effective code splitting strategies',
    content: 'Optimize your bundle size by implementing smart code splitting and lazy loading components and routes.',
    code: `// Lazy load components
const HeavyChart = defineAsyncComponent(() => 
  import('@/components/HeavyChart.vue')
)

// Lazy load routes
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: true
  },
  routeRules: {
    '/blog/**': { swr: 3600 },
    '/admin/**': { ssr: false }
  }
})`,
    proTip: 'Use the Chrome DevTools Coverage tab to identify unused JavaScript and CSS.'
  },
  {
    title: 'Server-Side Optimizations',
    description: 'Optimize server-side rendering and caching',
    content: 'Implement server-side optimizations to improve Time to First Byte (TTFB) and overall rendering performance.',
    code: `// nitro.config.ts
export default defineNitroConfig({
  storage: {
    redis: {
      driver: 'redis',
      /* redis connector options */
    }
  },
  routeRules: {
    '/api/**': { cors: true, headers: { 'cache-control': 's-maxage=60' } }
  },
  prerender: {
    crawlLinks: true,
    routes: ['/sitemap.xml']
  },
  compressPublicAssets: true
})`,
    proTip: 'Use Redis for caching dynamic data and API responses.'
  },
  {
    title: 'Core Web Vitals Optimization',
    description: 'Improve Core Web Vitals metrics',
    content: 'Learn how to optimize Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).',
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preload', as: 'style', href: '/critical.css' }
      ]
    }
  },
  experimental: {
    inlineSSRStyles: false,
    viewTransition: true
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    }
  }
})`,
    proTip: 'Use size-limit in your CI pipeline to prevent bundle size regressions.'
  },
  {
    title: 'Runtime Performance',
    description: 'Optimize runtime performance and reactivity',
    content: 'Implement best practices for runtime performance, including efficient reactivity and state management.',
    code: `// Optimize large lists
const items = shallowRef([])
const visibleItems = computed(() => 
  items.value.slice(0, 50)
)

// Use v-once for static content
<template>
  <header v-once>
    <h1>{{ staticTitle }}</h1>
  </header>
  
  <!-- Use virtual scrolling for long lists -->
  <VirtualList
    :items="items"
    :height="400"
    :item-height="40"
  />
</template>`,
    proTip: 'Use the Vue DevTools Performance tab to identify expensive computations.'
  }
]

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
}
</script> 