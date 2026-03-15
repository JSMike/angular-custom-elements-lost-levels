# Session 1

**Date:** 2026-03-15

**Prompt/Ask:** Review the demo app copy and layout, align the shared content where it makes sense, keep framework-specific emphasis where helpful, and smooth out accidental stylesheet differences.

## Completed
- Aligned the three app surfaces around the same baseline story:
  - plain web shows native `FormData` before framework-specific integration,
  - React mirrors the plain web baseline with generated JSX typings,
  - Angular compares its reactive-form model against the same native `FormData`.
- Tightened the control descriptions so the shared baseline explanations read consistently across apps while Angular keeps the extra framework-specific emphasis where the mismatch matters.
- Updated the visible page titles so the browser tabs now follow the same `Boxes - <Framework>` pattern for Angular and React.
- Added the missing `demo-copy` treatment to `boxes-web` and brought the Angular field/checkbox spacing into line with the plain web and React apps.

## Current Status
- The three demo apps now read as one coherent set instead of three slightly divergent copies of the same content.
- `ISSUE-14` is ready for review.

## Plan Coverage
- Completed all planned comparison, copy-alignment, style-alignment, and verification steps.

## Files Changed
- `apps/boxes-web/index.html` - Aligned the intro and control captions with the shared baseline wording and added `demo-copy` classes.
- `apps/boxes-web/src/styles.scss` - Added the missing `demo-copy` style so copy spacing matches the other apps.
- `apps/boxes-angular/src/app/app.html` - Reframed the app intro and tightened the per-control copy while keeping Angular-specific emphasis where useful.
- `apps/boxes-angular/src/app/app.scss` - Aligned field spacing and checkbox row alignment with the other apps.
- `apps/boxes-angular/src/index.html` - Updated the page title to `Boxes - Angular`.
- `apps/boxes-react/src/app/app.tsx` - Aligned the intro and shared control captions with the updated baseline wording.
- `apps/boxes-react/index.html` - Updated the page title to `Boxes - React`.

## Verification
- Ran `npx nx build boxes-web`.
- Ran `npx nx build boxes-angular`.
- Ran `npx nx typecheck boxes-react`.
- Ran `npx nx build boxes-react`.

## Next Steps
- Await review and confirm whether the current copy balance between shared baseline wording and Angular-specific emphasis is the right tone for the repo.
