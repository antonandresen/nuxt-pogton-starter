import { createConvexVue } from '@convex-vue/core'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const convexUrl = config.public.CONVEX_URL as string

  if (!convexUrl) {
    console.warn('CONVEX_URL not configured - Convex real-time sync disabled')
    return
  }

  const convexVue = createConvexVue({
    convexUrl,
  })

  nuxtApp.vueApp.use(convexVue)
})

