# Session Summary

Date: 2026-03-15

## What I Did

- Updated the Angular tooling slide in `slides.md` to make the workaround framing sharper and more audience-facing.
- Kept a streamlined single-element proxy example on the slide instead of referencing the removed app-level proof file.
- Changed the confirmed-repros table entry so it no longer reads like a successful integration path, and instead describes proxy directives as a framework-specific shim.
- Added explicit slide language for why the workaround is not a proper solution:
  - it requires Angular-specific packaging;
  - it is likely version-sensitive;
  - it duplicates the Web Component API and can drift.

## Verification

- Ran `npm run slidev:build`.
- The Slidev site built into `dist/slides`.
- The command still exits non-zero during the export step because `playwright-chromium` is not installed in this environment.

## Notes

- The deck now presents the proxy-directive path as evidence of Angular's current limitation, not as a recommended library architecture.
