This repo is a **Nuxt 4 + Convex SaaS starter** (auth, orgs, Stripe, i18n, shadcn/ui, Tailwind).

## Commands (npm)
- **dev**: `npm run dev` (runs `nuxt dev` + `npx convex dev`)
- **build**: `npm run build` (deploys Convex then `nuxt build`)
- **start prod**: `npm run start:prod`
- **preview**: `npm run preview`
- **generate**: `npm run generate`
- **create admin**: `npm run create-admin`

## Progressive disclosure
- Nuxt/Vue patterns: [`docs/agent/nuxt.md`](docs/agent/nuxt.md)
- Convex patterns (auth/permissions/data access): [`docs/agent/convex.md`](docs/agent/convex.md)
- Code style + linting expectations: [`docs/agent/style.md`](docs/agent/style.md)
- Testing (Vitest/Nuxt test utils): [`docs/agent/testing.md`](docs/agent/testing.md)
- **Import conventions**: [`.cursor/rules/imports.mdc`](.cursor/rules/imports.mdc) - Always use `@/` alias
- **Convex API registration**: [`.cursor/rules/convex-api.mdc`](.cursor/rules/convex-api.mdc) - Register new Convex functions in `useConvex.ts`
