# Session 2

**Date:** 2026-03-15

**Prompt/Ask:** Turn the multi-select and calendar-picker placeholder slides into concrete issue slides after the demos were implemented.

## Completed
- Replaced the placeholder multi-select slide with a confirmed repro slide grounded in the observed Angular/native JSON mismatch.
- Replaced the placeholder calendar-picker slide with a confirmed repro slide grounded in the observed Angular/native JSON mismatch.
- Updated the deck's confirmed-repros table to include the new multi-select and calendar findings.
- Updated the active `ISSUE-9` note so the session focus matches the deck's current state.

## Current Status
- `ISSUE-9` remains in progress.
- The deck now contains confirmed slides for:
  - checkbox repro
  - multi-select repro
  - calendar-picker repro
  - monorepo sourcemap repro

## Plan Coverage
- Completed the multi-select repro slide.
- Completed the calendar-picker repro slide.
- Verified the deck still builds after replacing the placeholders.

## Files Changed
- `slides.md` - Replaced the planned multi-select/calendar content with confirmed issue slides and updated the repro matrix.
- `.issues/ISSUE-9/issue.md` - Updated the current session focus.
- `.issues/ISSUE-9/summary-2.md` - Recorded this session.

## Verification
- `npx slidev build slides.md`
- Confirmed the deck builds successfully with the updated repro slides.
- Confirmed the multi-select slide now reflects:
  - Angular form JSON: `{ "produceTags": "fresh" }`
  - native `FormData` JSON: `{ "produceTags": ["fresh", "organic"] }`
- Confirmed the calendar-picker slide now reflects:
  - Angular form JSON: `{ "deliveryDate": "" }`
  - native `FormData` JSON: `{ "deliveryDate": "2026-03-18" }`

## Next Steps
- Add screenshots or short recordings from the Angular repro app if you want the deck to read more like a talk than an engineering note set.
- Add a dedicated checkbox mismatch slide with the same side-by-side JSON treatment used for the new slides.
