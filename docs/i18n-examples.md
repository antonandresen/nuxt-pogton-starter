# i18n Translation Examples

## Basic Usage

### Display Translated Content

```vue
<script setup>
import { useI18nContent } from '~/composables/useI18nContent'

const { getTranslated } = useI18nContent()

// Your data from Convex
const plan = {
  name: { en: 'Pro Plan', es: 'Plan Pro', fr: 'Plan Pro', de: '' },
  description: { en: 'For teams', es: 'Para equipos', fr: '', de: '' }
}
</script>

<template>
  <div>
    <!-- Always shows user's language or falls back to English -->
    <h1>{{ getTranslated(plan.name) }}</h1>
    <p>{{ getTranslated(plan.description) }}</p>
  </div>
</template>
```

**Result:**
- 🇬🇧 English user: "Pro Plan" / "For teams"
- 🇪🇸 Spanish user: "Plan Pro" / "Para equipos"
- 🇫🇷 French user: "Plan Pro" / "For teams" (description falls back to EN)
- 🇩🇪 German user: "Pro Plan" / "For teams" (both fall back to EN)
- 🇸🇪 Swedish user: "Pro Plan" / "For teams" (both fall back to EN)

---

## Check Translation Status

### Show "Translation Missing" Badge

```vue
<script setup>
import { useI18nContent } from '~/composables/useI18nContent'

const { getTranslated, hasTranslation, getMissingTranslations } = useI18nContent()
const { locale } = useI18n()

const plan = {
  name: { en: 'Pro Plan', es: 'Plan Pro', fr: '', de: undefined }
}

const currentLang = computed(() => locale.value)
const isMissingTranslation = computed(() => 
  !hasTranslation(plan.name, currentLang.value)
)
const missingLanguages = computed(() => 
  getMissingTranslations(plan.name)
)
</script>

<template>
  <div>
    <h1>{{ getTranslated(plan.name) }}</h1>
    
    <!-- Show warning if viewing in English fallback mode -->
    <Badge v-if="isMissingTranslation && currentLang !== 'en'" variant="outline">
      Showing English ({{ currentLang.toUpperCase() }} not available)
    </Badge>
    
    <!-- Admin view: show which languages need translation -->
    <div v-if="isAdmin" class="text-xs text-muted-foreground">
      Missing translations: {{ missingLanguages.join(', ') }}
    </div>
  </div>
</template>
```

---

## Admin: Validate Before Save

### Ensure English Translation Exists

```typescript
import { useI18nContent } from '~/composables/useI18nContent'

const { hasTranslation } = useI18nContent()

const savePlan = () => {
  // Validate English is present
  if (!hasTranslation(form.name, 'en')) {
    toast({
      title: 'English name required',
      description: 'English serves as fallback for all languages',
      variant: 'destructive'
    })
    return
  }
  
  if (!hasTranslation(form.description, 'en')) {
    toast({
      title: 'English description required',
      variant: 'destructive'
    })
    return
  }
  
  // Save plan...
}
```

---

## Admin: Show Translation Progress

### Display Completion Status

```vue
<script setup>
import { useI18nContent } from '~/composables/useI18nContent'

const { getMissingTranslations, SUPPORTED_LANGUAGES } = useI18nContent()

const plan = {
  name: { en: 'Pro', es: 'Pro', fr: '', de: undefined },
  description: { en: 'For teams', es: '', fr: '', de: '' }
}

const getTranslationProgress = (content: TranslatableString) => {
  const missing = getMissingTranslations(content)
  const completed = SUPPORTED_LANGUAGES.length - missing.length
  const percentage = (completed / SUPPORTED_LANGUAGES.length) * 100
  return { completed, total: SUPPORTED_LANGUAGES.length, percentage }
}

const nameProgress = computed(() => getTranslationProgress(plan.name))
const descProgress = computed(() => getTranslationProgress(plan.description))
</script>

<template>
  <div class="space-y-4">
    <div>
      <div class="flex justify-between text-sm mb-1">
        <span>Name Translation</span>
        <span>{{ nameProgress.completed }}/{{ nameProgress.total }}</span>
      </div>
      <Progress :value="nameProgress.percentage" />
    </div>
    
    <div>
      <div class="flex justify-between text-sm mb-1">
        <span>Description Translation</span>
        <span>{{ descProgress.completed }}/{{ descProgress.total }}</span>
      </div>
      <Progress :value="descProgress.percentage" />
    </div>
  </div>
</template>
```

