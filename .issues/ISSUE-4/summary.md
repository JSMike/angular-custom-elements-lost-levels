# Summary: ISSUE-4 - Investigate Angular forms with form-associated custom elements

## Completed
2026-03-14 to 2026-03-15 by Codex

## What Was Done
- Built a baseline `boxes` FACE component set around the Angular forms investigation, including:
  - `boxes-combobox`
  - `boxes-checkbox`
  - `boxes-multi-select`
  - `boxes-calendar-picker`
- Created a plain web baseline app in `apps/boxes-web` that shows the browser's current `FormData` for each control.
- Created an Angular consumer app in `apps/boxes-angular` that shows Angular reactive-form JSON next to native `FormData` for the exact same controls.
- Verified the simple combobox works as the control group while the other controls expose Angular mismatches:
  - checkbox: Angular keeps the last scalar value after uncheck while native `FormData` drops the field
  - multi-select: Angular keeps one scalar value while native `FormData` submits a collection
  - calendar picker: Angular stays stale when the control emits a legitimate commit-style `change` without `input`
- Documented the issue evolution through iterative sessions, including component semantics, demo simplification, and presentation framing.
- Closed the issue after the user accepted the examples and asked to move it to `done`.

## Files Changed
- `libs/boxes/src/combobox/*` - Added and refined the FACE select-only combobox baseline.
- `libs/boxes/src/checkbox/*` - Added a FACE checkbox repro control.
- `libs/boxes/src/multi-select/*` - Added a FACE multi-select repro control.
- `libs/boxes/src/calendar-picker/*` - Added a FACE calendar-picker repro control.
- `libs/boxes/src/index.ts` and related library entrypoints - Exported the new controls.
- `apps/boxes-web/*` - Built and simplified the plain web baseline app.
- `apps/boxes-angular/*` - Built and simplified the Angular repro app with side-by-side JSON output.
- `.issues/ISSUE-4/issue.md` - Recorded the investigation scope and final done status.
- `.issues/ISSUE-4/plan.md` - Captured the implementation approach.
- `.issues/ISSUE-4/summary-1.md` through `.issues/ISSUE-4/summary-17.md` - Recorded the iterative implementation and verification sessions.
- `.issues/ISSUE-4/summary.md` - Recorded final completion.
- `.issues/index.md` - Reflected the issue lifecycle change.

## Key Decisions Made
- Use a working combobox as the control-group example instead of trying to force every repro through a single control.
- Keep best-practice event semantics per control rather than mutating components just to trigger Angular failures.
- Separate plain web and Angular examples so native platform behavior and Angular behavior are directly comparable.

## Deviations from Plan
- The demos evolved from an initially dependent-field flow into isolated repros because the simpler structure made the Angular failures clearer and more defensible.

## Acceptance Criteria Results
- [x] Create a minimal Angular reproduction using FACE controls and baseline fixtures.
- [x] Compare Angular behavior with the plain web baseline.
- [x] Test value propagation, form submission behavior, and related control semantics.
- [x] Document whether Angular still requires custom bridging beyond platform form participation.
- [x] Capture findings in a format that can become presentation slides.

## Artifacts
- Demo apps: `apps/boxes-web`, `apps/boxes-angular`
- Supporting slide work: `ISSUE-9`

## Notes
- Additional slide polishing for the findings in `ISSUE-4` now belongs in follow-on presentation work rather than this engineering investigation issue.
