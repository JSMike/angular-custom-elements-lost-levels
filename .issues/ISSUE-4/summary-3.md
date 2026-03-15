# Session 3

**Date:** 2026-03-14

**Prompt/Ask:** Update the plain web FACE demo so the second combobox depends on the first, is hidden until the first has a real value, and the result panel shows the current `FormData` JSON that would be sent if the form were submitted.

## Completed
- Reworked the `boxes-web` demo into a dependent-field example with a primary `family` combobox and a secondary `produce` combobox.
- Made the secondary combobox hidden and disabled until the primary combobox has a non-empty selection.
- Populated the secondary combobox options dynamically based on the selected family.
- Changed the result panel to render the current `FormData` object as JSON instead of only showing submitted output.
- Kept submit and reset behavior wired so the live JSON stays aligned with the form's current state.

## Current Status
- `ISSUE-4` remains in progress overall.
- The non-Angular baseline now demonstrates a dependent FACE field flow that is suitable for comparison with the later Angular forms reproduction.

## Plan Coverage
- Extended the existing plain web harness work from `plan.md`; no new plan items were required.

## Files Changed
- `app/boxes-web/index.html` - Replaced the demo fields with a primary/secondary dependent combobox setup and renamed the result panel.
- `app/boxes-web/src/main.ts` - Added dependent option population, hidden/disabled secondary-field behavior, and live `FormData` JSON rendering.
- `.issues/ISSUE-4/summary-3.md` - Recorded this follow-up session.

## Verification
- `npx nx build boxes-web`
- `npx nx lint boxes-web`
- Browser verification in the Vite app:
  - Confirmed the page initially shows only the `family` combobox and `{ "family": "" }` in the result panel.
  - Selected `Citrus` and confirmed the `produce` combobox appeared with citrus-only options and the JSON updated to `{ "family": "citrus" }`.
  - Selected `Lemon` and confirmed the JSON updated to `{ "family": "citrus", "produce": "lemon" }`.
  - Reset the form and confirmed the dependent field hid again and the JSON returned to `{ "family": "" }`.

## Next Steps
- Create the first Angular consumer app and mirror this dependent-field scenario there.
- Compare whether Angular form state captures both FACE values consistently as the controlling field changes.