---

## Advanced: Custom Fallback Language

### Use Spanish as Fallback (Instead of English)

```typescript
import { useI18nContent } from '~/composables/useI18nContent'

const { getTranslated } = useI18nContent()

// For Latin American markets, you might want Spanish as secondary fallback
const displayName = getTranslated(plan.name, 'es')
// Tries: User's Language → Spanish → English → Any available
```

---

## Create Translatable Content

### From Admin Form

```typescript
import { useI18nContent } from '~/composables/useI18nContent'

const { createTranslatable, toTranslatable } = useI18nContent()

// Start with empty translations
const newPlan = {
  name: createTranslatable('Basic Plan'), // { en: 'Basic Plan', es: '', fr: '', de: '' }
  description: createTranslatable(),      // { en: '', es: '', fr: '', de: '' }
}

// Convert existing string data to translatable
const existingFeature = "Unlimited projects"
const translatable = toTranslatable(existingFeature)
// Result: { en: 'Unlimited projects', es: undefined, fr: undefined, de: undefined }
```

---

## Real-World Example: Pricing Card

### Complete Component

```vue
<script setup lang="ts">
import { useI18nContent, type TranslatableString } from '~/composables/useI18nContent'

interface PricingPlan {
  _id: string
  name: TranslatableString
  description: TranslatableString
  price: number
  features: TranslatableString[]
}

const props = defineProps<{
  plan: PricingPlan
}>()

const { getTranslated, hasTranslation } = useI18nContent()
const { locale } = useI18n()

// Check if current language has full translations
const isFullyTranslated = computed(() => {
  const lang = locale.value
  return (
    hasTranslation(props.plan.name, lang) &&
    hasTranslation(props.plan.description, lang) &&
    props.plan.features.every(f => hasTranslation(f, lang))
  )
})
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>{{ getTranslated(plan.name) }}</CardTitle>
        <Badge v-if="!isFullyTranslated && locale !== 'en'" variant="outline" class="text-xs">
          🇬🇧 EN
        </Badge>
      </div>
      <CardDescription>{{ getTranslated(plan.description) }}</CardDescription>
    </CardHeader>
    
    <CardContent>
      <div class="text-3xl font-bold mb-6">
        ${{ plan.price }}/mo
      </div>
      
      <ul class="space-y-2">
        <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-start gap-2">
          <Check class="h-4 w-4 text-primary mt-1" />
          <span>{{ getTranslated(feature) }}</span>
        </li>
      </ul>
      
      <Button class="w-full mt-6">Subscribe</Button>
    </CardContent>
  </Card>
</template>
```

---

## Testing Translations

### Switch Languages Programmatically

```typescript
// For testing in development
const { locale } = useI18n()

// Test English (default)
locale.value = 'en'

// Test Spanish
locale.value = 'es'

// Test missing translation fallback (Swedish with no translations)
locale.value = 'sv'
// Should show English content automatically
```

---

## Summary

**Key Functions:**
- `getTranslated(content)` - Display content (auto-fallback to English)
- `hasTranslation(content, lang)` - Check if translation exists
- `getMissingTranslations(content)` - List missing languages
- `createTranslatable(text)` - Create new translatable object
- `toTranslatable(text)` - Convert string to translatable

**Remember:**
- ✅ English is **always required**
- ✅ Empty strings = missing translations
- ✅ Automatic fallback to English
- ✅ No configuration needed
