<template>
  <div v-if="config?.enabled" class="fixed bottom-6 right-6 z-50">
    <!-- Chat Window -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-4 opacity-0 scale-95"
    >
      <div v-if="isOpen" class="w-[380px] h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-purple-400 via-pink-300 to-purple-200">
        <!-- Header -->
        <div class="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Ask Pogton</h3>
              <p class="text-sm text-gray-700">Product assistant</p>
            </div>
          </div>
          <button
            @click="isOpen = false"
            class="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-gray-700"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Messages Area -->
        <ScrollArea class="h-[400px] px-6 py-4 bg-white/40 backdrop-blur-sm">
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
                    ? 'bg-gray-900 text-white rounded-br-sm'
                    : 'bg-white/90 text-gray-900 rounded-bl-sm',
                ]"
              >
                <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
              </div>
            </div>
            <div v-if="isLoading" class="flex justify-start">
              <div class="bg-white/90 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <!-- Input Area -->
        <div class="px-4 py-4 bg-white/60 backdrop-blur-sm border-t border-white/20">
          <div class="flex items-end gap-2">
            <div class="flex-1 relative">
              <input
                v-model="input"
                type="text"
                placeholder="Ask me anything..."
                class="w-full px-4 py-3 pr-12 rounded-full bg-white/90 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder:text-gray-500 text-sm"
                @keydown.enter.exact.prevent="send"
              />
              <button
                @click="send"
                :disabled="isLoading || !input.trim()"
                class="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m5 12 7-7 7 7"/>
                  <path d="M12 19V5"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="messages.length > 1" class="mt-2 flex justify-center">
            <button
              @click="clearChat"
              class="text-xs text-gray-700 hover:text-gray-900 transition-colors"
            >
              Clear conversation
            </button>
          </div>
        </div>

        <!-- CTA Footer -->
        <div v-if="config?.ctaLabel && config?.ctaUrl" class="px-6 py-3 bg-white/40 backdrop-blur-sm border-t border-white/20">
          <a
            :href="config.ctaUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 text-sm text-gray-800 hover:text-gray-900 transition-colors"
          >
            <span>{{ config.ctaLabel }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </a>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="scale-0 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-0 opacity-0"
    >
      <button
        v-if="!isOpen"
        @click="openChat"
        class="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle class="h-7 w-7 group-hover:scale-110 transition-transform" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, X } from 'lucide-vue-next'
import { api, useConvexAction, useConvexQuery } from '@/composables/useConvex'
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
