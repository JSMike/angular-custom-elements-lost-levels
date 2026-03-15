# Session 8

**Date:** 2026-03-15

**Prompt/Ask:** Implement the scaffolded `apps/boxes-angular-ssr` app, get it as far as possible toward a working Angular SSR comparison app, and try to apply `@lit-labs/ssr`/`@lit-labs/ssr-client` directly in `src/server.ts`.

## Completed
- Replaced the starter Angular SSR app shell with the same four demo sections used in the other apps:
  - simple combobox
  - checkbox control
  - multi-select control
  - calendar picker
- Added the Angular demo logic, styles, titles, and built-library imports to `apps/boxes-angular-ssr`.
- Wired `@lit-labs/ssr-client/lit-element-hydrate-support.js` into the Angular SSR browser entry before the custom elements are registered.
- Updated the Angular SSR project config to:
  - build against `dist/libs/boxes/*`
  - depend on `boxes:build`
  - allow local SSR requests for `localhost` and `127.0.0.1`
- Implemented a best-effort Lit SSR response transform in `apps/boxes-angular-ssr/src/server.ts` that:
  - installs Lit's DOM shim with `installWindowOnGlobal()`
  - loads the built `boxes` modules on the server
  - intercepts the HTML response from Angular SSR
  - rewrites `boxes-combobox`, `boxes-checkbox`, `boxes-multi-select`, and `boxes-calendar-picker` with declarative shadow DOM
  - preserves the original light DOM children
- Identified and resolved the runtime incompatibility between the manual SSR transform and the built library bundle by externalizing `lit/*` from the `libs/boxes` Vite build. This allows the built library and `@lit-labs/ssr` to share the same Lit runtime.

## Current Status
- `apps/boxes-angular-ssr` now builds and serves successfully with Angular SSR.
- Over the wire, the Angular SSR response now includes:
  - the Angular-rendered app shell
  - declarative shadow DOM for all four custom elements
  - full checkbox shadow content
  - shell-only shadow content for the child-driven controls
- The Angular SSR app hydrates in the browser without console errors.
- After hydration, interactions still reproduce the same Angular-vs-native form mismatches as the client-only Angular app:
  - combobox tracks correctly in Angular and native form data
  - checkbox shows the Angular/custom-checkbox mismatch
  - multi-select keeps only one scalar string in Angular while native `FormData` keeps the repeated values
  - calendar updates native `FormData` while Angular remains empty
- Remaining limitation:
  - `boxes-combobox`, `boxes-multi-select`, and `boxes-calendar-picker` cannot fully deep-SSR their option-driven content because their option state is derived from light DOM in `firstUpdated()`, not before server render.

## Plan Coverage
- Completed the Angular SSR app alignment.
- Completed the best-effort Lit SSR response transform.
- Completed build, over-the-wire HTML, and browser hydration verification.

## Files Changed
- `apps/boxes-angular-ssr/src/app/app.ts` - mirrored the Angular demo logic for the SSR app.
- `apps/boxes-angular-ssr/src/app/app.html` - mirrored the Angular demo template for the SSR app.
- `apps/boxes-angular-ssr/src/app/app.scss` - aligned component styles with the Angular client app.
- `apps/boxes-angular-ssr/src/styles.scss` - aligned global styles with the Angular client app.
- `apps/boxes-angular-ssr/src/main.ts` - loaded Lit hydration support and the built custom elements in the browser entry.
- `apps/boxes-angular-ssr/src/server.ts` - added the manual Lit SSR response transform.
- `apps/boxes-angular-ssr/tsconfig.json` - pointed `@/boxes/*` to `dist/libs/boxes/*`.
- `apps/boxes-angular-ssr/project.json` - added `boxes:build` dependencies and allowed local SSR hosts.
- `apps/boxes-angular-ssr/src/index.html` - aligned the document title.
- `libs/boxes/vite.config.ts` - externalized `lit/*` so the built library works with `@lit-labs/ssr`.
- `.issues/ISSUE-5/plan.md` - updated the active plan for the Angular SSR work.

## Verification
- `npx nx build boxes-angular-ssr --configuration development`
- `PORT=4410 node dist/apps/boxes-angular-ssr/server/server.mjs`
- `curl -s http://localhost:4410/`
  - confirmed the response includes Angular SSR markup and `<template shadowroot...>` for all four controls
- Browser check with Playwright against `http://localhost:4410/`
  - Angular hydrated successfully with 0 console errors
  - selecting `Blueberry` updated both Angular and native JSON
  - checking the custom checkbox produced `"confirmedProduce": "confirmed"` in both JSON panels for that checked state
  - selecting `Fresh` + `Organic` produced only `"fresh"` in Angular JSON but both values in native JSON
  - choosing `Wed 18` updated the native `deliveryDate` JSON while Angular stayed empty

## Next Steps
- Decide whether the current best-effort Angular SSR result is sufficient for the presentation, or whether you want to push further on full option-driven SSR for the combobox and multi-select controls.
- Capture the Angular SSR findings in the slide deck under the SSR topic, clearly separating:
  - the working Next baseline
  - the Angular SSR host/hydration configuration needed to get this far
  - the remaining limitation for child-driven Lit controls rendered through the manual server transform
