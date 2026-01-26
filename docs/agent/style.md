## Code style (what to optimize for)

- Prefer **functional/declarative** patterns; avoid classes unless the surrounding code already uses them.
- Reduce duplication: extract composables/utilities when logic repeats.
- TypeScript:
  - Prefer `interface` over `type` when reasonable.
  - Avoid `enum`; use maps/objects instead.
- Naming:
  - composables: `useSomething`
  - component filenames: `PascalCase.vue`
