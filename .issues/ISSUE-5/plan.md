# Plan

**Date:** 2026-03-15

## Goal

Use `apps/boxes-nextjs` as the non-Angular SSR comparison app for the broader SSR and hydration investigation in `ISSUE-5`.

## Approach

1. Update the scaffolded Next.js app to use `@lit-labs/nextjs` with the Pages Router so the SSR example stays minimal and avoids the App Router client-boundary constraints.
2. Mirror the current demo controls from the React/plain-web baselines so the SSR app stays comparable to the rest of the repo.
3. Keep the Next app typed against `libs/boxes/src` while aliasing runtime imports to `dist/libs/boxes` so the app can consume the built library output without teaching Next to compile the library's `scss?inline` source imports.
4. Verify the Next app builds and inspect the rendered HTML to confirm the Lit SSR plugin is active.

## Notes

- This issue remains `in-progress` after the Next baseline is added because the Angular SSR and hydration repro still needs to be implemented and compared.
