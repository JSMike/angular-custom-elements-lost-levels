# Session 14

**Date:** 2026-03-15

**Prompt/Ask:** Create multi-select and calendar FACE components, wire them into the plain-web and Angular demos, and confirm the Angular form issues.

## Completed
- Added `boxes-multi-select` as a form-associated multi-select control that submits repeated values under one field name while exposing a native-like scalar `value`.
- Added `boxes-calendar-picker` as a form-associated commit-style picker that updates form participation and dispatches `change` without `input`.
- Expanded `apps/boxes-web` into three separate baseline demos: the existing dependent combobox/checkbox flow, a multi-select demo, and a calendar-picker demo.
- Expanded `apps/boxes-angular` into three matching repro sections so Angular form JSON and native `FormData` JSON are visible side by side for each control.
- Updated the active `ISSUE-4` note so the tracked focus reflects the new confirmed repros instead of the earlier baseline-only work.

## Current Status
- `ISSUE-4` remains in progress overall.
- The repo now has confirmed Angular repros for:
  - checkbox-style `checked` semantics
  - multi-value FACE submission under one field name
  - commit-style `change`-only selection

## Plan Coverage
- Completed the new FACE control implementations.
- Completed the plain-web baseline updates.
- Completed the Angular repro updates.
- Verified the new mismatches in a browser against current Angular behavior.

## Files Changed
- `libs/boxes/src/multi-select/multi-select.ts` - Added the FACE multi-select control.
- `libs/boxes/src/multi-select/multi-select.scss` - Added multi-select styling.
- `libs/boxes/src/multi-select/index.ts` - Added the multi-select export entry.
- `libs/boxes/src/calendar-picker/calendar-picker.ts` - Added the FACE calendar picker control.
- `libs/boxes/src/calendar-picker/calendar-picker.scss` - Added calendar picker styling.
- `libs/boxes/src/calendar-picker/index.ts` - Added the calendar picker export entry.
- `apps/boxes-web/index.html` - Split the plain-web page into separate baseline demo sections.
- `apps/boxes-web/src/main.ts` - Added multi-form wiring and array-preserving `FormData` JSON serialization.
- `apps/boxes-web/src/styles.scss` - Added shared demo card/layout styling.
- `apps/boxes-angular/src/app/app.ts` - Added dedicated Angular form groups and native-form tracking for all three demos.
- `apps/boxes-angular/src/app/app.html` - Added separate Angular repro sections for checkbox, multi-select, and calendar picker.
- `apps/boxes-angular/src/app/app.scss` - Added layout styling for the expanded Angular demo page.
- `apps/boxes-angular/src/main.ts` - Registered the new custom elements in the Angular app.
- `.issues/ISSUE-4/issue.md` - Updated the current session focus for the issue.
- `.issues/ISSUE-4/summary-14.md` - Recorded this session.

## Verification
- `npx nx typecheck boxes`
- `npx nx build boxes`
- `npx nx lint boxes`
- `npx nx build boxes-web`
- `npx nx lint boxes-web`
- `npx nx build boxes-angular`
- `npx nx lint boxes-angular`
- Browser verification on `apps/boxes-web`:
  - selecting `Fresh` and `Organic` produced `{ "produceTags": ["fresh", "organic"] }`
  - selecting `Wed 18` produced `{ "deliveryDate": "2026-03-18" }`
- Browser verification on `apps/boxes-angular`:
  - selecting `Fresh` and `Organic` left Angular at `{ "produceTags": "fresh" }` while native `FormData` became `{ "produceTags": ["fresh", "organic"] }`
  - selecting `Wed 18` left Angular at `{ "deliveryDate": "" }` while native `FormData` became `{ "deliveryDate": "2026-03-18" }`
- `boxes` lint still reports the existing `no-explicit-any` warnings in `libs/boxes/vite.config.ts`; no new lint errors were introduced.

## Next Steps
- Add a dedicated checkbox slide with the same Angular/native JSON style used for the new repro slides.
- Decide whether the calendar picker should also be compared against native `<input type="date">` in the deck.
