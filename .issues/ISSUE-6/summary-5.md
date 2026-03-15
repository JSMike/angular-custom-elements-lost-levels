# Session 5

**Date:** 2026-03-15

**Prompt/Ask:** Correct the sourcemap finding. The current result was too vague: the transpiled library files include `//# sourceMappingURL=...`, but the referenced path is not served to the browser. Inspect the Angular server and distinguish verified behavior from hypotheses.

## Completed
- Re-verified the current sourcemap chain with both the emitted artifacts and the live Angular dev server.
- Confirmed that `dist/libs/boxes/combo-box.js` ends with `//# sourceMappingURL=combo-box.js.map`.
- Confirmed that Angular's `dist/apps/boxes-angular/browser/main.js.map` embeds `dist/libs/boxes/*.js` as sources and includes `sourcesContent` for those transpiled library files.
- Confirmed the live Angular dev server serves `main.js.map` but does **not** serve the aliased library URLs:
  - `/dist/libs/boxes/combo-box.js` -> `404`
  - `/dist/libs/boxes/combo-box.js.map` -> `404`
- Inspected Angular's local build/dev-server code and found supporting evidence for why this happens:
  - the Vite dev-server `fs.allow` list explicitly includes `node_modules`, cache output, and asset sources
  - the Angular memory plugin serves generated application output files, not arbitrary `dist/libs/boxes/*` files
- Updated `ISSUE-6` to reflect the narrower, proven claim: the browser falls back to the transpiled library JS because the second-level sourcemap path is unavailable.
- Updated `README.md` with the same corrected explanation.

## Current Status
- `ISSUE-6` remains in progress.
- The sourcemap limitation is now documented in terms of the actual browser failure rather than an overly broad “stops at dist” statement.

## Plan Coverage
- Extended the existing documented outcome with live dev-server verification and a more accurate root-cause description.

## Files Changed
- `.issues/ISSUE-6/issue.md` - Replaced the vague sourcemap wording with the verified browser/dev-server behavior and clarified what remains unproven.
- `README.md` - Updated the aliasing/build-config section with the corrected sourcemap explanation.
- `.issues/ISSUE-6/summary-5.md` - Recorded this session.

## Verification
- `tail -n 5 dist/libs/boxes/combo-box.js`
- `npx nx build boxes`
- `npx nx build boxes-angular --configuration development`
- Parsed `dist/apps/boxes-angular/browser/main.js.map` and confirmed:
  - `dist/libs/boxes/combo-box.js` appears in `sources`
  - the corresponding `sourcesContent` contains the transpiled library JS plus `//# sourceMappingURL=combo-box.js.map`
- Live server checks against `http://127.0.0.1:4200`:
  - `/main.js.map` -> `200`
  - `/dist/libs/boxes/combo-box.js` -> `404`
  - `/dist/libs/boxes/combo-box.js.map` -> `404`
- Inspected local Angular source files:
  - `node_modules/@angular/build/src/builders/dev-server/vite/server.js`
  - `node_modules/@angular/build/src/tools/vite/plugins/angular-memory-plugin.js`
  - `node_modules/@angular/build/src/tools/esbuild/javascript-transformer.js`

## Next Steps
- If needed for the talk, capture a DevTools screenshot showing the transpiled `dist/libs/boxes/*.js` source and the absence of the original library TypeScript files.
- Keep the slide wording synchronized with this narrower verified explanation.
