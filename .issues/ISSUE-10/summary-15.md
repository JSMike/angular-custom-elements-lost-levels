# Session 15

**Date:** 2026-03-17

**Prompt/Ask:** Rewrite slides 6-9 so the forms section is more inclusive of Angular's other built-in directives, shows the harness result with `ngDefaultControl`, and ends with two proposal paths.

## Completed

- Reworded slide 6 so the closing paragraph no longer names only three built-in accessors and instead frames the point more broadly.
- Reworked slide 7 into a harness-results slide that shows what happens when all four FACE controls are wired through `ngDefaultControl`.
- Reworked slide 8 into a broader inventory of built-in value-accessor directives that do not have a similar custom-element opt-in path.
- Reworked slide 9 into two proposal paths:
  - add opt-in attribute selectors to existing built-in directives
  - add a configurable directive for controls that do not match existing accessor patterns cleanly

## Current Status

- The forms section now presents the current Angular surface more fairly while keeping the repo's FACE repros central.
- `ISSUE-10` remains `in-progress`.

## Plan Coverage

- Continued deck refinement and alignment with the underlying Angular forms findings.

## Files Changed

- `slides/slides.md` - Reworked slides 6-9 in the forms section.
- `.issues/ISSUE-10/summary-15.md` - Recorded this session.

## Verification

- Ran `npm run slidev:build`.
- Confirmed Slidev built successfully to `dist/slides`.
- Read back the updated section in [slides/slides.md](/home/mcebrian/dev/angular-web-component-integration/slides/slides.md) and confirmed the requested restructuring is present.

## Next Steps

- Continue refining the wording and pacing of the deck under `ISSUE-10` as presentation prep continues.
