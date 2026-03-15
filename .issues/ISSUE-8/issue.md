# ISSUE-8: Investigate Angular template binding semantics with custom elements

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
| Priority     | high             |

## Summary

Confirm how Angular binds to custom element properties and attributes, including timing and upgrade-order edge cases.

## Prompt

Seeded from the `README.md` heading `Template Binding`.

## Requirements

- Create a minimal Angular repro covering property binding, attribute binding, and plain DOM assignment.
- Verify whether Angular `[binding]` syntax targets DOM properties, attributes, or both in different conditions.
- Test upgrade-order timing when Angular renders before the custom element definition loads.
- Compare Angular behavior with the plain web baseline.
- Record the results in a format that can be reused for slides.
