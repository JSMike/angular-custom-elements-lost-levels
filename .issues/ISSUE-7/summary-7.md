# Session 7

**Date:** 2026-03-15

**Prompt/Ask:** The new `boxes-react` app showed that `name` is missing from the generated React typings because the FACE components do not expose `name` as a public writable property.

## Completed
- Added `name` as a reflected public property on all four FACE components: checkbox, combo-box, select-multiple, and calendar-picker.
- Removed the old read-only `get name()` accessors so the runtime API and generated typings now match native form-control expectations.
- Regenerated the package metadata outputs so `react.d.ts` now includes `name` for all four elements.

## Current Status
- The component APIs now expose `name` as a real writable property.
- The generated React typings include `name`, so the `boxes-react` example can pass `name` without a type error.
- `ISSUE-7` remains in progress for the broader Angular IDE/tooling investigation.

## Plan Coverage
- This was a follow-up refinement to the generator-backed package metadata work from plan steps 2 and 3.
- Step 4 remains pending.

## Files Changed
- `libs/boxes/src/checkbox/checkbox.ts` - Added `name` as a reflected public property.
- `libs/boxes/src/combo-box/combo-box.ts` - Added `name` as a reflected public property.
- `libs/boxes/src/select-multiple/select-multiple.ts` - Added `name` as a reflected public property.
- `libs/boxes/src/calendar-picker/calendar-picker.ts` - Added `name` as a reflected public property.
- `libs/boxes/src/types/react.d.ts` - Regenerated to include `name` on the custom-element props.
- `.issues/ISSUE-7/summary-7.md` - Recorded this session.

## Verification
- Ran `npx nx build boxes`.
- Ran `npx nx build boxes-react`.
- Ran `npx nx lint boxes`.
- Confirmed `libs/boxes/src/types/react.d.ts` includes `name` for the checkbox, combo-box, select-multiple, and calendar-picker entries.

## Next Steps
- Continue using the `boxes-react` app as the non-Angular baseline while evaluating Angular editor and template-tooling behavior.
