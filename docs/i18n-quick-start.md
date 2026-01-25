# Multi-Language Pricing - Quick Start

## What Was Implemented

✅ **Language Selector Component** with flag icons (🇬🇧 🇪🇸 🇫🇷 🇩🇪)  
✅ **Database Schema Updates** for translatable strings  
✅ **Admin UI** with language switcher  
✅ **Frontend Display** with automatic locale detection  
✅ **Migration Script** for existing data  

## Admin Interface

When creating/editing a pricing plan, you'll see:

```
┌─────────────────────────────────────────────────┐
│ Create Plan                                     │
├─────────────────────────────────────────────────┤
│ Edit Language: [🇬🇧 EN] [🇪🇸 ES] [🇫🇷 FR] [🇩🇪 DE] │
│                                                 │
│ Name (EN): Pro Plan                            │
│ Description (EN): For growing teams            │
│                                                 │
│ Features (EN):                                  │
│ ┌─────────────────────────────────────────┐   │
│ │ Unlimited projects                      │   │
│ │ 10 team members                         │   │
│ │ Priority support                        │   │
│ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Click on a flag** to switch languages and enter translations.

## How It Works

### 1. Storage (Database)
```typescript
{
  name: {
    en: "Pro Plan",
    es: "Plan Pro",
    fr: "Plan Pro", 
    de: "Pro-Plan"
  }
}
```

### 2. Display (Frontend)
```typescript
const { getTranslated } = useI18nContent()
const displayName = getTranslated(plan.name) // Auto-detects user's language
```

### 3. Fallback (Always English)
- **English is required** and always acts as the default
- Missing or empty translation? **Automatically shows English**
- Empty strings are treated as missing translations

## User Experience

**For Admins:**
- Click flag to switch editing language
- English text shows as placeholder in other languages
- All languages saved together

**For End Users:**
- Content appears in their browser's language (if available)
- **Always falls back to English** if translation is missing or empty
- No configuration needed - works automatically

## Workflow Example

### Creating a Multilingual Plan

1. **Admin opens "New Plan"**
2. **Fills English version** (**REQUIRED** - this is the fallback for all languages):
   - Name: "Starter Plan"
   - Description: "Perfect for individuals"
   - Features: "5 projects\n2GB storage\nEmail support"

3. **Clicks 🇪🇸 (Spanish flag)**
4. **Fills Spanish version** (optional - if left empty, shows English):
   - Name: "Plan Inicial"
   - Description: "Perfecto para individuos"
   - Features: "5 proyectos\n2GB almacenamiento\nSoporte por email"

5. **Repeats for other languages** (optional)

6. **Clicks "Create"** - All translations saved!

### User Sees

**English user:**
```
Starter Plan
Perfect for individuals
• 5 projects
• 2GB storage
```

**Spanish user:**
```
Plan Inicial
Perfecto para individuos
• 5 proyectos
• 2GB almacenamiento
```

## Fallback Examples

### Scenario 1: Complete Translation
```typescript
name: { en: "Pro", es: "Pro", fr: "Pro", de: "Pro" }
```
- 🇬🇧 English user → "Pro"
- 🇪🇸 Spanish user → "Pro"
- 🇫🇷 French user → "Pro"
- 🇩🇪 German user → "Pro"

### Scenario 2: Partial Translation
```typescript
name: { en: "Pro", es: "Pro", fr: "", de: undefined }
```
- 🇬🇧 English user → "Pro"
- 🇪🇸 Spanish user → "Pro"
- 🇫🇷 French user → "Pro" (empty → **falls back to English**)
- 🇩🇪 German user → "Pro" (missing → **falls back to English**)

### Scenario 3: English Only
```typescript
name: { en: "Pro", es: "", fr: "", de: "" }
```
- **All users** → "Pro" (**English fallback for everyone**)

### Key Point
**English is always the safety net.** If any language is missing or empty, users see the English version automatically.

## Next Steps

1. **If you have existing plans**: Run the migration script
2. **Add translations**: Edit existing plans via admin UI
3. **Add more languages**: Follow the guide in `i18n-pricing-guide.md`

## Key Files

- `app/components/admin/LanguageSelector.vue` - Flag selector component
- `app/composables/useI18nContent.ts` - Translation helpers
- `convex/schema.ts` - Database schema with translatable fields
- `convex/pricingPlans.ts` - CRUD operations for plans
- `app/pages/admin/pricing.vue` - Admin interface
- `app/components/PricingPlans.vue` - Public display component

## Questions?

See the full guide in `docs/i18n-pricing-guide.md`
