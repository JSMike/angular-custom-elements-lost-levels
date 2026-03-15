# ISSUE-9: Create initial Slidev deck for Angular Web Component repros

<!-- Metadata -->

| Field      | Value        |
| ---------- | ------------ |
| Status     | done         |
| Owner      | TBD          |
| Complexity | medium       |
| Created    | 2026-03-15   |
| Source     | user-request |
| External   |              |
| Blocks     |              |
| Blocked-by |              |
| Priority   | medium       |

## Summary

Create the initial Slidev presentation deck that will hold the Angular Web Component repro findings and planned repro slides.

## Prompt

The user added Slidev and an empty `slides.md`, and wants dedicated slides for upcoming repros including multi-select and calendar-picker controls.

## Requirements

- Create an initial Slidev deck in `slides.md`.
- Include slide structure for current confirmed findings and planned repros.
- Add dedicated slides for the planned multi-select and calendar-picker repros.
- Keep the deck aligned with the repo's engineering findings instead of generic conference filler.
- Verify the deck builds successfully with Slidev.

## Current Session Focus

- Replace the placeholder multi-select and calendar-picker slides with confirmed findings from the working demos.
- Keep the deck grounded in observed Angular-vs-native JSON output instead of speculative slide content.
- Add rationale in the slide captions for why each repro setup is valid, especially around checkbox `checked` semantics and commit-style controls.
