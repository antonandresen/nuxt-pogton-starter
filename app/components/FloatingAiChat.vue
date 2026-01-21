<template>
  <div v-if="config?.enabled" class="fixed bottom-6 right-6 z-50">
    <div v-if="isOpen" class="w-[360px] shadow-xl">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle class="text-base">Ask Pogton</CardTitle>
            <CardDescription>Product and page assistant</CardDescription>
          </div>
          <Button variant="ghost" size="icon" @click="isOpen = false">
            <X class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent class="space-y-4">
          <ScrollArea class="h-64 rounded-lg border p-3">
            <div class="space-y-3">
              <div
                v-for="(message, index) in messages"
                :key="index"
                :class="message.role === 'user' ? 'text-right' : 'text-left'"
              >
                <div
                  :class="[
                    'inline-block rounded-lg px-3 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  ]"
                >
                  {{ message.content }}
                </div>
              </div>
              <div v-if="isLoading" class="text-xs text-muted-foreground">Thinking...</div>
            </div>
          </ScrollArea>

          <div class="space-y-2">
            <Textarea
              v-model="input"
              rows="3"
              placeholder="Ask about pricing, features, or this page..."
              @keydown.enter.exact.prevent="send"
            />
            <div class="flex items-center justify-between">
              <Button size="sm" :disabled="isLoading || !input.trim()" @click="send">
                Send
              </Button>
              <Button variant="ghost" size="sm" @click="clearChat">Clear</Button>
            </div>
          </div>

          <div v-if="config?.ctaLabel && config?.ctaUrl" class="flex items-center justify-between">
            <div class="text-xs text-muted-foreground">Need human help?</div>
            <Button variant="outline" size="sm" as-child>
              <a :href="config.ctaUrl" target="_blank" rel="noopener noreferrer">
                {{ config.ctaLabel }}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Button v-else size="lg" class="rounded-full shadow-lg" @click="openChat">
      <MessageCircle class="mr-2 h-4 w-4" />
      Ask AI
    </Button>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, X } from 'lucide-vue-next'
import { api, useConvexAction, useConvexQuery } from '@/composables/useConvex'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const { data: config } = useConvexQuery(api.aiChat.getPublicConfig, {})
const askAction = useConvexAction(api.aiChat.ask)
const route = useRoute()

const isOpen = ref(false)
const isLoading = ref(false)
const input = ref('')
const messages = ref<ChatMessage[]>([])

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
    const response = await askAction.run({
      messages: messages.value,
      page: getPageContext(),
    })
    messages.value.push({ role: 'assistant', content: response.message })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, I ran into an error. Try again in a moment.',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

