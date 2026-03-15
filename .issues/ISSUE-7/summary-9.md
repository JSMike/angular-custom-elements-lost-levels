# Session 9

**Date:** 2026-03-15

**Prompt/Ask:** Investigate the React dev-server error from `@vitejs/plugin-react-swc` complaining about `@customElement(...)` in the `boxes` source.

## Completed
- Confirmed the failure was not a TypeScript project-file-list problem.
- Identified the real cause as the React Vite dev server using `@vitejs/plugin-react-swc` with TypeScript decorators disabled by default.
- Enabled `tsDecorators: true` in the React app’s Vite config so the dev transform can parse the Lit decorators in `libs/boxes/src`.

## Current Status
- `boxes-react` now works in both build mode and Vite dev-server mode while importing the `boxes` library from source.
- `ISSUE-7` remains in progress for the broader Angular IDE/tooling investigation.

## Plan Coverage
- This keeps the React baseline app usable for plan step 4 while comparing authoring/tooling behavior across frameworks.

## Files Changed
- `apps/boxes-react/vite.config.ts` - Enabled `tsDecorators` on the React SWC plugin.
- `.issues/ISSUE-7/summary-9.md` - Recorded this session.

## Verification
- Ran `npx nx build boxes-react`.
- Ran `npx nx serve boxes-react --host=localhost`.
- Fetched the transformed `app.tsx` and `libs/boxes/src/checkbox/checkbox.ts` modules from the running Vite dev server and confirmed the decorated source now compiles instead of throwing the earlier parser error.

## Next Steps
- Continue using `boxes-react` as the non-Angular baseline while evaluating Angular IDE/template-tooling behavior with the generated metadata.
