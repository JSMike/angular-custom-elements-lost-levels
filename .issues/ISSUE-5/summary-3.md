# Session 3

**Date:** 2026-03-15

**Prompt/Ask:** Try deliberately supporting `libs/boxes` source consumption in `apps/boxes-nextjs` by teaching Next how to treat `*.scss?inline` as raw CSS text.

## Completed
- Switched `apps/boxes-nextjs` from the previous dist-oriented alias attempt to explicit source consumption in [next.config.mjs](/home/mcebrian/dev/angular-web-component-integration/apps/boxes-nextjs/next.config.mjs).
- Added a custom webpack rule for `*.scss?inline` that:
  - matches `resourceQuery: /inline/`
  - runs `sass-loader`
  - returns the compiled CSS as `asset/source`
- Inserted that rule at the front of Next's CSS `oneOf` pipeline so it wins before the normal Sass handling.
- Confirmed the manual `@lit-labs/ssr-react/enable-lit-ssr.js` import had been reverted and left the `@lit-labs/nextjs` plugin as the only SSR integration path.
- Removed the explicit custom target overrides from `apps/boxes-nextjs/project.json`; the project now relies on the inferred Next targets again.

## Current Status
- The Next SSR baseline now intentionally consumes `libs/boxes/src/*`.
- The previous `[object Object]` SSR style problem is resolved.
- Verified result:
  - the server-rendered HTML now contains the full CSS text inside the declarative shadow DOM `<style>` tags for all four controls
  - the HTML still contains the expected custom elements and shadowroot templates
- `ISSUE-5` remains `in-progress` overall because the Angular SSR/hydration side is still outstanding.

## Plan Coverage
- Advanced the Next.js baseline from a working SSR comparison app to a source-consumption setup that matches the library authoring model more closely.
- Resolved the concrete SSR/style serialization defect uncovered in Session 2.

## Files Changed
- `apps/boxes-nextjs/next.config.mjs` - Switched the `@/boxes` alias to `libs/boxes/src` and added the `*.scss?inline` raw CSS webpack rule.
- `apps/boxes-nextjs/project.json` - Removed the custom target overrides now that the app no longer needs the explicit dist-oriented setup.

## Verification
- `npx nx build boxes-nextjs`
  - passed
  - route output still shows `/` as `ƒ` (dynamic, server-rendered on demand)
- `npx nx lint boxes-nextjs`
  - passed
- Live SSR check:
  - ran `npx next start -p 4300` inside `apps/boxes-nextjs`
  - fetched `http://localhost:4300`
  - confirmed:
    - no `[object Object]` remains in the HTML
    - `<template shadowroot="open" ...>` is still present for each custom element
    - the shadow-root `<style>` blocks now contain real compiled CSS text

## Next Steps
- Use this fixed Next baseline as the non-Angular SSR comparison when implementing the Angular SSR/hydration repro.
- Decide whether the slide deck should explicitly mention that Next needed a custom `*.scss?inline` webpack rule to consume the library source directly, or whether that detail is too implementation-specific for the presentation.
