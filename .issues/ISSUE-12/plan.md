# Plan

## Objective

Normalize the repo's select-only control naming to `combobox` without changing its behavior, and update every dependent source, generated artifact, and presentation reference accordingly.

## Steps

- [x] Find all `combo-box` / `ComboBox` / `boxes-combo-box` references that need a rename.
- [x] Rename the component folder, files, exports, selector constant, and internal identifiers in `libs/boxes`.
- [x] Update all app imports, usage sites, docs/slides, and issue notes to the new `combobox` naming.
- [x] Regenerate derived files and verify the affected Nx builds and checks.
- [x] Record the session summary and update the issue index.
