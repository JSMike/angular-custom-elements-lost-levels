# Session 5

**Date:** 2026-03-15

**Prompt/Ask:** Investigate the legitimate Next.js/Lit SSR errors and odd duplicate rendering behavior seen after interaction, using `libs/boxes/next.html` as a reference.

## Completed
- Reproduced the Next.js SSR issue against a production `next start` server.
- Verified that the hydration errors are real and not limited to `next dev`.
- Captured the over-the-wire HTML and confirmed that the three list-driven controls server-render with empty iterable parts inside declarative shadow DOM.
- Traced the likely upstream cause to `@lit-labs/ssr-react` omitting React `children` from the server-side custom element instance before `renderShadow()`.

## Current Status
- `ISSUE-5` remains `in-progress`.
- The current Next.js baseline works for the checkbox control, but not for combobox, multi-select, or calendar-picker when they derive internal render state from light-DOM `<option>` children.
- The user-visible duplication/odd rendering is a downstream symptom of Lit hydration starting from an empty server-rendered iterable and then immediately rendering populated client-side content.

## Plan Coverage
- Extended plan item 4 by validating the rendered HTML and client hydration results in detail.

## Files Changed
- `.issues/ISSUE-5/summary-5.md` - recorded the verified findings from this investigation.

## Verification
- `npx nx build boxes-nextjs`
- `cd apps/boxes-nextjs && npx next start -p 4302`
- `curl -s http://localhost:4302`
  - confirmed that `boxes-combobox`, `boxes-multi-select`, and `boxes-calendar-picker` each render an empty `<!--lit-part--><!--/lit-part-->` where their iterable option/grid content should be.
- Browser verification on `http://localhost:4302`
  - confirmed three `unexpected longer than expected iterable` errors on first load.
  - confirmed the checkbox control does not throw the iterable hydration error.
- Source inspection:
  - `node_modules/@lit-labs/ssr-react/lib/node/render-custom-element.js`
    - `reservedReactProperties` includes `children`, so React children are not set on the server-side element instance before `renderShadow()`.
  - `libs/boxes/src/combobox/combobox.ts`
  - `libs/boxes/src/multi-select/multi-select.ts`
  - `libs/boxes/src/calendar-picker/calendar-picker.ts`
    - each derives internal option state from light-DOM `<option>` nodes.

## Next Steps
- Decide whether `apps/boxes-nextjs` should:
  - remain as a documented SSR limitation repro for child-driven custom elements, or
  - move to a property-driven API/wrapper approach for the SSR comparison baseline.
- If the goal is a working SSR baseline, a likely path is to provide server-visible option data via element properties instead of relying on light-DOM children during SSR.
