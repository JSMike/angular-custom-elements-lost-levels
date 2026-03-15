# Session 5

**Date:** 2026-03-15

**Prompt/Ask:** Ensure the slides explicitly state the verified sourcemap claim and that the root cause is still unknown.

## Completed
- Updated the confirmed-repros table so the sourcemap row now distinguishes verified browser behavior from the unresolved internal cause.
- Updated the sourcemap slide to label the two proven facts as verified claims:
  - Angular's `main.js.map` embeds transpiled `dist/libs/boxes/*.js`
  - the Angular dev server does not serve the matching `/dist/libs/boxes/*.js(.map)` URLs
- Added an explicit bullet stating that the root cause is still unknown and only a serving/resolution gap is currently proven.
- Tightened the slide takeaway so it now says the browser only gets the transpiled library JavaScript and the exact Angular root cause is still under investigation.

## Current Status
- `ISSUE-10` remains in progress.
- The sourcemap slide now separates verified behavior from unverified explanation in a way that is safer to present.

## Plan Coverage
- Continued refining confirmed findings into audience-facing slide content.

## Files Changed
- `slides.md` - Updated the sourcemap row, slide bullets, and takeaway to distinguish verified claims from the unknown root cause.
- `.issues/ISSUE-10/summary-5.md` - Recorded this session.

## Verification
- Read `slides.md` and confirmed the sourcemap slide now explicitly says the root cause is still unknown.
- Ran `npm run slidev:build` per repo guidance.
- Result: Slidev generated output under `dist/slides`, but the command still exited non-zero because the current script's export step requires `playwright-chromium` in this environment.

## Next Steps
- If needed, keep tightening slide phrasing anywhere it drifts from verified observations into inferred internal behavior.
- If you want clean Slidev build verification, install the required Playwright package for the export step or adjust the script separately.
