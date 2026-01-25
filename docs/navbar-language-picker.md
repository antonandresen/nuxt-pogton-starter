# Navbar Language Picker Update

## Changes Made

### 1. **Flag-Based Language Selector**

The navbar now shows a dropdown with flags for language selection:

```
[🇬🇧 English ▾]
 ├─ 🇬🇧 English
 └─ 🇸🇪 Svenska
```

**Features:**
- ✅ Visual flags for quick identification
- ✅ Compact dropdown design
- ✅ Shows current language with flag
- ✅ Works on mobile and desktop

### 2. **Standardized Locale Codes**

Fixed the locale code mismatch:

**Before:**
- Nuxt i18n: `'se'` (incorrect)
- Pricing system: `'sv'` (correct)

**After:**
- Both systems now use: `'sv'` ✓

**Why this matters:**
- `sv` is the correct ISO 639-1 code for Swedish
- `se` is actually the country code for Sweden
- Standardization ensures consistency across the app

### 3. **Fixed Language Switching**

The language picker now properly switches languages by:
- Using `computed` with getter/setter for reactivity
- Calling `setLocale()` when selection changes
- Maintaining consistent locale codes across the app

---

## Technical Details

### Updated Files

1. **`app/components/LocalePicker.vue`**
   - Added flag icons (🇬🇧 🇸🇪)
   - Improved reactivity with computed properties
   - Shows both flag and language name

2. **`nuxt.config.ts`**
   - Changed locale code from `'se'` to `'sv'`

3. **`i18n.config.ts`**
   - Updated import from `se.json` to `sv.json`
   - Updated messages object to use `sv` key

4. **`locales/sv.json`** (renamed from `se.json`)
   - Contains Swedish translations

---

## Component Code

```vue
<template>
  <Select v-model="currentLocale">
    <SelectTrigger class="w-[140px]">
      <SelectValue>
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ currentFlag }}</span>
          <span class="text-sm">{{ currentLanguageName }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="lang in availableLanguages"
        :key="lang.code"
        :value="lang.code"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
]

const currentLocale = computed({
  get: () => locale.value,
  set: (newLocale) => setLocale(newLocale)
})

const currentLanguageInfo = computed(() => {
  return availableLanguages.find(lang => lang.code === locale.value) || availableLanguages[0]
})

const currentFlag = computed(() => currentLanguageInfo.value.flag)
const currentLanguageName = computed(() => currentLanguageInfo.value.name)
</script>
```

---

## How to Add More Languages

### Step 1: Add to `nuxt.config.ts`

```typescript
locales: [
  { code: 'en', language: 'en-US', name: 'English' },
  { code: 'sv', language: 'sv-SE', name: 'Svenska' },
  { code: 'fr', language: 'fr-FR', name: 'Français' }, // Add new
]
```

### Step 2: Create locale file

Create `locales/fr.json`:
```json
{
  "title": "Transformez Votre Entreprise avec Notre Plateforme"
}
```

### Step 3: Update `i18n.config.ts`

```typescript
import en from './locales/en.json'
import sv from './locales/sv.json'
import fr from './locales/fr.json' // Add import

export default defineI18nConfig(() => ({
  messages: {
    en,
    sv,
    fr // Add to messages
  }
}))
```

### Step 4: Update `LocalePicker.vue`

```typescript
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add to picker
]
```

### Step 5: Add to pricing i18n

Update `app/composables/useI18nContent.ts` to include the new language in the `TranslatableString` interface and related code (if you want the pricing plans translated too).

---

## Usage

The LocalePicker component is already included in the Navbar:

```vue
<!-- Navbar.vue -->
<div class="flex items-center gap-4">
  <LocalePicker /> <!-- Language picker with flags -->
  <ThemeToggle />
  <!-- ... other nav items -->
</div>
```

It automatically:
- Detects browser language on first visit
- Saves selection in a cookie
- Switches entire app to selected language
- Updates all i18n-enabled components

---

## Browser Language Detection

Configured in `nuxt.config.ts`:

```typescript
i18n: {
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root'
  }
}
```

**Behavior:**
1. First visit → Detects browser language
2. User manually switches → Saves preference in cookie
3. Return visit → Uses saved preference

---

## Testing

### Test Language Switching

1. **Open the app**
2. **Click language picker** in navbar
3. **Select Svenska** (🇸🇪)
4. **Verify:**
   - Dropdown shows "🇸🇪 Svenska"
   - Page content updates (if translated)
   - Cookie is saved
5. **Refresh page**
6. **Verify:**
   - Language persists
   - Still shows Svenska

### Test Fallback

1. **Switch to Svenska**
2. **View untranslated content**
3. **Should show:** English content (fallback)

---

## Troubleshooting

### Language not switching?

**Check:**
1. Browser console for errors
2. Cookie is being set (`i18n_redirected`)
3. Locale files exist (`locales/en.json`, `locales/sv.json`)
4. `i18n.config.ts` imports are correct

**Solution:**
- Clear browser cookies
- Restart dev server
- Check locale codes match everywhere

### Flags not showing?

**Check:**
- Emoji rendering in browser
- Component is importing correctly
- `availableLanguages` array has flags

**Fallback:**
Use text labels: `EN` / `SV` instead of flags if needed

---

## Summary

✅ **Navbar language picker now has flags**  
✅ **Only English and Swedish included**  
✅ **Language switching is working properly**  
✅ **Locale codes standardized to `'en'` and `'sv'`**  
✅ **Consistent across entire app**

The language picker provides a clean, professional way for users to switch between English and Swedish with visual flags for easy identification.
