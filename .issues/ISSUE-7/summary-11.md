# Session 11

**Date:** 2026-03-15

**Prompt/Ask:** Update `boxes-react` to mirror the other apps, keep it consuming `libs/boxes` directly instead of `dist/`, and align the Vite setup with the existing React Vite reference app rather than relying on a custom transform plugin.

## Completed
- Expanded `boxes-react` so it now mirrors the plain web and Angular apps with four standalone demos: simple combobox, checkbox, multi-select, and calendar picker.
- Kept the React app on direct source consumption of `@/boxes/*` from `libs/boxes/src/*` instead of routing through `dist/`.
- Simplified `apps/boxes-react/vite.config.ts` back to the reference pattern:
  - explicit source alias for `@/boxes/*`,
  - `tsDecorators: true`,
  - `useDefineForClassFields = false`,
  - no custom pre-transform plugin.
- Reworked the internal Lit state fields in `libs/boxes` from `@state accessor` to plain `@state` fields so the library source can be consumed cleanly by the React Vite app using the standard SWC plugin configuration.
- Updated the React app TypeScript project config to use the generated React typings plus a project reference to `libs/boxes`.

## Current Status
- `boxes-react` now mirrors the other demo apps and consumes `libs/boxes` directly in both type-checking and runtime development.
- The React app configuration is now consistent with the approach used in `../box-model.ui/apps/box-model-web-vite`.
- `ISSUE-7` remains in progress for the actual Angular IDE/template-tooling evaluation work.

## Plan Coverage
- Supports plan step 4 by establishing a clean non-Angular baseline consumer that uses the generated React typings and source library directly.

## Files Changed
- `apps/boxes-react/src/main.tsx` - Registered the `boxes` custom elements used by the React demos.
- `apps/boxes-react/src/app/app.tsx` - Replaced the scaffold with the full React baseline app mirroring the other demos.
- `apps/boxes-react/src/styles.scss` - Added the baseline demo styling for the React app.
- `apps/boxes-react/tsconfig.app.json` - Switched to the generated React typings plus a project reference to `libs/boxes`.
- `apps/boxes-react/vite.config.ts` - Simplified the Vite config to the standard React SWC + source alias setup.
- `libs/boxes/src/combobox/combobox.ts` - Replaced `@state accessor` fields with plain `@state` fields.
- `libs/boxes/src/multi-select/multi-select.ts` - Replaced `@state accessor` fields with plain `@state` fields.
- `libs/boxes/src/calendar-picker/calendar-picker.ts` - Replaced `@state accessor` fields with plain `@state` fields.

## Verification
- Ran `npx nx typecheck boxes`.
- Ran `npx nx build boxes`.
- Ran `npx nx typecheck boxes-react`.
- Ran `npx nx lint boxes-react`.
- Ran `npx nx build boxes-react`.
- Ran `npx nx serve boxes-react --host=localhost`.
- Fetched `http://localhost:4300/src/main.tsx` and confirmed the React app resolves `@/boxes/*` to `/@fs/.../libs/boxes/src/*`.
- Fetched the served library modules for `libs/boxes/src/checkbox/checkbox.ts` and `libs/boxes/src/combobox/combobox.ts` from the Vite dev server and confirmed they are transformed and served successfully from source.

## Next Steps
- Use the React app as the non-Angular baseline while evaluating Angular editor and template-tooling behavior against the generated `react.d.ts` and `custom-elements.json` outputs.
