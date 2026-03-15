# Summary: ISSUE-6 - Investigate Angular sourcemap handling for aliased local Web Component packages

## Completed
2026-03-14 to 2026-03-15 by Codex

## What Was Done
- Investigated how `apps/boxes-angular` consumes the local `@/boxes` package through the `dist/libs/boxes/*` alias path.
- Enabled sourcemap emission in the `libs/boxes` Vite build so the generated library output includes external `.js.map` files.
- Verified that the Angular development build emits `main.js.map` and embeds the aliased library files as transpiled `dist/libs/boxes/*.js` sources.
- Verified that the built library files still advertise `//# sourceMappingURL=...`, but the Angular dev server does not serve the corresponding `/dist/libs/boxes/*.js` or `/dist/libs/boxes/*.js.map` URLs.
- Narrowed the supported conclusion to the verified browser behavior: DevTools falls back to transpiled library JavaScript because the second-level library sourcemap path is unavailable.
- Documented the finding in the issue tracker, the root README, and the Slidev deck.
- Closed the issue after the user accepted the scope and asked to move it to done.

## Files Changed
- `libs/boxes/vite.config.ts` - Enabled library JS sourcemap generation.
- `README.md` - Documented the verified sourcemap limitation in the current monorepo setup.
- `.issues/ISSUE-6/issue.md` - Recorded the evolving sourcemap findings and final done status.
- `.issues/ISSUE-6/plan.md` - Captured the investigation steps and verified outcome.
- `.issues/ISSUE-6/summary-1.md` through `.issues/ISSUE-6/summary-7.md` - Recorded the incremental investigation and closeout sessions.
- `.issues/ISSUE-6/summary.md` - Recorded final completion.
- `.issues/index.md` - Reflected the final title and completion state.
- `slides.md` - Incorporated the verified sourcemap finding into the deck.

## Key Decisions Made
- Keep the monorepo `dist/libs/boxes/*` alias path intact instead of forcing the package through `node_modules`.
- Present only the verified browser behavior as the confirmed finding.
- Avoid overstating the root cause inside Angular until it is directly proven.

## Deviations from Plan
- The investigation initially focused on “missing sourcemaps,” then narrowed into the more precise browser-level failure: the library sourcemap URLs are unavailable even though the library emits them.

## Acceptance Criteria Results
- [x] Test whether Angular can consume the local component library directly from source or requires a built package.
- [x] Document aliasing, packaging, and module-resolution constraints encountered.
- [x] Preserve notes reusable for future Angular repro apps.
- [x] Produce a reproducible finding about the current sourcemap/debugging limitation in the monorepo setup.

## Artifacts
- Related slide work: `ISSUE-10`
- Related app path: `apps/boxes-angular`
- Related library path: `libs/boxes`

## Notes
- The verified finding is presentation-ready, but the exact internal Angular root cause remains open.
