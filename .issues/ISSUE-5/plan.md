# Plan

**Date:** 2026-03-15

## Goal

Establish both sides of the SSR comparison:
- `apps/boxes-nextjs` as the React/Lit baseline
- `apps/boxes-angular-ssr` as the Angular SSR and hydration repro

## Approach

1. Keep the Next.js Pages Router app as the known-good React SSR baseline with `@lit-labs/nextjs`.
2. Mirror the Angular client demo in `apps/boxes-angular-ssr` so the SSR app exercises the same four controls and the same Angular-vs-native JSON comparisons after hydration.
3. Load `@lit-labs/ssr-client` in the Angular SSR browser entry before the custom elements are defined so declarative shadow DOM can hydrate on the client.
4. Intercept the Angular SSR HTML response in `apps/boxes-angular-ssr/src/server.ts` and apply a best-effort Lit SSR transform to the `boxes-*` elements using `@lit-labs/ssr`.
5. Keep the original light DOM in the transformed HTML so Angular hydration can still reconcile the app shell.
6. Verify the over-the-wire HTML, the post-hydration behavior, and any limitations or mismatches.

## Notes

- The Angular SSR response transform depends on the built `dist/libs/boxes` package sharing the workspace `lit` runtime with `@lit-labs/ssr`, so the library build now externalizes `lit/*`.
- Child-driven controls still have an SSR limitation: because option state is read from light DOM in `firstUpdated()`, their declarative shadow DOM templates render only the shell state on the server.
- `boxes-checkbox` can fully render through the manual Lit SSR pass because it does not depend on child `<option>` data.
- This issue remains `in-progress` because the repo still needs presentation updates and any additional Angular-specific SSR findings you want to highlight.
