# Session 2

**Date:** 2026-03-15

**Prompt/Ask:** Add a more specific slide for the current `ISSUE-6` sourcemap limitation in this repository, tied to the slide follow-on work.

## Completed
- Moved `ISSUE-10` from backlog to in-progress because slide follow-on work has started.
- Updated the `ISSUE-10` plan to mark the current confirmed findings from `ISSUE-4` and `ISSUE-6` as collected and slide-ready.
- Reworked the sourcemap slide in `slides.md` so it now describes the real monorepo setup:
  - Angular imports `@/boxes/*`
  - the alias resolves to `dist/libs/boxes/*`
  - the library emits sourcemaps
  - Angular vendor sourcemaps are enabled
  - the Angular bundle map still stops at `dist/libs/boxes/*.js`
- Updated the confirmed-repros table so the sourcemap finding explicitly mentions the aliased dist output rather than a generic sourcemap failure.
- Updated the issue index to reflect that `ISSUE-10` is now active.

## Current Status
- `ISSUE-10` is in progress.
- The deck now has a stronger `ISSUE-6` slide grounded in the actual repository configuration.

## Plan Coverage
- Completed the first two plan steps by collecting the current confirmed findings and turning them into slide-ready material.

## Files Changed
- `slides.md` - Strengthened the monorepo sourcemap slide and updated the confirmed-repros table.
- `.issues/ISSUE-10/issue.md` - Marked the issue in progress and added the current slide focus.
- `.issues/ISSUE-10/plan.md` - Marked the first two plan steps complete.
- `.issues/ISSUE-10/summary-2.md` - Recorded this session.
- `.issues/index.md` - Moved `ISSUE-10` into the in-progress section.

## Verification
- `npx slidev build slides.md`
- Confirmed the deck builds successfully after the sourcemap-slide update.
- Confirmed the sourcemap slide now calls out both the alias configuration and the observed bundle-map result.

## Next Steps
- Add screenshots or concise code excerpts for the `ISSUE-4` and `ISSUE-6` slides if the deck needs to read more like a finished talk than an engineering note set.
- Expand the deck as `ISSUE-5`, `ISSUE-7`, and `ISSUE-8` produce confirmed findings.
