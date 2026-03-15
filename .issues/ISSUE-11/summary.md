# ISSUE-11 Completion Summary

Date: 2026-03-15

## Scope

Update `AI-README.md` so it reflects the current repository structure, operational rules, and build guidance for future AI agents.

## Delivered

- Replaced the starter AI guide with repo-specific guidance.
- Documented the current project purpose and the active work areas:
  - `libs/boxes`
  - `apps/boxes-web`
  - `apps/boxes-angular`
  - `apps/boxes-react`
  - `slides.md`
- Added the common Nx and npm commands used in the workspace.
- Documented the critical Slidev rule to use `npm run slidev:build` instead of `npx slidev build slides.md`.
- Explained why the raw Slidev command is unsafe in this repo.
- Added React-specific notes:
  - `apps/boxes-react` consumes `libs/boxes/src/*` directly through a Vite alias
  - it uses `libs/boxes/src/types/react.d.ts` for JSX validation
  - it should be verified when generated typings or component exports change

## Verification

- Read back `AI-README.md` and confirmed it documents the current app/library layout, repo commands, and the Slidev output-path rule.

## Outcome

`AI-README.md` now reflects the current repo structure and is no longer missing the React app or the Slidev safeguard.
