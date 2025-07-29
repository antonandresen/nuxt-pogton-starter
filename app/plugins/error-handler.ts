export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:error', (error, instance, info) => {
        console.error('NUXT ERROR:', error, instance, info)
    })
  })