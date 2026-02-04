<template>
  <div v-if="config?.enabled" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
    <!-- Chat Window -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-4 opacity-0 scale-95"
    >
      <div v-if="isOpen" class="w-[380px] h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border">
        <!-- Header -->
        <div class="bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 class="font-semibold text-foreground">Ask Pogton</h3>
              <p class="text-sm text-muted-foreground">Product assistant</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink 
              to="/dashboard/support" 
              class="relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              My Tickets
              <span 
                v-if="unreadUserTicketCount && unreadUserTicketCount > 0" 
                class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
              >
                {{ unreadUserTicketCount > 9 ? '9+' : unreadUserTicketCount }}
              </span>
            </NuxtLink>
            <button
              @click="isOpen = false"
              class="w-8 h-8 rounded-full hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <ScrollArea class="h-[400px] px-6 py-4 bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm">
          <div class="space-y-4">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
            >
              <div
                :class="[
                  'max-w-[280px] rounded-2xl px-4 py-3 text-sm shadow-md transition-all duration-200',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card text-card-foreground border border-border rounded-bl-sm',
                ]"
              >
                <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
              </div>
            </div>
            <div v-if="isLoading" class="flex justify-start">
              <div class="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <!-- Input Area -->
        <div class="px-4 py-4 bg-card/95 backdrop-blur-sm border-t border-border">
          <div class="flex items-end gap-2">
            <div class="flex-1 relative">
              <input
                v-model="input"
                type="text"
                placeholder="Ask me anything..."
                class="w-full px-4 py-3 pr-12 rounded-full bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground text-sm"
                @keydown.enter.exact.prevent="send"
              />
              <button
                @click="send"
                :disabled="isLoading || !input.trim()"
                class="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m5 12 7-7 7 7"/>
                  <path d="M12 19V5"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="mt-2 flex items-center justify-center gap-3">
            <button
              v-if="messages.length > 1"
              @click="clearChat"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear conversation
            </button>
            <button
              @click="showTicketDialog = true"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Create Support Ticket
            </button>
          </div>
        </div>

        <!-- CTA Footer -->
        <div v-if="config?.ctaLabel && config?.ctaUrl" class="px-6 py-3 bg-card/95 backdrop-blur-sm border-t border-border">
          <a
            :href="config.ctaUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{{ config.ctaLabel }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </a>
        </div>
      </div>
    </Transition>

    <!-- Support Ticket Dialog -->
    <Dialog v-model:open="showTicketDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Need more help? Create a support ticket and our team will get back to you.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="ticket-category">Category</Label>
            <Select v-model="ticketCategory">
              <SelectTrigger id="ticket-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="general">General Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="ticket-subject">Subject</Label>
            <Input 
              id="ticket-subject" 
              v-model="ticketSubject" 
              placeholder="Brief description of your issue"
            />
          </div>
          <div class="space-y-2">
            <Label for="ticket-body">Details</Label>
            <Textarea 
              id="ticket-body" 
              v-model="ticketBody" 
              placeholder="Please provide as much detail as possible..."
              rows="5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showTicketDialog = false">Cancel</Button>
          <Button @click="createTicket" :disabled="isCreatingTicket || !ticketSubject || !ticketBody || !ticketCategory">
            <svg v-if="isCreatingTicket" class="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Floating Button -->
    <button
      @click="isOpen ? (isOpen = false) : openChat()"
      class="w-16 h-16 flex-shrink-0 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-all flex items-center justify-center group relative"
    >
      <!-- Unread Tickets Badge -->
      <span 
        v-if="unreadUserTicketCount && unreadUserTicketCount > 0" 
        class="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-background"
      >
        {{ unreadUserTicketCount > 9 ? '9+' : unreadUserTicketCount }}
      </span>
      
      <div class="w-7 h-7 relative flex items-center justify-center">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="scale-0 rotate-90 opacity-0"
          enter-to-class="scale-100 rotate-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 rotate-0 opacity-100"
          leave-to-class="scale-0 -rotate-90 opacity-0"
        >
          <ChevronDown v-if="isOpen" :key="'close'" class="h-7 w-7 absolute inset-0" />
          <MessageCircle v-else :key="'open'" class="h-7 w-7 absolute inset-0" />
        </Transition>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, X, ChevronDown } from 'lucide-vue-next'
import { api, useConvexAction, useConvexQuery, useConvexMutation } from '@/composables/useConvex'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const { data: config } = useConvexQuery(api.aiChat.getPublicConfig, {})
const { data: unreadUserTicketCount } = useConvexQuery(api.supportTickets.countUnreadForCurrentUser, {})
const askAction = useConvexAction(api.aiChat.ask)
const createTicketMutation = useConvexMutation(api.supportTickets.create)
const route = useRoute()
const { toast } = useToast()

const isOpen = ref(false)
const isLoading = ref(false)
const input = ref('')
const messages = ref<ChatMessage[]>([])

// Support ticket dialog state
const showTicketDialog = ref(false)
const isCreatingTicket = ref(false)
const ticketCategory = ref('')
const ticketSubject = ref('')
const ticketBody = ref('')

const openChat = () => {
  isOpen.value = true
  if (!messages.value.length) {
    messages.value.push({
      role: 'assistant',
      content: config.value?.greeting || 'Hi! Ask me anything about the product.',
    })
  }
}

const clearChat = () => {
  messages.value = []
  openChat()
}

const getPageContext = () => {
  if (process.server) return { path: route.fullPath }
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  return {
    path: route.fullPath,
    title: document.title,
    description,
  }
}

const send = async () => {
  const content = input.value.trim()
  if (!content) return

  messages.value.push({ role: 'user', content })
  input.value = ''
  isLoading.value = true

  try {
    const response = await askAction.mutate({
      messages: messages.value,
      page: getPageContext(),
    })
    messages.value.push({ role: 'assistant', content: response.message })
  } catch (error) {
    console.error('AI Chat error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    messages.value.push({
      role: 'assistant',
      content: `Sorry, I ran into an error: ${errorMessage}`,
    })
  } finally {
    isLoading.value = false
  }
}

const createTicket = async () => {
  if (!ticketSubject.value || !ticketBody.value || !ticketCategory.value) return

  isCreatingTicket.value = true
  try {
    await createTicketMutation.mutate({
      subject: ticketSubject.value,
      body: ticketBody.value,
      category: ticketCategory.value,
      channel: 'chat',
    })

    toast({
      title: 'Ticket created',
      description: 'Our team will get back to you soon!',
    })

    // Reset form
    showTicketDialog.value = false
    ticketCategory.value = ''
    ticketSubject.value = ''
    ticketBody.value = ''
  } catch (error) {
    console.error('Create ticket error:', error)
    toast({
      title: 'Error',
      description: 'Failed to create ticket. Please try again.',
      variant: 'destructive',
    })
  } finally {
    isCreatingTicket.value = false
  }
}
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
