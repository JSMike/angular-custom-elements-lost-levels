# Session 11

**Date:** 2026-03-14

**Prompt/Ask:** Move `boxes-web` under `apps/`, update the related pathing/config, and implement a similar dependent form in `apps/boxes-angular`.

## Completed
- Moved the plain web harness from `app/boxes-web` to `apps/boxes-web`.
- Added explicit Nx targets for `boxes-web` and updated its Vite output/cache paths.
- Fixed the moved Vite app's stricter TypeScript build path by switching it to bundler module resolution, adding a `*.scss?inline` declaration, and cleaning up the live `FormData` rendering code.
- Replaced the Angular welcome scaffold with a dependent FACE form that mirrors the plain web baseline.
- Added side-by-side Angular form JSON and native `FormData` JSON output in the Angular app.
- Wired the Angular app to consume the built `dist/libs/boxes` entrypoints so Angular can load the custom elements without hitting the raw Vite `?inline` imports.
- Removed the leftover generated `nx-welcome.ts` so the Angular build is clean.

## Current Status
- `ISSUE-4` remains in progress overall.
- The repo now has both a plain web baseline and a working Angular reproduction app.
- The Angular app clearly shows the checkbox binding mismatch: Angular tracks the custom checkbox through `value`, while native submission depends on `checked`.

## Plan Coverage
- Completed the repo layout cleanup for the plain web harness.
- Implemented the first Angular consumer app with the same dependent form flow.
- Verified the Angular app against the intended reproduction behavior.

## Files Changed
- `apps/boxes-web/project.json` - Added explicit Nx targets for the moved Vite app.
- `apps/boxes-web/vite.config.ts` - Updated cache and output paths to `apps/`.
- `apps/boxes-web/tsconfig.json` - Switched the app to bundler module resolution.
- `apps/boxes-web/tsconfig.app.json` - Included ambient declaration files.
- `apps/boxes-web/src/main.ts` - Tightened TypeScript handling around the live `FormData` JSON rendering.
- `apps/boxes-web/src/vite-env.d.ts` - Declared `*.scss?inline` modules for the Vite app typecheck path.
- `apps/boxes-angular/src/main.ts` - Registered the custom elements from the built library output.
- `apps/boxes-angular/tsconfig.json` - Redirected the `@/boxes/*` alias to `dist/libs/boxes/*` for Angular.
- `apps/boxes-angular/src/app/app.ts` - Implemented the Angular reactive-form reproduction and live state rendering.
- `apps/boxes-angular/src/app/app.html` - Replaced the scaffold template with the dependent form UI and state panels.
- `apps/boxes-angular/src/app/app.scss` - Added app-level layout and result styling.
- `apps/boxes-angular/src/styles.scss` - Added global Angular app styling.
- `apps/boxes-angular/src/app/nx-welcome.ts` - Deleted the unused generated component.
- `README.md` - Updated current-state references to the moved web app and the new Angular app.
- `.issues/ISSUE-4/plan.md` - Updated the issue plan to reflect the current phase.
- `.issues/ISSUE-4/summary-11.md` - Recorded this session.

## Verification
- `npx nx build boxes-web`
- `npx nx lint boxes-web`
- `npx nx build boxes-angular`
- `npx nx lint boxes-angular`
- Browser verification against `http://localhost:4202`:
  - Confirmed the Angular app mirrors the family -> produce -> confirmation flow.
  - Confirmed selecting `citrus` then `lemon` updates both Angular JSON and native `FormData` JSON for the comboboxes.
  - Confirmed checking the custom checkbox produces divergent state: Angular JSON remained `confirmedProduce: ""` while native `FormData` included `confirmedProduce: "confirmed"`.
  - Confirmed unchecking the custom checkbox produced the opposite divergence: Angular JSON showed `confirmedProduce: "confirmed"` while native `FormData` dropped the field.
  - Confirmed changing produce from `lemon` to `orange` updated the confirmation label but left the checkbox checked, with Angular JSON reset to `""` while native `FormData` still contained `confirmedProduce: "confirmed"`.

## Next Steps
- Decide whether the next Angular repro should stay on `ngDefaultControl` only or also add a custom `ControlValueAccessor` comparison.
- Capture this checkbox behavior in the slide material as the clearest example of Angular binding to `value` instead of `checked`.
