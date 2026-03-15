# Plan

**Date:** 2026-03-15

## Goal

Verify the source of the Lit dev-mode warning in the Angular apps and avoid making an unnecessary library-build change.

## Approach

1. Inspect the `boxes` Vite library config to confirm whether `lit` is externalized.
2. Inspect the generated `dist/libs/boxes` output to confirm the library still imports `lit` rather than bundling it.
3. Close the item without code changes if the warning is expected from Angular consuming external Lit in development mode.
