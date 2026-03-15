# Session 4

**Date:** 2026-03-15

**Prompt/Ask:** Detail the current repository's sourcemap issue more explicitly: Angular cannot use the original library sourcemaps when the Web Component library is aliased from `dist/`, and that should be reflected in the issue notes and a slide.

## Completed
- Expanded `ISSUE-6` so it now describes the real repository setup instead of a generic sourcemap complaint.
- Recorded the key alias chain:
  - `apps/boxes-angular/src/main.ts` imports `@/boxes/*`
  - `apps/boxes-angular/tsconfig.json` maps that alias to `dist/libs/boxes/*`
- Kept the previously verified facts about library sourcemaps and Angular vendor sourcemaps, then added the exact files still referenced by Angular's emitted `browser/main.js.map`.
- Re-verified that the Angular bundle map still stops at `dist/libs/boxes/*.js` while the library's own `.map` files point back to `libs/boxes/src/*`.

## Current Status
- `ISSUE-6` remains in progress.
- The current repo-specific debugging limitation is now documented clearly enough to reuse directly in the presentation deck.

## Plan Coverage
- Extended the documented outcome of the existing plan with more precise repository-level evidence.

## Files Changed
- `.issues/ISSUE-6/issue.md` - Expanded the current-session focus and known findings with the concrete dist-alias chain and emitted bundle-map entries.

## Verification
- `npx nx build boxes`
- `npx nx build boxes-angular --configuration development`
- Parsed `dist/libs/boxes/combobox.js.map` and confirmed it includes `../../../libs/boxes/src/combobox/combobox.ts`.
- Parsed `dist/apps/boxes-angular/browser/main.js.map` and confirmed its library-related entries still point only to:
  - `dist/libs/boxes/property-DhOurD-o.js`
  - `dist/libs/boxes/query-DMPvxsdM.js`
  - `dist/libs/boxes/combobox.js`
  - `dist/libs/boxes/checkbox.js`
  - `dist/libs/boxes/multi-select.js`
  - `dist/libs/boxes/calendar-picker.js`
- Confirmed the Angular bundle map does **not** include `libs/boxes/src/*`.

## Next Steps
- If needed, capture a DevTools screenshot that shows the debugger stopping in `dist/libs/boxes/*.js` rather than the original source.
- Keep the finding synchronized with the sourcemap slide as the deck evolves.
