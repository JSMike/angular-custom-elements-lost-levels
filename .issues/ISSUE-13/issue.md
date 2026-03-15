# ISSUE-13: Normalize multi-select naming across the repo

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

Normalize the collection-select control naming to `multi-select` across the component library, consuming apps, generated artifacts, docs, slides, and issue notes so the repo uses one consistent term everywhere.

## Prompt

Rename the repo's collection-select control naming so `multi-select` is used consistently across selectors, folders, files, exports, and references.

## Requirements

- Rename the `libs/boxes` component folder and source files to `multi-select`.
- Update the custom-element selector and exported identifiers to use `multi-select` / `MultiSelect` naming consistently.
- Update all app imports, runtime registrations, generated type/manifest outputs, and any related pathing/config.
- Update repo docs, slide references, and issue notes that still use the old naming.
- Record the work in `.issues/` and verify the affected builds still pass.
