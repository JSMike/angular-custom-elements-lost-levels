# AI Project Guide

## Required Reading

- Read `AI-WORKFLOW.md` before starting work.
- Check `.issues/` for an existing issue before creating a new one.

## Project Overview

This repository isolates Web Component integration issues that appear in Angular, verifies the same controls in a plain web baseline, and turns confirmed findings into Slidev presentation material.

The current repo has four main work areas:
- `libs/boxes` contains the form-associated custom elements used as repro fixtures.
- `apps/boxes-web` is the plain web baseline app.
- `apps/boxes-angular` is the Angular comparison app.
- `apps/boxes-react` is the React comparison app and typed-authoring baseline.

## Runtime & Tooling

- Primary runtime: Node.js
- Package manager: `npm`
- Workspace/build system: `Nx`
- Frameworks/tools in active use:
  - Angular in `apps/boxes-angular`
  - React in `apps/boxes-react`
  - Vite in `apps/boxes-web` and `libs/boxes`
  - Vite in `apps/boxes-react`
  - Lit in `libs/boxes`
  - Slidev via `slides.md`

## Repository Structure

- `apps/boxes-web/` - Plain web baseline harness for current `FormData` behavior.
- `apps/boxes-angular/` - Angular repro app that compares Angular form state with native `FormData`.
- `apps/boxes-react/` - React app that mirrors the baseline controls and consumes generated JSX typings from `libs/boxes`.
- `libs/boxes/` - Web Component library with FACE controls such as combobox, checkbox, multi-select, and calendar picker.
- `slides.md` - Main Slidev deck for confirmed findings and planned slide work.
- `.issues/` - Required issue-tracking record for all work.

## Common Commands

```bash
# serve the plain web baseline
npx nx serve boxes-web

# serve the Angular repro app
npx nx serve boxes-angular

# serve the React comparison app
npx nx serve boxes-react

# build the component library
npx nx build boxes

# build the plain web app
npx nx build boxes-web

# build the Angular app
npx nx build boxes-angular

# build the React app
npx nx build boxes-react

# lint the active projects
npx nx lint boxes
npx nx lint boxes-web
npx nx lint boxes-angular
npx nx lint boxes-react

# run the Slidev deck locally
npm run slidev

# build slides to dist/slides
npm run slidev:build
```

## Operational Notes

- `dist/` is shared across repo outputs. Do not treat it as disposable.
- `apps/boxes-angular` consumes the built library from `dist/libs/boxes` through the `@/boxes/*` path alias in `apps/boxes-angular/tsconfig.json`.
- The Angular app does not currently consume `libs/boxes/src/*` directly; the built output path is intentional in this repo.
- `apps/boxes-react` is different: it consumes `libs/boxes/src/*` directly through a Vite alias in `apps/boxes-react/vite.config.ts`.
- `apps/boxes-react/tsconfig.app.json` loads `../../libs/boxes/src/types/react.d.ts` and includes `../../libs/boxes/src/**/*.ts` so JSX can validate the custom-element selectors and props.
- The React app is the repo's current positive example for typed custom-element authoring, in contrast with Angular's `CUSTOM_ELEMENTS_SCHEMA` suppression path.
- The Angular browser build output lives under `dist/apps/boxes-angular/browser`.
- The plain web build output lives under `dist/apps/boxes-web`.
- The React build output lives under `dist/apps/boxes-react`.
- The library build output lives under `dist/libs/boxes`.

## Slidev Rule

- Always use `npm run slidev:build`.
- Do not use `npx slidev build slides.md`.
- The raw Slidev build command writes to the repo root `dist/` by default and can overwrite or clear Nx build outputs such as `dist/libs/boxes`, `dist/apps/boxes-web`, and `dist/apps/boxes-angular`.
- The repo script already sets `-o dist/slides`, which keeps slide output isolated.

## Notes for AI Agents

- Keep changes scoped to the active issue.
- Add a session summary after any work.
- If you change slide content, prefer `npm run slidev:build` for verification.
- If you change `libs/boxes` behavior, verify both the plain web baseline and the Angular comparison app when relevant.
- If you change generated typings or component exports in `libs/boxes`, also verify `apps/boxes-react` because it consumes library source directly and depends on `libs/boxes/src/types/react.d.ts`.
