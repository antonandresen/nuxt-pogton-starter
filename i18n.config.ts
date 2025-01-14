import en from './locales/en.json'
import se from './locales/se.json'

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
     en,
     se
    }
  }))
  