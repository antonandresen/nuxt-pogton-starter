<template>
  <article class="relative py-16 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-1/4 top-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-3xl" />
    <div class="absolute left-1/4 bottom-1/4 w-1/2 aspect-square bg-secondary/5 rounded-full blur-3xl" />
    
    <div class="container max-w-4xl mx-auto px-4 sm:px-6 relative">
      <!-- Breadcrumbs -->
      <BlogBreadcrumbs title="Building a Modern Blog with Nuxt 3" />

      <!-- Article Header -->
      <header class="text-center mb-16">
        <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar class="h-4 w-4" />
          <time>March 10, 2024</time>
          <span>•</span>
          <Clock class="h-4 w-4" />
          <span>12 min read</span>
        </div>
        
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Building a Modern Blog with Nuxt 3
        </h1>
        
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create a beautiful, performant, and SEO-friendly blog using Nuxt 3, TailwindCSS, and modern web development practices.
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

const sections = [
  {
    title: 'Project Setup and Configuration',
    description: 'Setting up a new Nuxt 3 project with essential dependencies',
    content: 'Lets start by creating a new Nuxt 3 project and configuring it with the necessary dependencies for building a modern blog.',
    code: `npx nuxi init modern-blog
cd modern-blog

# Install dependencies
npm install @nuxtjs/tailwindcss @nuxtjs/color-mode
npm install @tailwindcss/typography

# Configure nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  }
})`,
    proTip: 'Use pnpm instead of npm for faster installation and better disk space usage.'
  },
  {
    title: 'Content Management with Nuxt Content',
    description: 'Implementing a Git-based content management system',
    content: 'Nuxt Content v2 provides a powerful Git-based CMS that allows you to write your blog posts in Markdown with front matter.',
    code: `# Install Nuxt Content
npm install @nuxt/content

# Create your first blog post
# content/blog/hello-world.md
---
title: Hello World
description: My first blog post
date: 2024-03-10
---

# Hello World

Welcome to my blog!`,
    proTip: 'Use VS Code with the Front Matter CMS extension for a better writing experience.'
  },
  {
    title: 'Dynamic Routes and Pagination',
    description: 'Creating dynamic blog post routes with pagination',
    content: 'Set up dynamic routing for blog posts and implement pagination for the blog listing page.',
    code: `// pages/blog/[...slug].vue
const { data: post } = await useAsyncData('post',
  () => queryContent('blog')
    .where({ slug: route.params.slug })
    .findOne()
)

// pages/blog/page/[page].vue
const page = computed(() => parseInt(route.params.page as string) || 1)
const { data: posts } = await useAsyncData('posts',
  () => queryContent('blog')
    .sort({ date: -1 })
    .skip((page.value - 1) * 10)
    .limit(10)
    .find()
)`,
    proTip: 'Implement infinite scroll instead of pagination for a better mobile experience.'
  },
  {
    title: 'SEO and Meta Tags',
    description: 'Optimizing your blog for search engines',
    content: 'Implement proper SEO meta tags and social sharing cards for your blog posts.',
    code: `// composables/useBlogMeta.ts
export const useBlogMeta = (post) => {
  useHead({
    title: post.title,
    meta: [
      { name: 'description', content: post.description },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.description },
      { property: 'og:image', content: post.image },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  })
}`,
    proTip: 'Generate social media preview images automatically using @nuxt/image and templates.'
  },
  {
    title: 'Search and Categories',
    description: 'Adding search functionality and category filtering',
    content: 'Implement client-side search and category filtering for your blog posts.',
    code: `// composables/useSearch.ts
export const useSearch = () => {
  const searchQuery = ref('')
  const selectedCategory = ref('all')
  
  const filteredPosts = computed(() => {
    let results = posts.value
    
    if (searchQuery.value) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    if (selectedCategory.value !== 'all') {
      results = results.filter(post => 
        post.category === selectedCategory.value
      )
    }
    
    return results
  })
  
  return {
    searchQuery,
    selectedCategory,
    filteredPosts
  }
}`,
    proTip: 'Use debounce on the search input to improve performance with large datasets.'
  },
  {
    title: 'Syntax Highlighting and MDX',
    description: 'Adding code syntax highlighting and MDX support',
    content: 'Enhance your blog posts with syntax highlighting for code blocks and MDX for interactive components.',
    code: `// Install required packages
npm install @nuxt/content @nuxtjs/color-mode shiki

// nuxt.config.ts
export default defineNuxtConfig({
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      }
    }
  }
})`,
    proTip: 'Create custom MDX components for common blog elements like callouts and info boxes.'
  },
  {
    title: 'Add Comments Section',
    description: 'Enable user engagement with a comments section.',
    content: 'Implement a comment system and social sharing buttons for your blog posts.',
    code: `// components/Comments.vue
<script setup>
const { data: comments } = await useAsyncData('comments',
  () => $fetch('/api/comments/' + props.postId)
)

const addComment = async (content) => {
  await $fetch('/api/comments/' + props.postId, {
    method: 'POST',
    body: { content }
  })
  
  // Refresh comments
  await refresh()
}
<script>`,
    proTip: 'Consider using Giscus for GitHub Discussions-based comments.'
  },
  {
    title: 'RSS Feed and Sitemap',
    description: 'Generating RSS feed and sitemap',
    content: 'Add RSS feed and sitemap generation for better discoverability.',
    code: `// nuxt.config.ts
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

export default defineNuxtConfig({
  hooks: {
    'build:done': async () => {
      const posts = await queryContent('blog').find()
      const stream = new SitemapStream({ hostname: 'https://yourblog.com' })
      
      posts.forEach(post => {
        stream.write({
          url: \`/blog/\${post.slug}\`,
          lastmod: post.updatedAt
        })
      })
      
      stream.end()
      const sitemap = await streamToPromise(Readable.from(stream))
      await writeFile('public/sitemap.xml', sitemap)
    }
  }
})`,
    proTip: 'Use the feed module to automatically generate RSS and Atom feeds.'
  },
  {
    title: 'Performance Optimization',
    description: 'Optimizing your Nuxt 3 application for maximum performance',
    content: 'Implement key performance optimizations to ensure your Nuxt 3 blog loads quickly and runs smoothly.',
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: true,
    inlineSSRStyles: false
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml'],
      crawlLinks: true
    },
    compressPublicAssets: true
  },
  image: {
    provider: 'ipx',
    presets: {
      blog: {
        modifiers: {
          format: 'webp',
          quality: 80,
          loading: 'lazy'
        }
      }
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }
      ]
    }
  }
})`,
    proTip: 'Use Lighthouse CI to monitor performance metrics in your CI/CD pipeline and set performance budgets.'
  }
]

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
}
</script> 
