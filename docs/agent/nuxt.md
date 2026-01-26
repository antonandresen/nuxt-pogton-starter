## Nuxt 4 / Vue 3 conventions (this repo)

- **Composition API**: prefer `<script setup>` in `.vue` files.
- **Auto-imports**: don’t manually import Nuxt/Vue helpers like `ref`, `computed`, `useRouter`, etc.
- **Color mode**: use `@nuxtjs/color-mode` via `useColorMode()` (don’t replace with VueUse color helpers).
- **Data fetching**:
  - **Convex app data**: prefer `useConvexQuery` / `useConvexMutation` for live-synced app data.
  - **Secrets/side effects**: keep in `server/api/**` only when needed (Stripe, webhooks, auth session issuance, non-Convex side effects).
  - **General SSR-ish fetching**:
    - `useFetch` for component-level SSR/cached fetching
    - `$fetch` inside event handlers
    - `useAsyncData` for more custom orchestration/caching
- **SEO**: use `useHead` / `useSeoMeta`.
- **UI**: prefer shadcn-vue components under `app/components/ui` and Tailwind for styling.
