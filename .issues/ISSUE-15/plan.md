# Plan

**Date:** 2026-03-15

## Goal

Prepare a clear upstream follow-up issue for `@lit-labs/ssr-react` based on the verified `apps/boxes-nextjs` SSR and hydration results.

## Approach

1. Use the existing `ISSUE-5` investigation as the evidence base instead of reopening that issue.
2. Summarize the exact repro shape:
   - Lit custom elements rendered through `@lit-labs/nextjs`
   - child-driven controls using light-DOM `<option>` nodes
   - empty iterable parts in the server-rendered shadow DOM
   - hydration failure on first load
3. Capture the likely implementation gap:
   - React `children` are reserved and not applied to the server-side custom element instance before `renderShadow()`
   - the current server-side custom element instance therefore cannot derive internal state from light DOM before render
4. Keep the issue phrasing suitable for later external follow-up, without overstating the root cause beyond what has been verified.

## Notes

- This is a tracking issue for later upstream follow-up, not a commitment to patch `@lit-labs/ssr-react` from this repo.
- The repo-local workaround decision remains under `ISSUE-5`.
