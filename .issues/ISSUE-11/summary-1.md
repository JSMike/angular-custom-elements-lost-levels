# Session 1

**Date:** 2026-03-15

**Prompt/Ask:** Update `AI-README.md` to reflect the current project structure and include the Slidev build rule so `dist/` does not get overwritten.

## Completed
- Replaced the starter `AI-README.md` template with repo-specific guidance.
- Documented the current project purpose, active apps, library, slide deck, and issue-tracking layout.
- Added the main Nx and npm commands used in this workspace.
- Explicitly documented that agents must use `npm run slidev:build` instead of `npx slidev build slides.md`.
- Explained that the raw Slidev build command writes to the repo root `dist/` and can clobber Nx build outputs such as `dist/libs/boxes`.

## Current Status
- `ISSUE-11` is in review.
- The requested documentation update is complete.

## Plan Coverage
- Covered all plan items.

## Files Changed
- `AI-README.md` - Replaced the generic starter text with current repo-specific guidance and the Slidev output-path rule.
- `.issues/ISSUE-11/issue.md` - Recorded the request and moved the issue to review.
- `.issues/ISSUE-11/plan.md` - Marked the documentation plan complete.
- `.issues/ISSUE-11/summary-1.md` - Recorded this session.
- `.issues/index.md` - Added the new issue and moved it into review.

## Verification
- Read `AI-README.md` and confirmed it now documents:
  - `apps/boxes-web`
  - `apps/boxes-angular`
  - `libs/boxes`
  - `slides.md`
  - `npm run slidev:build`
  - the warning against `npx slidev build slides.md`
- Confirmed the Slidev rule matches the repo script in `package.json`:
  - `slidev:build`: `slidev build slides.md -o dist/slides --download=true`

## Next Steps
- If the repo structure changes again, keep `AI-README.md` synchronized so future agents do not fall back to the original starter assumptions.
