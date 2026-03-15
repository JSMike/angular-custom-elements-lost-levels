# Session 14

**Date:** 2026-03-15

**Prompt/Ask:** Update `boxes-react` so the web components are imported into `app.tsx` and the selector constants are used in JSX instead of hard-coded tag names.

## Completed
- Moved the custom-element module imports out of `src/main.tsx` and into `src/app/app.tsx`.
- Imported the selector constants from `@/boxes/*` and aliased them to JSX component variables:
  - `ComboboxTag`
  - `CheckboxTag`
  - `MultiSelectTag`
  - `CalendarPickerTag`
- Replaced the hard-coded custom-element tag names in the React JSX with those selector variables.
- Restored the React app TypeScript config to include `libs/boxes/src/**/*.ts` and `libs/boxes/src/**/*.d.ts` so the named imports from the source library type-check cleanly.

## Current Status
- The React app now registers and uses the `boxes` components directly from `app.tsx`.
- JSX no longer hard-codes the selector strings for the demo controls.

## Plan Coverage
- Minor follow-up on the React baseline consumer created under plan step 4.

## Files Changed
- `apps/boxes-react/src/app/app.tsx` - Imported the component modules and selector constants, then switched the JSX to use selector variables.
- `apps/boxes-react/src/main.tsx` - Removed the now-redundant side-effect imports.
- `apps/boxes-react/tsconfig.app.json` - Reinstated direct inclusion of `libs/boxes/src` so the named source imports type-check correctly.

## Verification
- Ran `npx nx typecheck boxes-react`.
- Ran `npx nx build boxes-react`.

## Next Steps
- Continue using `boxes-react` as the non-Angular baseline while evaluating Angular authoring and tooling behavior.
