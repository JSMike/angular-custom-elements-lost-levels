# Session 3

**Date:** 2026-03-14

**Prompt/Ask:** Do not route `@/boxes` through `node_modules`; treat the sourcemap failure inside the same monorepo as part of the presentation material, and add that finding to the README and issues.

## Completed
- Kept the monorepo consumption path intact instead of trying to force `@/boxes` through `node_modules`.
- Documented the sourcemap limitation in the root README under the aliasing/build-config section.
- Added the finding directly to `ISSUE-6` as a known current result.
- Updated the `ISSUE-6` plan to capture the verified outcome: Angular still stops at `dist/libs/boxes/*.js` instead of remapping to `libs/boxes/src/*`.

## Current Status
- `ISSUE-6` remains in progress.
- The repo now explicitly records this as a monorepo-specific Angular limitation that can be used in the slide deck.

## Plan Coverage
- Captured the debug-path verification result and documented it as an issue outcome instead of continuing to work around it.

## Files Changed
- `README.md` - Added the current sourcemap limitation to the repo status and aliasing/build-config section.
- `.issues/ISSUE-6/issue.md` - Added the verified sourcemap limitation under known findings.
- `.issues/ISSUE-6/plan.md` - Updated the plan to reflect the verified Angular sourcemap outcome.
- `.issues/ISSUE-6/summary-3.md` - Recorded this session.

## Verification
- Confirmed `libs/boxes` emits `.js.map` files in `dist/libs/boxes`.
- Confirmed `apps/boxes-angular` development builds emit `browser/main.js.map`.
- Parsed `dist/apps/boxes-angular/browser/main.js.map` and verified its library-related entries still point to:
  - `dist/libs/boxes/property-DhOurD-o.js`
  - `dist/libs/boxes/combobox.js`
  - `dist/libs/boxes/checkbox.js`
- Confirmed the Angular build map does **not** contain `libs/boxes/src/*`.

## Next Steps
- Decide whether this should be presented strictly as a limitation, or whether a separate package-based comparison app should be added later to show the contrast.
- If needed, capture screenshots from Chrome DevTools to support the slide narrative.
