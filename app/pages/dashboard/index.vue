<template>
  <div class="min-h-screen -m-6 bg-gradient-to-br from-background via-background to-muted/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Welcome Header -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Welcome back!</h1>
              <p class="text-muted-foreground">Here's what's happening with your account</p>
            </div>
          </div>
        </div>
        <!-- Decorative gradient -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Active Projects -->
        <Card class="border-none shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Folder class="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <Badge variant="secondary" class="text-xs">+{{ stats.newProjects }}</Badge>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Active Projects</p>
              <p class="text-3xl font-bold tracking-tight">{{ stats.projects }}</p>
              <p class="text-xs text-muted-foreground">+{{ stats.newProjects }} this month</p>
            </div>
          </CardContent>
        </Card>

        <!-- Subscription -->
        <Card class="border-none shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CreditCard class="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <Badge variant="outline" class="text-xs text-emerald-600 border-emerald-600/50">Active</Badge>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Subscription</p>
              <p class="text-3xl font-bold tracking-tight">{{ stats.plan }}</p>
              <p class="text-xs text-muted-foreground">Renews {{ stats.nextBilling }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Usage -->
        <Card class="border-none shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Activity class="h-6 w-6 text-violet-600 dark:text-violet-500" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted-foreground">Usage</p>
              <p class="text-3xl font-bold tracking-tight">{{ stats.usage }}%</p>
              <div class="mt-2">
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-500"
                    :style="{ width: `${stats.usage}%` }"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Action -->
        <Card class="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer group">
          <CardContent class="p-6 h-full flex flex-col justify-between">
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap class="h-6 w-6 text-primary" />
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium">Quick Actions</p>
              <p class="text-xs text-muted-foreground">Get things done faster</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Recent Activity -->
        <Card class="lg:col-span-2 border-none shadow-sm">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-xl">Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" class="text-xs">
                View all
                <ArrowRight class="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform">
                <component :is="activity.icon" class="h-5 w-5 text-primary" />
              </div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">{{ activity.title }}</p>
                <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
              </div>
              <div class="text-xs text-muted-foreground whitespace-nowrap">
                {{ formatTimeAgo(activity.timestamp) }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Links -->
        <Card class="border-none shadow-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-xl">Quick Links</CardTitle>
            <CardDescription>Access important features</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <NuxtLink 
              v-for="link in quickLinks" 
              :key="link.title"
              :to="link.href"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <component :is="link.icon" class="h-4 w-4" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ link.title }}</p>
                <p class="text-xs text-muted-foreground">{{ link.description }}</p>
              </div>
              <ArrowRight class="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Folder, 
  CreditCard, 
  Activity, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Settings,
  ShoppingCart,
  FileText,
  HelpCircle
} from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api, useConvexQuery } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: undefined
})

const { initSEO } = useSEO({
  title: 'Dashboard',
  description: 'Overview of your account activity and stats.',
  noindex: true
})

initSEO()

// Fetch app settings for feature flags
const { data: appSettings } = useConvexQuery(api.appSettings.getPublic, {})
const shopEnabled = computed(() => appSettings.value?.shopEnabled ?? true)

// Example stats data - replace with real data fetching
const stats = ref({
  projects: 5,
  newProjects: 2,
  plan: 'Pro Plan',
  nextBilling: '2024-04-01',
  usage: 45
})

// Example activity data - replace with real data
const recentActivity = ref([
  {
    id: 1,
    icon: Folder,
    title: 'New Project Created',
    description: 'You created "My Awesome Project"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    icon: CreditCard,
    title: 'Subscription Renewed',
    description: 'Your Pro Plan subscription was renewed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    id: 3,
    icon: Settings,
    title: 'Settings Updated',
    description: 'You updated your account settings',
    timestamp: new Date(Date.now() - 1000 * 60 * 120)
  }
])

// Quick links - computed to filter based on enabled features
const quickLinks = computed(() => {
  const links = [
    {
      title: 'Settings',
      description: 'Manage your account',
      icon: Settings,
      href: '/dashboard/settings'
    },
    {
      title: 'Subscription',
      description: 'Manage billing',
      icon: CreditCard,
      href: '/dashboard/subscription'
    },
    {
      title: 'Documentation',
      description: 'Learn more',
      icon: FileText,
      href: '/docs'
    }
  ]
  
  // Add shop link if enabled
  if (shopEnabled.value) {
    links.splice(1, 0, {
      title: 'Shop',
      description: 'Browse products',
      icon: ShoppingCart,
      href: '/dashboard/shop'
    })
  }
  
  return links
})

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }
}
</script>