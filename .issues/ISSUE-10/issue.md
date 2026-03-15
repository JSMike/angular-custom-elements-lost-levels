# ISSUE-10: Expand and polish slides for Angular custom-element investigation issues

<!-- Metadata -->
| Field        | Value                                     |
|--------------|-------------------------------------------|
| Status       | in-progress                               |
| Owner        | TBD                                       |
| Complexity   | medium                                    |
| Created      | 2026-03-15                                |
| Source       | user-request                              |
| External     |                                           |
| Blocks       |                                           |
| Blocked-by   | ISSUE-5, ISSUE-8                          |
| Priority     | medium                                    |

## Summary

Turn the findings from the main investigation issues into a more complete presentation deck with dedicated slides, evidence, and narrative structure.

## Prompt

"Move issues 2,3,4,9 to done. Will need separate backlog item to work on the slides related to #4,5,6,7,8"

## Requirements

- Expand `slides.md` to cover the relevant findings from `ISSUE-4` through `ISSUE-8`.
- Add or refine dedicated slides for each investigation area as findings are confirmed.
- Include concrete evidence such as screenshots, code snippets, browser output, or Angular/native comparisons where useful.
- Keep the slides aligned with the actual engineering findings rather than generic framework commentary.
- Verify the deck still builds successfully with Slidev as the slide set grows.

## Current Session Focus

- Strengthen the `ISSUE-6` sourcemap slide so it describes the real repository setup: `@/boxes/*` imports aliased to `dist/libs/boxes/*`, library sourcemaps present, Angular vendor sourcemaps enabled, and the final bundle map still stopping at the dist output.
- Keep the presentation audience-facing: remove `.issues` references from the deck itself and describe the sourcemap problem in terms of what the browser debugger can actually see.
- Make the sourcemap slide more precise: the aliased library files advertise `sourceMappingURL`, but the Angular dev server does not serve the corresponding `dist/libs/boxes/*.js(.map)` URLs, so DevTools stays on the transpiled code.
- Add an Angular tooling slide that distinguishes the verified limitation from the workaround: Angular only supports the built-in schemas, `CUSTOM_ELEMENTS_SCHEMA` suppresses errors instead of loading typed metadata, and generated Angular proxy directives can restore template validation for known custom elements.
- Make the slide explicit that the proxy-directive approach is not a complete solution: it pushes Angular-specific packaging and versioning work onto the Web Component library author.
