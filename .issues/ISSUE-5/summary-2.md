# Session 2

**Date:** 2026-03-15

**Prompt/Ask:** Update the scaffolded `apps/boxes-nextjs` app to use `@lit-labs/nextjs`, mirror the existing demo functionality, and move `ISSUE-5` into active work.

## Completed
- Moved `ISSUE-5` from `backlog` to `in-progress` and added a working plan for the Next.js baseline.
- Reworked `apps/boxes-nextjs` into a Pages Router example that mirrors the plain-web/React demo controls:
  - simple combobox
  - checkbox
  - multi-select
  - calendar picker
- Integrated `@lit-labs/nextjs` in the Next config and switched the Next config to ESM (`next.config.mjs`) so it works under the repo root `type: module`.
- Added a runtime alias from `@/boxes/*` to `dist/libs/boxes/*` in Next so the app can consume the built library output while TypeScript still reads source typings from `libs/boxes/src`.
- Added `^build` dependencies to the inferred Next `build` and `dev` targets so `boxes-nextjs` builds the library first.
- Updated the Next app TS config to include the generated `react.d.ts` and the library source files for typing.
- Expanded the `libs/boxes` React typing generator so the generated typings augment all relevant React JSX type surfaces:
  - `react`
  - `react/jsx-runtime`
  - global `JSX`
  This was necessary for Next’s `jsx: preserve` type-check path.
- Added a minimal `getServerSideProps` export so `/` is a true SSR route instead of static generation.
- Cleaned the Next app ESLint config so `next-env.d.ts` is ignored and the lint target passes.

## Current Status
- `ISSUE-5` remains `in-progress`.
- The Next.js comparison app is now working and can be used as the React SSR baseline for the broader SSR/hydration investigation.
- Verified SSR result:
  - the live HTML response includes the custom elements
  - the response also includes declarative shadow DOM templates produced by `@lit-labs/nextjs`
- Remaining caveat observed during verification:
  - the server-rendered shadow-root `<style>` tags currently contain `[object Object]` instead of actual CSS text
  - this is now a concrete SSR/style-serialization detail to keep in scope for the issue
- The Angular SSR/hydration repro still needs to be created and compared against this baseline.

## Plan Coverage
- Completed the Next.js SSR baseline setup.
- Completed the mirrored demo implementation.
- Completed verification that Lit deep SSR is active in Next.js.

## Files Changed
- `.issues/ISSUE-5/issue.md` - Moved the issue to `in-progress` and widened the scope to include the Next.js comparison baseline.
- `.issues/ISSUE-5/plan.md` - Added and updated the implementation plan for the Next.js baseline.
- `.issues/index.md` - Moved `ISSUE-5` into the `In Progress` section.
- `apps/boxes-nextjs/next.config.mjs` - Added `@lit-labs/nextjs`, kept Nx plugin integration, and aliased `@/boxes` to `dist/libs/boxes`.
- `apps/boxes-nextjs/project.json` - Added `^build` dependencies for `build` and `dev`.
- `apps/boxes-nextjs/tsconfig.json` - Added library typing inputs for the generated React typings and source references.
- `apps/boxes-nextjs/index.d.ts` - Added `*.scss?inline` typing support for included library source files.
- `apps/boxes-nextjs/eslint.config.mjs` - Ignored `next-env.d.ts` and removed the anonymous default export warning.
- `apps/boxes-nextjs/src/pages/_app.tsx` - Updated page metadata and simplified the wrapper.
- `apps/boxes-nextjs/src/pages/index.tsx` - Replaced the Nx starter page with the mirrored SSR demo and added `getServerSideProps`.
- `apps/boxes-nextjs/src/pages/styles.css` - Replaced the starter CSS with the shared demo layout/styles.
- `libs/boxes/generators/react.js` - Expanded the generated JSX type augmentation for Next compatibility.
- `libs/boxes/src/types/react.d.ts` - Regenerated with the wider JSX augmentation coverage.

## Verification
- `npx nx show project boxes-nextjs --json`
  - confirmed Nx now infers the Next targets correctly after switching away from the broken stock `next.config.js`
- `npx nx build boxes-nextjs`
  - passed
  - route output shows `/` as `ƒ` (dynamic, server-rendered on demand)
- `npx nx build boxes-react`
  - passed
  - confirms the widened generated React typings did not break the existing React app
- `npx nx lint boxes-nextjs`
  - passed
- Live SSR check:
  - ran `npx next start -p 4300` inside `apps/boxes-nextjs`
  - fetched `http://localhost:4300`
  - confirmed the HTML contains:
    - `boxes-combobox`
    - `boxes-checkbox`
    - `boxes-multi-select`
    - `boxes-calendar-picker`
    - `<template shadowroot="open" ...>` for each control
  - also confirmed the current style caveat:
    - the SSR `<style>` tags contain `[object Object]`

## Next Steps
- Build the Angular SSR/hydration repro so it can be compared directly against the verified Next.js baseline.
- Investigate whether the `[object Object]` style output is caused by:
  - the current `dist/libs/boxes` runtime import path
  - the Lit SSR / `@lit-labs/nextjs` serialization path
  - or another interaction in the Next/Web Component pipeline
- Feed the verified Next.js SSR findings into the slide deck work tracked under `ISSUE-10`.
