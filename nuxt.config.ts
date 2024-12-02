// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    'nuxt-security',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  site: {
    url: 'https://nuxt-pogton-starter.netlify.app/',
    name: 'Nuxt Pogton Starter',
    description: 'Nuxt Pogton Starter',
    defaultLocale: 'en', // not needed if you have @nuxtjs/i18n installed
  },
  app: {
    pageTransition: {
      name: 'fade',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'slide',
      mode: 'out-in'
    },
    head: {
      titleTemplate: '%s - Pogton',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'The Ultimate Nuxt.js Starter for Your Next SaaS Project' },
        { name: 'theme-color', content: '#ffffff' },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Pogton - Modern Nuxt.js SaaS Starter' },
        { property: 'og:description', content: 'The Ultimate Nuxt.js Starter for Your Next SaaS Project' },
        { property: 'og:image', content: 'https://nuxt-pogton-starter.netlify.app/og-image.jpg' },
        { property: 'og:url', content: 'https://nuxt-pogton-starter.netlify.app/' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@antonandresen' },
        { name: 'twitter:creator', content: '@antonandresen' },
        { name: 'twitter:title', content: 'Pogton - Modern Nuxt.js SaaS Starter' },
        { name: 'twitter:description', content: 'The Ultimate Nuxt.js Starter for Your Next SaaS Project' },
        { name: 'twitter:image', content: 'https://nuxt-pogton-starter.netlify.app//og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://nuxt-pogton-starter.netlify.app' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  runtimeConfig: {
    JWT_SECRET: process.env.JWT_SECRET,
    public: {}
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  components: [
    '~/components', // Auto-import components from this directory
    { path: '~/components/ui', extensions: ['vue'] }, // Auto-import UI components
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },
})