# ISSUE-7: Investigate Angular IDE and template-tooling support for custom elements

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
| Priority     | medium           |

## Summary

Measure how well Angular tooling recognizes custom element typings, attributes, events, and manifests during authoring.

## Prompt

Seeded from the `README.md` heading `IDE Integration`.

## Requirements

- Evaluate Angular template tooling support for custom elements in the editor and during type-checking.
- Test whether generated typings or a Web Component Manifest can improve the experience.
- Document required suppressions, schema configuration, or editor workarounds.
- Compare the authoring experience with at least one non-Angular baseline when useful.
- Capture slide-ready examples of the tooling gaps and mitigations.

## Current Findings

- Angular template checking is driven by the DOM schema registry and Angular directive metadata, not by ambient JSX-style intrinsic-element typings.
- `CUSTOM_ELEMENTS_SCHEMA` is a suppression mechanism: it allows dash-cased elements and properties, but it does not ingest custom-element definitions for typed validation or completions.
- Angular's current compiler path only accepts `CUSTOM_ELEMENTS_SCHEMA` and `NO_ERRORS_SCHEMA`; there is no supported custom schema extension point for feeding in `custom-elements.json`.
- The viable path in the current Angular architecture is to translate custom-element metadata into Angular directive metadata, for example generated proxy directives with element selectors and typed `@Input`s.
- That workaround is still framework-specific and version-sensitive, so it is not an appropriate burden to place on a framework-agnostic Web Component library.
- The stronger upstream direction is manifest-backed custom-element metadata in Angular's compiler and language service, rather than adding another suppression-oriented schema token.
