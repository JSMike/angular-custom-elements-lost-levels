# ISSUE-6: Investigate Angular consumption path for local Web Component packages

<!-- Metadata -->

| Field      | Value          |
| ---------- | -------------- |
| Status     | in-progress    |
| Owner      | TBD            |
| Complexity | medium         |
| Created    | 2026-03-14     |
| Source     | readme-roadmap |
| External   |                |
| Blocks     |                |
| Blocked-by |                |
| Priority   | medium         |

## Summary

Determine the cleanest way for Angular apps in this workspace to consume local Web Component packages during development and reproduction work.

## Prompt

Seeded from the `README.md` heading `Aliasing / Build Config`.

## Requirements

- Test whether Angular can consume the local component library directly from source.
- Test whether Angular requires prebuilt package output for reliable consumption.
- Document aliasing, packaging, and module-resolution constraints encountered.
- Recommend the smallest repo structure that still supports portable reproductions.
- Preserve notes that can be reused when future Angular repro apps are added.

## Current Session Focus

- Make sure the built `libs/boxes` output includes sourcemaps so the Angular app can debug the consumed Web Component package in Chrome DevTools.

## Known Findings

- The `boxes` library can emit external `.js.map` files for its built output.
- `apps/boxes-angular` can enable Angular development sourcemaps with `vendor: true`.
- Even with both of those in place, Angular's emitted `main.js.map` still points to `dist/libs/boxes/*.js` rather than `libs/boxes/src/*` when the built library is consumed from the same monorepo.
- This is a useful repro point for the presentation: sourcemaps remain effectively unusable for the library in Chrome DevTools when Angular consumes it this way inside the monorepo.
