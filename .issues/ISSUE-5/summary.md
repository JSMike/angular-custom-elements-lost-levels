# ISSUE-5 Completion Summary

**Completed:** 2026-03-15

## Outcome

`ISSUE-5` established both sides of the SSR comparison for the repository:
- a working React/Next.js SSR baseline in `apps/boxes-nextjs`
- a working Angular SSR and hydration repro in `apps/boxes-angular-ssr`

The Angular SSR app now renders the same four FACE control demos as the other apps and compares Angular form state with native `FormData` after hydration. Its server response is post-processed with `@lit-labs/ssr` so the over-the-wire HTML includes declarative shadow DOM for the custom elements.

## What Was Verified

- Angular SSR renders the application shell server-side.
- The HTML response includes declarative shadow DOM for:
  - `boxes-combobox`
  - `boxes-checkbox`
  - `boxes-multi-select`
  - `boxes-calendar-picker`
- Angular hydration completes successfully in the browser.
- The post-hydration interactions still reproduce the intended Angular form mismatches:
  - combobox behaves as the working baseline
  - checkbox highlights the `checked` vs `value` issue
  - multi-select highlights Angular's scalar value assumption
  - calendar highlights the `change`-only commit-style control issue

## Important Findings

- Getting Angular SSR this far required substantially more custom integration than the Next.js baseline.
- The Angular SSR server had to be configured to allow local hosts or it would silently fall back to CSR for `localhost`.
- The manual Lit SSR transform only worked reliably once the `boxes` library build externalized `lit/*`, so the built library and `@lit-labs/ssr` shared one Lit runtime.
- `boxes-checkbox` can deep-SSR successfully through the manual transform.
- The child-driven controls (`combobox`, `multi-select`, `calendar-picker`) still only SSR their shell state because their option data comes from light DOM in `firstUpdated()`.

## Files of Record

- `apps/boxes-nextjs/`
- `apps/boxes-angular-ssr/`
- `libs/boxes/vite.config.ts`
- `.issues/ISSUE-5/summary-8.md`

## Follow-on Work

- Presentation work continues in `ISSUE-10`.
- Upstream SSR follow-up for child-driven custom elements remains tracked in `ISSUE-15`.
