<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p class="text-muted-foreground">Welcome back to your dashboard</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Projects</CardTitle>
          <Folder class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.projects }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newProjects }} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Subscription Status</CardTitle>
          <CreditCard class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.plan }}</div>
          <p class="text-xs text-muted-foreground">
            Next billing: {{ stats.nextBilling }}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Usage</CardTitle>
          <Activity class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.usage }}%</div>
          <p class="text-xs text-muted-foreground">
            Of your monthly limit
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center">
            <div class="flex h-9 w-9 items-center justify-center rounded-full border">
              <component :is="activity.icon" class="h-4 w-4" />
            </div>
            <div class="ml-4 space-y-1">
              <p class="text-sm font-medium leading-none">{{ activity.title }}</p>
              <p class="text-sm text-muted-foreground">
                {{ activity.description }}
              </p>
            </div>
            <div class="ml-auto text-sm text-muted-foreground">
              {{ formatTimeAgo(activity.timestamp) }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Folder, CreditCard, Activity } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

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
  }
])

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