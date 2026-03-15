# ISSUE-12: Normalize combobox naming across the repo

<!-- Metadata -->
| Field        | Value        |
|--------------|--------------|
| Status       | done         |
| Owner        | TBD          |
| Complexity   | medium       |
| Created      | 2026-03-15   |
| Source       | user-request |
| External     |              |
| Blocks       |              |
| Blocked-by   |              |
| Priority     | medium       |

## Summary

Normalize the select-only control naming to `combobox` across the component library, consuming apps, generated artifacts, docs, slides, and issue notes so the repo uses one consistent term everywhere.

## Prompt

Rename the repo's select-only control naming so `combobox` is used consistently across selectors, folders, files, exports, and references.

## Requirements

- Rename the `libs/boxes` component folder and source files to `combobox`.
- Update the custom-element selector and exported identifiers to use `combobox` naming consistently.
- Update all app imports, runtime registrations, generated type/manifest outputs, and any related pathing/config.
- Update repo docs, slide references, and issue notes that still use the old naming.
- Record the work in `.issues/` and verify the affected builds still pass.
