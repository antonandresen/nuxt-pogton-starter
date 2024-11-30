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
  ],
  site: {
    url: 'https://nuxt-pogton-starter.netlify.app/',
    name: 'Nuxt Pogton Starter',
    description: 'Nuxt Pogton Starter',
    defaultLocale: 'en', // not needed if you have @nuxtjs/i18n installed
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