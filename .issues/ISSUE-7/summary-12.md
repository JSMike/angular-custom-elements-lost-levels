# Session 12

**Date:** 2026-03-15

**Prompt/Ask:** Fix the React warning about using `selected` on `<option>` in `apps/boxes-react/src/app/app.tsx`.

## Completed
- Removed the JSX `selected` attribute from the placeholder `<option>` in the React combobox demo.
- Kept the same baseline behavior because `boxes-combobox` already defaults to the first light-DOM option when no explicit default is marked.

## Current Status
- The React app no longer uses the discouraged JSX `selected` pattern for the combobox example.
- The initial combobox selection remains the blank placeholder option.

## Plan Coverage
- Minor follow-up on the React baseline consumer created under plan step 4.

## Files Changed
- `apps/boxes-react/src/app/app.tsx` - Removed the placeholder option’s `selected` attribute.

## Verification
- Ran `npx nx typecheck boxes-react`.
- Ran `npx nx build boxes-react`.

## Next Steps
- Continue using `boxes-react` as the non-Angular baseline while evaluating Angular authoring and tooling behavior.
