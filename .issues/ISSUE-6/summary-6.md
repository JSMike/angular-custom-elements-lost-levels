# Session 6

**Date:** 2026-03-15

**Prompt/Ask:** Clarify whether the real sourcemap problem is that Angular ignores sourcemaps from the aliased library when `main.js` is bundled, and whether the abandoned `node_modules/@/boxes` workaround hypothesis was targeting that.

## Completed
- Verified the distinction between what Angular does preserve and what it loses in the current sourcemap chain.
- Confirmed the first-level app sourcemap is present: `main.js.map` includes `dist/libs/boxes/*.js` as sources and embeds their transpiled contents.
- Confirmed the second-level library sourcemap chain is where things fail: the embedded library JS still advertises `//# sourceMappingURL=...`, but the Angular dev server does not serve the corresponding `/dist/libs/boxes/*.js(.map)` URLs.
- Inspected Angular build/dev-server internals to separate verified behavior from the earlier `node_modules` workaround theory.

## Current Status
- `ISSUE-6` remains in progress.
- The accurate current explanation is: Angular does not fully ignore the aliased library during bundling, but it does fail to provide a usable path for the library's own sourcemaps in the browser.

## Plan Coverage
- Added a clarification layer to the existing sourcemap findings without changing the repository code.

## Files Changed
- `.issues/ISSUE-6/summary-6.md` - Recorded this clarification session.

## Verification
- Parsed `dist/apps/boxes-angular/browser/main.js.map` and confirmed it contains `dist/libs/boxes/*.js` plus `sourcesContent`.
- Confirmed `dist/libs/boxes/combo-box.js` includes `//# sourceMappingURL=combo-box.js.map`.
- Live server checks against `http://127.0.0.1:4200`:
  - `/main.js.map` -> `200`
  - `/dist/libs/boxes/combo-box.js` -> `404`
  - `/dist/libs/boxes/combo-box.js.map` -> `404`
- Inspected:
  - `node_modules/@angular/build/src/builders/dev-server/vite/server.js`
  - `node_modules/@angular/build/src/tools/vite/plugins/angular-memory-plugin.js`
  - `node_modules/@angular/build/src/tools/esbuild/javascript-transformer.js`

## Next Steps
- If needed, refine the slide further to distinguish “main bundle sourcemap exists” from “nested library sourcemap chain is unavailable.”
- If you want stronger proof around a `node_modules` comparison, the next step would be to build an isolated comparison path rather than rely on memory of earlier logs.
