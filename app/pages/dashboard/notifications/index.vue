<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Notifications</h2>
        <p class="text-muted-foreground">Stay updated with your workspace activity</p>
      </div>
      <Button
        v-if="unreadCount > 0"
        variant="outline"
        @click="handleMarkAllRead"
        :disabled="isMarkingAllRead"
      >
        <Loader2 v-if="isMarkingAllRead" class="mr-2 h-4 w-4 animate-spin" />
        Mark all as read
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Notifications</CardTitle>
        <CardDescription>
          {{ unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No unread notifications' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!notifications?.length" class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No notifications yet
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification._id"
            class="flex items-start gap-4 rounded-lg border p-4 transition hover:bg-muted"
            :class="{ 'bg-primary/5 border-primary/20': !notification.readAt }"
          >
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              :class="getNotificationIconClass(notification.type)"
            >
              <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex items-start justify-between gap-2">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="font-medium">{{ notification.title }}</p>
                    <Badge v-if="!notification.readAt" variant="default" class="h-5">New</Badge>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ notification.body }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ formatDate(notification.createdAt) }}
                  </p>
                </div>
              </div>
              <div v-if="getNotificationAction(notification)" class="flex gap-2">
                <Button
                  size="sm"
                  @click="handleNotificationAction(notification)"
                >
                  {{ getNotificationAction(notification) }}
                </Button>
                <Button
                  v-if="!notification.readAt"
                  size="sm"
                  variant="outline"
                  @click="handleMarkRead(notification._id)"
                >
                  Mark as read
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Mail, UserPlus, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/use-toast'
import { api, useConvexQuery, useConvexMutation } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Notifications',
})

const { initSEO } = useSEO({
  title: 'Notifications',
  description: 'View all your notifications.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { data: notifications } = useConvexQuery(api.notifications.listForCurrentUser, { limit: 100 })
const markReadMutation = useConvexMutation(api.notifications.markReadForCurrentUser)
const markAllReadMutation = useConvexMutation(api.notifications.markAllReadForCurrentUser)

const isMarkingAllRead = ref(false)

const unreadCount = computed(() => {
  return notifications.value?.filter((n: any) => !n.readAt).length ?? 0
})

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'invite':
      return UserPlus
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'info':
      return Info
    default:
      return Mail
  }
}

const getNotificationIconClass = (type: string) => {
  switch (type) {
    case 'invite':
      return 'bg-blue-500/10 text-blue-500'
    case 'success':
      return 'bg-green-500/10 text-green-500'
    case 'error':
      return 'bg-red-500/10 text-red-500'
    case 'info':
      return 'bg-yellow-500/10 text-yellow-500'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getNotificationAction = (notification: any) => {
  if (notification.type === 'invite' && notification.metadata?.token) {
    return 'View Invitation'
  }
  if (notification.metadata?.link) {
    return 'View'
  }
  return null
}

const handleNotificationAction = async (notification: any) => {
  if (notification.type === 'invite' && notification.metadata?.token) {
    await navigateTo(`/invite/${notification.metadata.token}`)
  } else if (notification.metadata?.link) {
    await navigateTo(notification.metadata.link)
  }
}

const handleMarkRead = async (id: string) => {
  try {
    await markReadMutation.mutate({ id: id as any })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to mark notification as read.', variant: 'destructive' })
  }
}

const handleMarkAllRead = async () => {
  isMarkingAllRead.value = true
  try {
    await markAllReadMutation.mutate({})
    toast({ title: 'All notifications marked as read' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to mark notifications as read.', variant: 'destructive' })
  } finally {
    isMarkingAllRead.value = false
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}
