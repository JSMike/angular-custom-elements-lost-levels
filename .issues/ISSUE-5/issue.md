# ISSUE-5: Investigate Angular SSR and hydration with custom elements

<!-- Metadata -->
| Field        | Value            |
|--------------|------------------|
| Status       | backlog          |
| Owner        | TBD              |
| Complexity   | medium           |
| Created      | 2026-03-14       |
| Source       | readme-roadmap   |
| External     |                  |
| Blocks       |                  |
| Blocked-by   |                  |
| Priority     | medium           |

## Summary

Reproduce how Angular SSR and hydration behave when pages render custom elements before those elements are defined on the client.

## Prompt

Seeded from the `README.md` heading `SSR`.

## Requirements

- Create a minimal Angular SSR reproduction that renders one or more custom elements.
- Document server-rendered output, client upgrade behavior, and hydration results.
- Capture warnings, mismatches, broken interactions, or timing issues.
- Compare Angular behavior with a non-Angular baseline where useful.
- Summarize the findings in a presentation-friendly format.
