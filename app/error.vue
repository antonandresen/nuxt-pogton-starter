<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

// Fun error messages based on status code
const getErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return {
        title: "Oops! Page Not Found",
        message: "Looks like this page went on vacation without telling us! 🏖️",
        emoji: "🕵️‍♂️"
      }
    case 500:
      return {
        title: "Server Hiccup!",
        message: "Our servers are having a coffee break. They'll be back soon! ☕",
        emoji: "🤖"
      }
    case 403:
      return {
        title: "Access Denied",
        message: "This area is VIP only! Maybe try asking nicely? 🎭",
        emoji: "🚫"
      }
    default:
      return {
        title: "Something Went Wrong",
        message: "Don't worry, even the best websites have bad days! 🌈",
        emoji: "🎪"
      }
  }
}

const errorInfo = computed(() => getErrorMessage(props.error?.statusCode || 500))
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
    <!-- Floating Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-3/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-bounce"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-2xl mx-auto text-center">
      <!-- Error Code with Animation -->
      <div class="mb-8">
        <div class="relative inline-block">
          <h1 class="text-9xl md:text-[12rem] font-black text-white/20 select-none animate-pulse">
            {{ error?.statusCode || '500' }}
          </h1>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-6xl animate-bounce">{{ errorInfo.emoji }}</span>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="mb-12 space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
          {{ errorInfo.title }}
        </h2>
        <p class="text-lg md:text-xl text-white/90 max-w-md mx-auto leading-relaxed animate-fade-in delay-200">
          {{ errorInfo.message }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <button
          @click="handleError"
          class="group relative px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:scale-105 transform transition-all duration-200 shadow-2xl hover:shadow-white/25"
        >
          <span class="relative z-10">🏠 Take Me Home</span>
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
        
        <button
          @click="$router.go(-1)"
          class="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
        >
          ↶ Go Back
        </button>
      </div>

      <!-- Fun Footer -->
      <div class="text-white/70 text-sm space-y-2 animate-fade-in delay-500">
        <p>Error ID: <span class="font-mono bg-white/10 px-2 py-1 rounded">{{ Date.now().toString(36) }}</span></p>
        <p>Still stuck? <a href="mailto:support@example.com" class="underline hover:text-white transition-colors">Drop us a line!</a></p>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute -top-10 -left-10 text-6xl animate-spin-slow opacity-30">⭐</div>
      <div class="absolute -bottom-10 -right-10 text-5xl animate-bounce opacity-30">🎈</div>
      <div class="absolute top-20 -right-5 text-4xl animate-pulse opacity-40">✨</div>
      <div class="absolute bottom-20 -left-5 text-4xl animate-pulse delay-1000 opacity-40">🌟</div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-fade-in.delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-fade-in.delay-500 {
  animation-delay: 0.5s;
  opacity: 0;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
