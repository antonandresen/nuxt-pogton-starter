<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Support Tickets</h2>
      <p class="text-muted-foreground">Manage customer support requests.</p>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 flex-wrap">
      <Select v-model="statusFilter">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="waiting_customer">Waiting on Customer</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="categoryFilter">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="technical">Technical Issue</SelectItem>
          <SelectItem value="bug">Bug Report</SelectItem>
          <SelectItem value="billing">Billing Question</SelectItem>
          <SelectItem value="feature">Feature Request</SelectItem>
          <SelectItem value="general">General Support</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="assigneeFilter">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="All assignees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          <SelectItem value="me">Assigned to me</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium">Open</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.open }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.in_progress }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium">Unread</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.unread }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium">Resolved Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.resolvedToday }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Tickets Table -->
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>{{ filteredTickets?.length || 0 }} tickets</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="tickets === undefined" class="flex items-center justify-center p-8">
          <div class="text-muted-foreground">Loading tickets...</div>
        </div>
        <div v-else-if="!filteredTickets?.length" class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No tickets found.
        </div>
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-12" />
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="ticket in filteredTickets" :key="ticket._id">
                <TableCell>
                  <div
                    v-if="ticket.unreadByTeam"
                    class="h-2 w-2 rounded-full bg-primary"
                    title="Unread messages"
                  />
                </TableCell>
                <TableCell>
                  <div class="font-medium">{{ ticket.subject }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ ticket.tags?.join(', ') || '—' }}
                  </div>
                </TableCell>
                <TableCell>
                  <div class="text-sm">{{ ticket.customer?.email || 'Unknown' }}</div>
                  <div class="text-xs text-muted-foreground">{{ ticket.customer?.name || '—' }}</div>
                </TableCell>
                <TableCell>
                  <span v-if="ticket.category" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-red-50 text-red-700 ring-red-600/20': ticket.category === 'bug',
                      'bg-blue-50 text-blue-700 ring-blue-600/20': ticket.category === 'technical',
                      'bg-green-50 text-green-700 ring-green-600/20': ticket.category === 'billing',
                      'bg-purple-50 text-purple-700 ring-purple-600/20': ticket.category === 'feature',
                      'bg-gray-50 text-gray-700 ring-gray-600/20': ticket.category === 'general',
                    }">
                    {{ ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1) }}
                  </span>
                  <span v-else class="text-xs text-muted-foreground">—</span>
                </TableCell>
                <TableCell>
                  <Select
                    :model-value="ticket.status"
                    @update:model-value="(value) => updateTicket(ticket._id, { status: value })"
                  >
                    <SelectTrigger class="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="waiting_customer">Waiting on Customer</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    :model-value="ticket.priority"
                    @update:model-value="(value) => updateTicket(ticket._id, { priority: value })"
                  >
                    <SelectTrigger class="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div class="text-sm">{{ ticket.assignedTo?.email || 'Unassigned' }}</div>
                </TableCell>
                <TableCell>
                  <div class="text-sm">{{ formatDate(ticket.lastMessageAt) }}</div>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="sm" @click="openTicket(ticket._id)">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Ticket Detail Dialog -->
    <Dialog :open="!!selectedTicketId" @update:open="selectedTicketId = null">
      <DialogContent class="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{{ ticketData?.ticket.subject }}</DialogTitle>
          <DialogDescription>
            From {{ ticketData?.ticket.customer?.email }} • 
            <span class="capitalize">{{ ticketData?.ticket.status.replace('_', ' ') }}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div class="flex-1 overflow-y-auto space-y-4 py-4">
          <div v-if="!ticketData?.messages.length" class="text-center text-muted-foreground">
            No messages yet.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="message in ticketData.messages"
              :key="message._id"
              class="rounded-lg p-4"
              :class="message.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-muted'"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium">
                  {{ message.author?.name || message.author?.email || 'Unknown' }}
                </span>
                <span v-if="message.isInternal" class="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded">
                  Internal Note
                </span>
                <span class="text-xs text-muted-foreground ml-auto">
                  {{ formatMessageTime(message.createdAt) }}
                </span>
              </div>
              <div class="text-sm whitespace-pre-wrap">{{ message.body }}</div>
            </div>
          </div>
        </div>

        <div class="border-t pt-4 space-y-3">
          <div class="flex items-center gap-2">
            <Checkbox id="internal" v-model:checked="replyIsInternal" />
            <label for="internal" class="text-sm font-medium cursor-pointer">
              Internal note (not visible to customer)
            </label>
          </div>
          <form @submit.prevent="sendReply" class="flex gap-2">
            <Textarea
              v-model="replyMessage"
              :placeholder="replyIsInternal ? 'Add internal note...' : 'Reply to customer...'"
              rows="3"
              class="resize-none"
            />
            <Button type="submit" :disabled="!replyMessage.trim() || sendingReply">
              {{ sendingReply ? 'Sending...' : 'Send' }}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api, useConvexMutation, useConvexQuery, type Id } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Support Admin',
})

