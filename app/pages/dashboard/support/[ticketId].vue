<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink to="/dashboard/support">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </NuxtLink>
      </Button>
      <div class="flex-1">
        <h2 class="text-2xl font-bold">{{ data?.ticket.subject }}</h2>
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <span class="capitalize">{{ data?.ticket.status.replace('_', ' ') }}</span>
          <span>•</span>
          <span class="capitalize">{{ data?.ticket.priority }} priority</span>
          <span>•</span>
          <span>Created {{ formatDate(data?.ticket.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <Card class="min-h-[500px] flex flex-col">
      <CardContent class="flex-1 p-6">
        <div v-if="!data?.messages.length" class="flex items-center justify-center h-[400px] text-muted-foreground">
          No messages yet.
        </div>
        <div v-else class="space-y-4" ref="messagesContainer">
          <div
            v-for="message in data.messages"
            :key="message._id"
            class="flex gap-3"
            :class="{ 'justify-end': message.author?._id === currentUserId }"
          >
            <div
              class="max-w-[70%] rounded-lg p-4"
              :class="
                message.author?._id === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              "
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium">
                  {{ message.author?.name || message.author?.email || 'Unknown' }}
                </span>
                <span v-if="message.isInternal" class="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">
                  Internal
                </span>
              </div>
              <div class="text-sm whitespace-pre-wrap">{{ message.body }}</div>
              <div class="text-xs opacity-70 mt-2">
                {{ formatMessageTime(message.createdAt) }}
                <span v-if="message.editedAt">(edited)</span>
              </div>
              <div v-if="message.attachments?.length" class="mt-2 space-y-1">
                <a
                  v-for="(attachment, idx) in message.attachments"
                  :key="idx"
                  :href="attachment.url"
                  target="_blank"
                  class="flex items-center gap-2 text-xs underline"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {{ attachment.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div class="border-t p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <Textarea
            v-model="newMessage"
            placeholder="Type your message..."
            rows="2"
            class="resize-none"
            @keydown.ctrl.enter="sendMessage"
            @keydown.meta.enter="sendMessage"
          />
          <Button type="submit" :disabled="!newMessage.trim() || sending">
            {{ sending ? 'Sending...' : 'Send' }}
          </Button>
        </form>
        <p class="text-xs text-muted-foreground mt-2">
          Press Ctrl+Enter to send
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../../components/ui/toast/use-toast'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { api, useConvexMutation, useConvexQuery, type Id } from '../../../composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Ticket Details',
})

const route = useRoute()
const { toast } = useToast()
const ticketId = computed(() => route.params.ticketId as Id<'supportTickets'>)

const { data } = useConvexQuery(api.supportTickets.get, computed(() => ({
  ticketId: ticketId.value,
})))

const sendMessageMutation = useConvexMutation(api.supportTickets.sendMessage)
const markAsReadMutation = useConvexMutation(api.supportTickets.markAsRead)

const { initSEO } = useSEO({
  title: computed(() => data.value?.ticket.subject || 'Support Ticket'),
  description: 'View and respond to your support ticket.',
  noindex: true,
})

initSEO()

const newMessage = ref('')
const sending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const currentUserId = ref<string | null>(null)

// Get current user ID from the messages
watchEffect(() => {
  if (data.value?.isCustomer && data.value?.ticket.customer) {
    currentUserId.value = data.value.ticket.customer._id
  }
})

const formatDate = (timestamp?: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

const formatMessageTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return

  sending.value = true
  try {
    await sendMessageMutation.mutate({
      ticketId: ticketId.value,
      body: newMessage.value.trim(),
    })
    newMessage.value = ''
    
    // Scroll to bottom
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' })
  } finally {
    sending.value = false
  }
}

// Auto-scroll to bottom when new messages arrive
watch(() => data.value?.messages.length, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

// Scroll to bottom on mount
onMounted(async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

// Mark ticket as read when viewed
watch(() => data.value, async (newData) => {
  if (newData && ticketId.value) {
    try {
      await markAsReadMutation.mutate({ ticketId: ticketId.value })
    } catch (error) {
      // Silent fail - not critical
    }
  }
}, { immediate: true })
</script>
