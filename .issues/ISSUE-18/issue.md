# ISSUE-18: Review Angular forms directives for custom-element integration behavior

<!-- Metadata -->
| Field        | Value            |
|--------------|------------------|
| Status       | review           |
| Owner        | TBD              |
| Complexity   | medium           |
| Created      | 2026-03-17       |
| Source       | user-request     |
| External     | Angular repo     |
| Blocks       |                  |
| Blocked-by   |                  |
| Priority     | medium           |

## Summary

Review the existing Angular forms directives under `../angular/packages/forms/src/directives` to understand how the current built-in directive and ControlValueAccessor model applies to custom elements, without making code changes.

## Prompt

"Review the existing form directives in ../angular/packages/forms/src/directives (don't make any changes)"

## Requirements

- Read the existing forms directives in `../angular/packages/forms/src/directives`.
- Focus on the current built-in selectors, accessor registration, and behavior relevant to custom-element integration.
- Do not modify the Angular repo or this repo's application code.
- Produce a code-review style summary of findings, risks, and open questions.
