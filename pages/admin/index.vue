<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Admin Overview</h2>
      <p class="text-muted-foreground">Monitor your application's key metrics</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Users</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalUsers }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newUsersToday }} today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Subscriptions</CardTitle>
          <CreditCard class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.activeSubscriptions }}</div>
          <p class="text-xs text-muted-foreground">
            {{ stats.subscriptionRate }}% subscription rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(stats.monthlyRevenue) }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ formatCurrency(stats.revenueIncrease) }} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Now</CardTitle>
          <Activity class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.activeNow }}</div>
          <p class="text-xs text-muted-foreground">
            {{ stats.activeNowChange }}% from average
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the platform</CardDescription>
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
import { Users, CreditCard, DollarSign, Activity, UserPlus, CreditCard as CreditCardIcon, Settings } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin']
})

// Example stats data - replace with real data fetching
const stats = ref({
  totalUsers: 1234,
  newUsersToday: 12,
  activeSubscriptions: 789,
  subscriptionRate: 64,
  monthlyRevenue: 12345.67,
  revenueIncrease: 1234.56,
  activeNow: 123,
  activeNowChange: 14
})

// Example recent activity - replace with real data
const recentActivity = ref([
  {
    id: 1,
    icon: UserPlus,
    title: 'New User Registration',
    description: 'john.doe@example.com registered an account',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: 2,
    icon: CreditCardIcon,
    title: 'New Subscription',
    description: 'jane.smith@example.com subscribed to Pro plan',
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: 3,
    icon: Settings,
    title: 'Settings Updated',
    description: 'System settings were updated by admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  }
])

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format time ago
const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return Math.floor(seconds) + ' seconds ago'
}
</script> 