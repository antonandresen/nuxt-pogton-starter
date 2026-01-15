// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-29',
  devtools: { enabled: true },
  ssr: true,
  
  // Ignore Convex generated files from triggering restarts
  watch: ['!convex/_generated/**'],
  
  // Vite configuration for shadcn/ui component aliases
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '@/components': fileURLToPath(new URL('./app/components', import.meta.url)),
        '@/lib': fileURLToPath(new URL('./lib', import.meta.url)),
        '~/convex': fileURLToPath(new URL('./convex', import.meta.url)),
      }
    }
  },
  
  // 🚀 GIGA ULTRA SEO MODULES
  modules: [
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
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    // Enhanced schema.org support
    'nuxt-schema-org',
    // Font optimization for performance
    '@nuxtjs/fontaine',
    '@nuxt/image'
  ],

  // Enhanced route rules for SEO and performance
  routeRules: {
    '/blog/**': {
      prerender: true,
      robots: 'index, follow'
    },
    '/': { 
      prerender: true,
      robots: 'index, follow'
    },
    '/about': { 
      prerender: true,
      robots: 'index, follow'
    },
    '/pricing': { 
      prerender: true,
      robots: 'index, follow'
    },
    '/dashboard/**': { 
      robots: 'noindex, nofollow'
    },
    '/admin/**': { 
      robots: 'noindex, nofollow'
    }
  },

  // 🎯 ULTRA SEO SITE CONFIG
  site: {
    url: 'https://nuxt-pogton-starter.netlify.app/',
    name: 'Pogton Starter',
    description: 'The Ultimate Nuxt.js SaaS Starter Kit with Authentication, Payments, and Modern UI',
    defaultLocale: 'en',
    identity: {
      type: 'Organization'
    },
    twitter: '@anton_andresen',
    trailingSlash: false
  },

  // 🔧 ADVANCED SEO CONFIGURATION
  seo: {
    automaticDefaults: true,
    fallbackTitle: false,
    redirectToCanonicalSiteUrl: true
  },

  // 🗺️ COMPREHENSIVE SITEMAP
  sitemap: {
    exclude: [
      '/dashboard/**',
      '/admin/**',
      '/forgot-password',
      '/reset-password'
    ]
  },

  // 🤖 ROBOTS.TXT OPTIMIZATION
  robots: {
    disallow: ['/dashboard', '/admin', '/api'],
    allow: ['/api/og-image'],
    sitemap: 'https://nuxt-pogton-starter.netlify.app/sitemap.xml'
  },

  // 📊 SCHEMA.ORG STRUCTURED DATA
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Pogton Starter',
      url: 'https://nuxt-pogton-starter.netlify.app',
      logo: 'https://nuxt-pogton-starter.netlify.app/logo.png',
      sameAs: [
        'https://x.com/anton_andresen'
      ]
    }
  },

  // 🚀 PERFORMANCE & CORE WEB VITALS OPTIMIZATION
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      titleTemplate: '%s %separator %siteName',
      templateParams: {
        siteName: 'Pogton Starter',
        separator: '·'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'The Ultimate Nuxt.js SaaS Starter Kit with Authentication, Stripe Payments, Modern UI Components, and Production-Ready Features' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        
        // Enhanced Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Pogton Starter' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Pogton Starter · The Ultimate Nuxt.js SaaS Starter Kit' },
        { property: 'og:description', content: 'Build your next SaaS with Nuxt 4, Drizzle ORM, Tailwind CSS, Stripe Payments, and Authentication. Production-ready starter kit.' },
        { property: 'og:image', content: 'https://nuxt-pogton-starter.netlify.app/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Pogton Starter - Ultimate Nuxt.js SaaS Kit' },
        { property: 'og:url', content: 'https://nuxt-pogton-starter.netlify.app/' },
        
        // Enhanced Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@anton_andresen' },
        { name: 'twitter:creator', content: '@anton_andresen' },
        { name: 'twitter:title', content: 'Pogton Starter · The Ultimate Nuxt.js SaaS Starter Kit' },
        { name: 'twitter:description', content: 'Build your next SaaS with Nuxt 4, Drizzle ORM, Tailwind CSS, Stripe Payments, and Authentication. Production-ready starter kit.' },
        { name: 'twitter:image', content: 'https://nuxt-pogton-starter.netlify.app/og-image.png' },
        { name: 'twitter:image:alt', content: 'Pogton Starter - Ultimate Nuxt.js SaaS Kit' },

        // Additional SEO Meta
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'author', content: 'Pogton Technologies' },
        { name: 'publisher', content: 'Pogton Technologies' },
        { name: 'keywords', content: 'Nuxt.js, SaaS, Starter Kit, Vue.js, Tailwind CSS, Drizzle ORM, Stripe, Authentication, TypeScript' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#3b82f6' },
        // Canonical and alternate links handled by SEO module
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // DNS prefetch for performance
        { rel: 'dns-prefetch', href: 'https://api.stripe.com' },
        { rel: 'dns-prefetch', href: 'https://checkout.stripe.com' }
      ]
    }
  },

  // 🎨 FONT OPTIMIZATION
  fonts: {
    families: [
      {
        name: 'Figtree',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
        display: 'swap',
        preload: true
      }
    ],
    defaults: {
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin']
    }
  },

  // ⚡ NITRO OPTIMIZATION FOR PERFORMANCE
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml']
    },
    alias: {
      '~/convex': fileURLToPath(new URL('./convex', import.meta.url)),
      'convex/_generated/api': fileURLToPath(new URL('./convex/_generated/api', import.meta.url)),
      'convex/_generated/dataModel': fileURLToPath(new URL('./convex/_generated/dataModel', import.meta.url))
    },
    externals: {
      inline: [/^convex/]
    }
  },

  // 🎯 RUNTIME CONFIG
  runtimeConfig: {
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
    ONESIGNAL_API_KEY: process.env.ONESIGNAL_API_KEY,
    ONESIGNAL_EMAIL_FROM_NAME: process.env.ONESIGNAL_EMAIL_FROM_NAME,
    ONESIGNAL_EMAIL_FROM_ADDRESS: process.env.ONESIGNAL_EMAIL_FROM_ADDRESS,
    CONVEX_URL: process.env.CONVEX_URL,

    public: {
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      CONVEX_URL: process.env.CONVEX_URL,
    }
  },

  // 🔒 SECURITY HEADERS
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': [
          "'self'", 
          'https://api.stripe.com',
          'https://*.convex.cloud',  // Allow all Convex deployments
          'wss://*.convex.cloud'      // WebSocket for real-time sync
        ],
        'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
      }
    }
  },

  // MODULES FOR COMPONENTS AND UTILITIES
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: './app/components/ui'
  },
  css: [
    './app/assets/css/tailwind.css'
  ],
  components: [
    '~/components', // Auto-import components from this directory
    '~/components/sections',
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
  }
})