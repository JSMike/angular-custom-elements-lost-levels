# Session 15

**Date:** 2026-03-15

**Prompt/Ask:** Use the exported selector strings directly in `boxes-react` instead of aliasing them to `*Tag` names.

## Completed
- Removed the `*Tag` aliases from the `@/boxes/*` imports in `apps/boxes-react/src/app/app.tsx`.
- Updated the React JSX to use the exported selector strings directly:
  - `Combobox`
  - `Checkbox`
  - `MultiSelect`
  - `CalendarPicker`

## Current Status
- The React app still imports the custom-element modules directly in `app.tsx`.
- JSX now uses the exported selector strings without the extra alias layer.

## Plan Coverage
- Minor follow-up on the React baseline consumer created under plan step 4.

## Files Changed
- `apps/boxes-react/src/app/app.tsx` - Removed the `*Tag` aliases and used the exported selector strings directly in JSX.

## Verification
- Ran `npx nx typecheck boxes-react`.
- Ran `npx nx build boxes-react`.

## Next Steps
- Continue using `boxes-react` as the non-Angular baseline while evaluating Angular authoring and tooling behavior.
