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
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/ngrok',
    'nuxt-cron',
    '@nuxtjs/i18n'
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
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
    ONESIGNAL_API_KEY: process.env.ONESIGNAL_API_KEY,
    ONESIGNAL_EMAIL_FROM_NAME: process.env.ONESIGNAL_EMAIL_FROM_NAME,
    ONESIGNAL_EMAIL_FROM_ADDRESS: process.env.ONESIGNAL_EMAIL_FROM_ADDRESS,

    public: {
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    }
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
  ngrok: {
    authtoken: process.env.NGROK_AUTH_TOKEN,
    domain: 'splendid-admittedly-falcon.ngrok-free.app' // Put your ngrok URL here
  },
  robots: {
    enabled: true,  
    allow: ['*'],
    groups: []
  },
  cron: {
    jobsDir: 'cron'
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    strategy: 'no_prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // recommended
    },
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English'
      },
      {
        code: 'se',
        language: 'sv-SE',
        name: 'Svenska'
      }
    ]
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://api.stripe.com'],
        'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
      }
    }
  }
})