# ISSUE-16: Eliminate initial Lit update warnings in child-driven controls

<!-- Metadata -->
| Field        | Value            |
|--------------|------------------|
| Status       | backlog          |
| Owner        | TBD              |
| Complexity   | small            |
| Created      | 2026-03-15       |
| Source       | user-request     |
| External     |                  |
| Blocks       |                  |
| Blocked-by   |                  |
| Priority     | medium           |

## Summary

Remove the Lit development warnings emitted by `boxes-combobox`, `boxes-multi-select`, and `boxes-calendar-picker` when they schedule a second update after the first render because their light-DOM option sync currently runs in `firstUpdated()`.

## Prompt

"there are some warnings in the console, can see if they're simple to solve"

## Requirements

- Identify the source of the `change-in-update` warnings for the three child-driven controls.
- Refactor the initial light-DOM sync so the controls do not schedule an extra update after the initial render.
- Preserve the current SSR mitigation behavior added for the Angular SSR and Next SSR demos.
- Verify the warnings are gone in the affected app and confirm the controls still behave correctly.
