/**
 * Translatable string interface for multi-language content
 * English (en) is REQUIRED and serves as the fallback for all languages
 * Other languages are optional
 */
export interface TranslatableString {
  en: string  // Required - fallback for all languages
  es?: string // Optional - Spanish
  fr?: string // Optional - French
  de?: string // Optional - German
}

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

/**
 * Default language for fallback
 * All content MUST have an English translation
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export function useI18nContent() {
  const { locale } = useI18n()

  /**
   * Get the translated content for the current locale
   * Always falls back to English if translation doesn't exist or is empty
   */
  const getTranslated = (
    content: TranslatableString | string | undefined,
    fallbackLocale: SupportedLanguage = DEFAULT_LANGUAGE
  ): string => {
    // Handle null/undefined
    if (!content) return ''
    
    // Handle plain strings (backward compatibility)
    if (typeof content === 'string') return content

    const currentLocale = locale.value as SupportedLanguage
    
    // Helper to check if a value is valid (not empty/undefined)
    const isValid = (val: string | undefined): val is string => {
      return typeof val === 'string' && val.trim().length > 0
    }
    
    // 1. Try current user's locale (e.g., 'es', 'fr', 'de')
    if (currentLocale !== 'en' && isValid(content[currentLocale])) {
      return content[currentLocale]!
    }
    
    // 2. Always fall back to English (required field)
    if (isValid(content.en)) {
      return content.en
    }
    
    // 3. Last resort: find any non-empty value (shouldn't happen if schema is correct)
    const anyValue = Object.values(content).find(isValid)
    return anyValue || ''
  }

  /**
   * Create an empty translatable string object
   */
  const createTranslatable = (defaultText = ''): TranslatableString => ({
    en: defaultText,
    es: '',
    fr: '',
    de: '',
  })

  /**
   * Convert a plain string to a translatable object
   */
  const toTranslatable = (text: string): TranslatableString => ({
    en: text,
    es: undefined,
    fr: undefined,
    de: undefined,
  })

  /**
   * Check if a translation exists for a specific language
   * Returns false for empty strings
   */
  const hasTranslation = (
    content: TranslatableString | string | undefined,
    language: SupportedLanguage
  ): boolean => {
    if (!content || typeof content === 'string') return false
    const value = content[language]
    return typeof value === 'string' && value.trim().length > 0
  }

  /**
   * Get missing translations for a translatable string
   * Returns array of language codes that are missing or empty
   */
  const getMissingTranslations = (
    content: TranslatableString | string | undefined
  ): SupportedLanguage[] => {
    if (!content || typeof content === 'string') return []
    
    return SUPPORTED_LANGUAGES.filter(lang => !hasTranslation(content, lang))
  }

  return {
    getTranslated,
    createTranslatable,
    toTranslatable,
    hasTranslation,
    getMissingTranslations,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
  }
}
