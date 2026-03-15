# ISSUE-4: Investigate Angular forms with form-associated custom elements

<!-- Metadata -->
| Field        | Value            |
|--------------|------------------|
| Status       | done             |
| Owner        | TBD              |
| Complexity   | medium           |
| Created      | 2026-03-14       |
| Source       | readme-roadmap   |
| External     |                  |
| Blocks       |                  |
| Blocked-by   |                  |
| Priority     | high             |

## Summary

Reproduce how Angular forms interact with form-associated custom elements and determine whether Angular still requires custom `ControlValueAccessor` integration for platform-native form participation.

## Prompt

Seeded from the `README.md` heading `Form Associated Custom Elements`.

## Requirements

- Create a minimal Angular reproduction using a form-associated custom element or equivalent baseline fixture.
- Compare Angular behavior with the plain web baseline.
- Test value propagation, touched state, validation state, and form submission behavior.
- Document whether a custom `ControlValueAccessor` is required and why.
- Capture findings in a format that can become presentation slides.

## Current Session Focus

- Expand the baseline `boxes` library with additional FACE controls that exercise Angular form edge cases.
- Keep the demos simple by separating the checkbox repro from the combobox control-group example.
- Build matching plain-web and Angular examples for multi-select collection values and commit-style calendar selection.
- Capture the Angular-vs-native mismatches in a form that can be promoted directly into presentation slides.
