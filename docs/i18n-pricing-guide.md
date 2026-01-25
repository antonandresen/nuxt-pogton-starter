# Multi-Language Pricing Plans Guide

## Overview

The pricing plan system now supports multiple languages for better internationalization. Content is stored in the database with translations for English, Spanish, French, and German.

## Features

- **Language Selector**: Admin UI includes a flag-based language switcher
- **Translatable Fields**: Name, Description, and Features support multiple languages
- **Smart Fallback Logic**: 
  - User's language (if available and not empty) → **English (always)** → Any available
  - English is **required** and serves as the default for all users
  - Empty strings are treated as missing translations
- **Real-time Updates**: Uses Convex for live data sync

## Supported Languages

| Language | Code | Flag |
|----------|------|------|
| English  | en   | 🇬🇧   |
| Spanish  | es   | 🇪🇸   |
| French   | fr   | 🇫🇷   |
| German   | de   | 🇩🇪   |

## Admin Usage

### Creating a New Plan

1. Go to **Admin → Pricing Plans**
2. Click **New Plan**
3. Use the language selector at the top to switch languages
4. Fill in the content for each language:
   - **English (en)**: Required - acts as fallback
   - **Other languages**: Optional

### Best Practices

- **Always fill in English first** - it's the **required** fallback language for all users
- **English is mandatory** - The system will always show English if the user's language is missing or empty
- **Keep feature lists aligned** - same number of features in each language for consistency
- **Use placeholders** - the form shows English text as placeholder when editing other languages
- **Empty = Missing** - Empty strings are treated as missing translations and fall back to English
- **Save often** - changes are saved when you click Create/Update

### Language Selector UI

The language selector appears at the top of the create/edit dialog:

```
Edit Language:  [🇬🇧 English] [🇪🇸 Español] [🇫🇷 Français] [🇩🇪 Deutsch]
```

Click a language to switch - form fields update to show that language's content.

## Frontend Usage

The `PricingPlans` component automatically displays content in the user's current locale:

```vue
<script setup>
import { useI18nContent } from '~/composables/useI18nContent'

const { getTranslated } = useI18nContent()

// Use with translatable content
const planName = getTranslated(plan.name) // Returns correct language or falls back to English
</script>
```

## Data Structure

### Before (String)
```typescript
{
  name: "Pro Plan",
  description: "For growing teams",
  features: ["Feature 1", "Feature 2"]
}
```

### After (Translatable)
```typescript
{
  name: {
    en: "Pro Plan",
    es: "Plan Pro",
    fr: "Plan Pro",
    de: "Pro-Plan"
  },
  description: {
    en: "For growing teams",
    es: "Para equipos en crecimiento",
    fr: "Pour les équipes en croissance",
    de: "Für wachsende Teams"
  },
  features: [
    {
      en: "Feature 1",
      es: "Característica 1",
      fr: "Fonctionnalité 1",
      de: "Funktion 1"
    }
  ]
}
```

## Migration

If you have existing pricing plans, run the migration script:

1. Update the schema (already done)
2. Run the migration in Convex dashboard:
   ```bash
   npx convex run migrations/migratePricingPlansToTranslatable:migratePricingPlans
   ```
3. Verify plans in admin UI
4. Add translations for other languages

## Adding More Languages

To add a new language:

1. Update `app/composables/useI18nContent.ts`:
   ```typescript
   export interface TranslatableString {
     en: string
     es?: string
     fr?: string
     de?: string
     it?: string  // Add new language
   }
   
   export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it'] as const
   ```

2. Update `app/components/admin/LanguageSelector.vue`:
   ```typescript
   const languages: Language[] = [
     // ... existing languages
     { code: 'it', label: 'Italiano', flag: '🇮🇹' },
   ]
   ```

3. Update schema in `convex/schema.ts` (add language to all translatable objects)

4. Update mutations in `convex/pricingPlans.ts` (add language to validators)

## API Reference

### `useI18nContent()`

Composable for working with translatable content.

**Methods:**

- `getTranslated(content, fallback?)` - Get translated string for current locale
  - **Always falls back to English** if translation is missing or empty
  - Handles empty strings by treating them as missing
- `createTranslatable(defaultText?)` - Create empty translatable object
- `toTranslatable(text)` - Convert string to translatable object
- `hasTranslation(content, language)` - Check if translation exists (not empty)
- `getMissingTranslations(content)` - Get array of missing language codes

**Example:**
```typescript
const { 
  getTranslated, 
  createTranslatable, 
  hasTranslation,
  getMissingTranslations 
} = useI18nContent()

// Get translation (always defaults to English if missing)
const name = getTranslated(plan.name) 
// User locale: 'es' → Returns Spanish if exists, otherwise English

// Create empty translatable
const newName = createTranslatable() // { en: '', es: '', fr: '', de: '' }
const withDefault = createTranslatable('Hello') // { en: 'Hello', es: '', fr: '', de: '' }

// Convert string
const translatable = toTranslatable('Hello') // { en: 'Hello' }

// Check if translation exists
if (!hasTranslation(plan.name, 'es')) {
  console.log('Spanish translation is missing or empty')
}

// Get all missing translations
const missing = getMissingTranslations(plan.name)
console.log(missing) // ['es', 'fr'] - only if these are empty/undefined
```

**Fallback Behavior:**
```typescript
// Example with partial translations
const plan = {
  name: {
    en: 'Pro Plan',
    es: '',  // Empty string treated as missing
    fr: 'Plan Pro',
    de: undefined  // Missing
  }
}

// Spanish user sees: "Pro Plan" (English fallback - Spanish is empty)
// French user sees: "Plan Pro" (French exists)
// German user sees: "Pro Plan" (English fallback - German missing)
// English user sees: "Pro Plan" (Direct match)
```

## Troubleshooting

### Existing plans not showing

Run the migration script to convert old data format.

### Missing translations

The system falls back to English. Add translations via admin UI.

### Language not switching in admin

Check that `currentLanguage` ref is being updated in the LanguageSelector component.

### Features misaligned

Each language can have different number of features. The system takes the maximum length and fills missing ones from English.
