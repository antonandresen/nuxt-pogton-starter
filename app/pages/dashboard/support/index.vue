<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Support Tickets</h2>
        <p class="text-muted-foreground">Get help from our support team.</p>
      </div>
      <Button @click="showNewTicketDialog = true">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Ticket
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Your Tickets</CardTitle>
        <CardDescription>View and manage your support requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!tickets?.length" class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          <p class="mb-4">No support tickets yet.</p>
          <Button @click="showNewTicketDialog = true" variant="outline">Create your first ticket</Button>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="ticket in tickets"
            :key="ticket._id"
            class="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            :class="{ 'bg-muted/30': ticket.unreadByCustomer }"
          >
            <NuxtLink :to="`/dashboard/support/${ticket._id}`" class="flex-1">
              <div class="flex items-center gap-3">
                <div
                  v-if="ticket.unreadByCustomer"
                  class="h-2 w-2 rounded-full bg-primary"
                  title="Unread messages"
                />
                <div class="flex-1">
                  <div class="font-medium">{{ ticket.subject }}</div>
                  <div class="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{{ formatDate(ticket.createdAt) }}</span>
                    <span>•</span>
                    <span class="capitalize">{{ ticket.status.replace('_', ' ') }}</span>
                    <span>•</span>
                    <span class="capitalize">{{ ticket.priority }}</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink :to="`/dashboard/support/${ticket._id}`">View</NuxtLink>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- New Ticket Dialog -->
    <Dialog :open="showNewTicketDialog" @update:open="showNewTicketDialog = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>Describe your issue and we'll get back to you soon.</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="createTicket" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Subject</label>
            <Input v-model="newTicket.subject" placeholder="Brief description of your issue" required />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Priority</label>
            <Select v-model="newTicket.priority">
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <Textarea
              v-model="newTicket.body"
              placeholder="Provide details about your issue..."
              rows="6"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showNewTicketDialog = false">Cancel</Button>
            <Button type="submit" :disabled="creatingTicket">
              {{ creatingTicket ? 'Creating...' : 'Create Ticket' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../../components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { api, useConvexMutation, useConvexQuery } from '../../../composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Support',
})

const { initSEO } = useSEO({
  title: 'Support',
  description: 'Get help from our support team.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { data: tickets } = useConvexQuery(api.supportTickets.listForCurrentUser, {})
const createMutation = useConvexMutation(api.supportTickets.create)

const showNewTicketDialog = ref(false)
const creatingTicket = ref(false)
const newTicket = ref({
  subject: '',
  body: '',
  priority: 'normal',
})

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

const createTicket = async () => {
  if (!newTicket.value.subject || !newTicket.value.body) return

  creatingTicket.value = true
  try {
    const ticketId = await createMutation.mutate({
      subject: newTicket.value.subject,
      body: newTicket.value.body,
      priority: newTicket.value.priority,
      channel: 'form',
    })

    toast({ title: 'Ticket created', description: 'Our team will respond soon.' })
    showNewTicketDialog.value = false
    newTicket.value = { subject: '', body: '', priority: 'normal' }

    // Navigate to the new ticket
    navigateTo(`/dashboard/support/${ticketId}`)
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to create ticket.', variant: 'destructive' })
  } finally {
    creatingTicket.value = false
  }
}
</script>
