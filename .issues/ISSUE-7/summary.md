# ISSUE-7 Completion Summary

Date: 2026-03-15

## Scope

Investigate Angular IDE and template-tooling support for custom elements, compare that experience with a non-Angular baseline, and determine whether generated typings or a Custom Elements Manifest can improve Angular authoring and validation.

## Delivered

- Added generator support in `libs/boxes` for:
  - `libs/boxes/src/types/react.d.ts`
  - `libs/boxes/src/custom-elements.json`
- Wired those generated artifacts into the `boxes` build and package outputs.
- Confirmed the React app can consume the generated JSX typings and validate custom-element selectors and props.
- Investigated Angular's compiler, template type-checking, and schema handling against the local Angular repo clone in `../angular`.
- Confirmed Angular only supports `CUSTOM_ELEMENTS_SCHEMA` and `NO_ERRORS_SCHEMA` in its current schema pipeline.
- Confirmed `CUSTOM_ELEMENTS_SCHEMA` is a suppression mechanism and does not ingest typed custom-element metadata from `.d.ts` files or `custom-elements.json`.
- Proved that Angular-side proxy directives can restore typed template validation, then reverted that proof from the app so the repo continues to show the real Angular integration path.
- Updated the presentation deck with a separate tooling/IDE section and an upstream proposal focused on manifest-backed metadata rather than broader suppression.

## Key Findings

- Angular template tooling is driven by Angular directive metadata and the DOM schema registry, not by ambient custom-element typings.
- A generated `react.d.ts` works well in React because JSX can consume `JSX.IntrinsicElements` augmentation directly.
- A generated `custom-elements.json` is useful as standard metadata, but Angular does not currently consume it for template diagnostics or language-service completions.
- The current Angular workaround is an Angular-specific shim layer such as proxy directives, but that is not an appropriate default burden for a framework-agnostic Web Component library.
- The stronger upstream direction is first-class manifest-backed custom-element metadata in Angular's compiler and language service.

## Verification

- `npx nx build boxes`
- `npx nx build boxes-react`
- `npx nx build boxes-angular`
- `npm run slidev:build`
  - Builds `dist/slides`, then still exits non-zero at export in this environment because `playwright-chromium` is not installed.

## Outcome

`ISSUE-7` is complete. The repo now contains:
- a working React typed-authoring baseline,
- documented Angular tooling limitations,
- a validated but intentionally non-adopted proxy-directive workaround,
- and slide-ready material for discussion with the Angular team.
