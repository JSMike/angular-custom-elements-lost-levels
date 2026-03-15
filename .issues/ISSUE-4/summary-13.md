# Session 13

**Date:** 2026-03-15

**Prompt/Ask:** Revert the manual change that made the combobox emit `change` for programmatic value updates.

## Completed
- Restored native-like event behavior for `boxes-combobox` so programmatic `.value` assignment no longer emits form events by default.
- Reverted `_commitSelection()` to dispatch `input` and `change` only for user-driven selection changes.

## Current Status
- `ISSUE-4` remains in progress overall.
- The combobox baseline now matches native control expectations again: programmatic state updates change the value and form participation state without simulating user events.

## Plan Coverage
- Tightened the baseline FACE fixture to preserve native event semantics for later Angular comparisons.

## Files Changed
- `libs/boxes/src/combobox/combobox.ts` - Reverted event dispatch so programmatic selection updates do not emit `input`/`change`.
- `.issues/ISSUE-4/summary-13.md` - Recorded this session.

## Verification
- `npx nx build boxes`
- `npx nx build boxes-web`
- `npx nx build boxes-angular`
- `npx nx lint boxes`
- `boxes` lint still reports the existing `no-explicit-any` warnings in `libs/boxes/vite.config.ts`; no new lint errors were introduced.

## Next Steps
- Keep this behavior as the non-Angular baseline unless you specifically want a custom imperative API that can opt into emitting events.
- If needed for slides, call out that the native-like behavior is "programmatic value set updates state but does not emit user interaction events."
