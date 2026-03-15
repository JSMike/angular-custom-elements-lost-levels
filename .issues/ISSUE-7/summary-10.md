# Session 10

**Date:** 2026-03-15

**Prompt/Ask:** Investigate the Lit runtime warning in `boxes-react` about class field shadowing and confirm whether the React Vite plugin needs a class-fields override when consuming web-component source.

## Completed
- Confirmed this is the React Vite/SWC class-fields issue, not a `tsconfig` issue.
- Updated `apps/boxes-react/vite.config.ts` so the React SWC plugin:
  - enables TypeScript decorators,
  - uses SWC for build as well as dev,
  - forces `useDefineForClassFields = false` for the imported web-component source.
- Verified the served `libs/boxes/src/checkbox/checkbox.ts` transform now compiles class fields as constructor assignments instead of `_define_property(...)`.

## Current Status
- `boxes-react` no longer uses the Lit-incompatible class-field transform for the source `boxes` components.
- The React baseline app remains usable while importing the library from source.
- `ISSUE-7` remains in progress for the broader Angular IDE/tooling investigation.

## Plan Coverage
- This is supporting setup for plan step 4 by keeping the React baseline app stable and avoiding a React-specific false positive unrelated to Angular tooling.

## Files Changed
- `apps/boxes-react/vite.config.ts` - Enabled the React SWC decorator parser and forced Lit-compatible class-field output.
- `.issues/ISSUE-7/summary-10.md` - Recorded this session.

## Verification
- Ran `npx nx build boxes-react`.
- Ran `npx nx serve boxes-react --host=localhost`.
- Fetched the transformed `libs/boxes/src/checkbox/checkbox.ts` module from the running Vite dev server and confirmed the output uses `this.checked = false` style assignments rather than `_define_property(...)`.

## Next Steps
- Keep `boxes-react` as the non-Angular baseline while comparing Angular authoring/tooling behavior against a framework that can consume the generated metadata cleanly.
