export default defineNuxtPlugin(() => {
    const defaults = { credentials: 'include' }
  
    return {
      provide: {
        fetch: (request, options) => {
          options = options || {}
          options.credentials = options.credentials || defaults.credentials
          return $fetch(request, options)
        },
      },
    }
  })