<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative">
        <Bell class="h-5 w-5" />
        <span v-if="unreadCount > 0" class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-80">
      <div class="flex items-center justify-between px-2 py-1.5">
        <span class="text-sm font-semibold">Notifications</span>
        <Button
          v-if="unreadCount > 0"
          variant="ghost"
          size="sm"
          class="h-7 px-2 text-xs"
          @click="handleMarkAllRead"
        >
          Mark all read
        </Button>
      </div>
      <DropdownMenuSeparator />
      <div class="max-h-[400px] overflow-y-auto">
        <div v-if="!notifications?.length" class="px-4 py-8 text-center text-sm text-muted-foreground">
          No notifications yet
        </div>
        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification._id"
            class="relative cursor-pointer border-b px-4 py-3 transition hover:bg-muted"
            :class="{ 'bg-primary/5': !notification.readAt }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <div
                class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                :class="getNotificationIconClass(notification.type)"
              >
                <component :is="getNotificationIcon(notification.type)" class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-medium">{{ notification.title }}</p>
                  <span v-if="!notification.readAt" class="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                </div>
                <p class="text-sm text-muted-foreground">{{ notification.body }}</p>
                <p class="text-xs text-muted-foreground">{{ formatRelativeTime(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DropdownMenuSeparator v-if="notifications?.length" />
      <div v-if="notifications?.length" class="p-2">
        <Button variant="ghost" size="sm" class="w-full" as-child>
          <NuxtLink to="/dashboard/notifications">View all notifications</NuxtLink>
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Bell, Mail, UserPlus, AlertCircle, CheckCircle, Info } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { api, useConvexQuery, useConvexMutation } from '@/composables/useConvex'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const { data: notifications } = useConvexQuery(api.notifications.listForCurrentUser, { limit: 20 })
const markReadMutation = useConvexMutation(api.notifications.markReadForCurrentUser)
const markAllReadMutation = useConvexMutation(api.notifications.markAllReadForCurrentUser)

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

const handleNotificationClick = async (notification: any) => {
  if (!notification.readAt) {
    try {
      await markReadMutation.mutate({ id: notification._id })
    } catch (error) {
      // Silently fail - not critical
    }
  }

  // Handle navigation based on notification type and metadata
  if (notification.type === 'invite' && notification.metadata?.token) {
    await navigateTo(`/invite/${notification.metadata.token}`)
  } else if (notification.metadata?.link) {
    await navigateTo(notification.metadata.link)
  }
}

const handleMarkAllRead = async () => {
  try {
    await markAllReadMutation.mutate({})
    toast({ title: 'All notifications marked as read' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to mark notifications as read.', variant: 'destructive' })
  }
}

const formatRelativeTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}
</script>