const { initSEO } = useSEO({
  title: 'Support Admin',
  description: 'Manage customer support tickets.',
  noindex: true,
})

initSEO()

const { toast } = useToast()

const statusFilter = ref('all')
const categoryFilter = ref('all')
const assigneeFilter = ref('all')

const { data: tickets } = useConvexQuery(api.supportTickets.listAll, computed(() => ({
  status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
})))

const updateMutation = useConvexMutation(api.supportTickets.update)
const sendMessageMutation = useConvexMutation(api.supportTickets.sendMessage)
const markAsReadMutation = useConvexMutation(api.supportTickets.markAsRead)

const selectedTicketId = ref<Id<'supportTickets'> | null>(null)
const replyMessage = ref('')
const replyIsInternal = ref(false)
const sendingReply = ref(false)

const { data: ticketData } = useConvexQuery(
  api.supportTickets.get,
  computed(() => ({ ticketId: selectedTicketId.value || '' }))
)

const filteredTickets = computed(() => {
  if (!tickets.value) return []
  let result = [...tickets.value]

  if (categoryFilter.value !== 'all') {
    result = result.filter(t => t.category === categoryFilter.value)
  }

  if (assigneeFilter.value === 'unassigned') {
    result = result.filter(t => !t.assignedTo)
  } else if (assigneeFilter.value === 'me') {
    // TODO: Filter by current user ID
  }

  return result
})

const stats = computed(() => {
  const t = tickets.value || []
  const now = Date.now()
  const dayStart = new Date().setHours(0, 0, 0, 0)

  return {
    open: t.filter(x => x.status === 'open').length,
    in_progress: t.filter(x => x.status === 'in_progress').length,
    unread: t.filter(x => x.unreadByTeam).length,
    resolvedToday: t.filter(x => x.status === 'resolved' && x.lastMessageAt >= dayStart).length,
  }
})

const formatDate = (timestamp: number) => {
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

const formatMessageTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

const updateTicket = async (ticketId: Id<'supportTickets'>, updates: any) => {
  try {
    await updateMutation.mutate({ ticketId, ...updates })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to update ticket.', variant: 'destructive' })
  }
}

const openTicket = (ticketId: Id<'supportTickets'>) => {
  selectedTicketId.value = ticketId
}

// Mark ticket as read when opened
watch(() => ticketData.value, async (newData) => {
  if (newData && selectedTicketId.value) {
    try {
      await markAsReadMutation.mutate({ ticketId: selectedTicketId.value })
    } catch (error) {
      // Silent fail - not critical
    }
  }
}, { immediate: true })

const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedTicketId.value) return

  sendingReply.value = true
  try {
    await sendMessageMutation.mutate({
      ticketId: selectedTicketId.value,
      body: replyMessage.value.trim(),
      isInternal: replyIsInternal.value,
    })
    replyMessage.value = ''
    replyIsInternal.value = false
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' })
  } finally {
    sendingReply.value = false
  }
}
</script>
