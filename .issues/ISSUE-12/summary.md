# ISSUE-12 Completion Summary

Date: 2026-03-15

## Scope

Normalize the select-only control naming to `combobox` across the repository.

## Delivered

- Renamed the component folder and source files under `libs/boxes/src/combobox`.
- Updated the custom-element selector to `boxes-combobox`.
- Updated exported identifiers to `Combobox`, `ComboboxEl`, and related `combobox` naming.
- Updated the plain web, Angular, and React apps to use the new imports and selectors.
- Regenerated derived artifacts including `react.d.ts` and `custom-elements.json`.
- Updated slides, docs, and issue notes to remove the old `combo-box` naming.

## Verification

- `npx nx typecheck boxes`
- `npx nx build boxes`
- `npx nx build boxes-web`
- `npx nx build boxes-angular`
- `npx nx typecheck boxes-react`
- `npx nx build boxes-react`
- `npm run slidev:build`
  - Built `dist/slides`, then hit the existing Playwright export dependency issue.

## Outcome

The repo now uses `combobox` consistently for the select-only control.
