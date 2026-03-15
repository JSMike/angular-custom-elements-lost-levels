# Session 4

**Date:** 2026-03-15

**Prompt/Ask:** Revert the SSR-specific component and Next.js config changes from this session because the approach was too heavy-handed and too specific to SSR.

## Completed
- Reverted the temporary `defer-hydration`-aware light-DOM sync changes in the FACE controls.
- Reverted the temporary `experimental.externalDir` tweak in the Next.js config.

## Current Status
- `ISSUE-5` remains `in-progress`.
- The Next.js SSR baseline is back to the prior implementation state before this session's experiment.
- The underlying Next.js/Lit SSR dev-mode behavior is still unresolved.

## Plan Coverage
- No planned `ISSUE-5` milestones were completed in this session.
- This session backed out an exploratory implementation that the user did not want to keep.

## Files Changed
- `libs/boxes/src/combobox/combobox.ts` - reverted SSR-specific deferred option sync.
- `libs/boxes/src/multi-select/multi-select.ts` - reverted SSR-specific deferred option sync.
- `libs/boxes/src/calendar-picker/calendar-picker.ts` - reverted SSR-specific deferred option sync.
- `apps/boxes-nextjs/next.config.js` - reverted the temporary `experimental.externalDir` change.

## Verification
- `git diff -- libs/boxes/src/combobox/combobox.ts libs/boxes/src/multi-select/multi-select.ts libs/boxes/src/calendar-picker/calendar-picker.ts apps/boxes-nextjs/next.config.js` returned no diff after the revert, confirming the session changes were removed.

## Next Steps
- Investigate the Next.js SSR issue with an approach that does not require SSR-specific behavior in the web components.
- If needed, isolate whether the remaining problem is in Next.js dev mode, `@lit-labs/nextjs`, or the current source-alias runtime setup.
