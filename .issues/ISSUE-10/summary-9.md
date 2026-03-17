# Session 9

**Date:** 2026-03-15

**Prompt/Ask:** Rewrite the slide deck for presentation to an audience of high-level/lead developers and the Angular team at Google about the issues found when integrating Web Components into Angular.

## Completed

- Rewrote `slides.md` from an engineering notebook into a polished, narrative-driven presentation targeting lead developers and the Angular team.
- Restructured the deck around three clearly named gaps: Form Value Integration, Template Type-Checking, and Debug Experience.
- Added a cover slide with subtitle and context line.
- Added a "What We Built" slide explaining the monorepo setup and harness apps.
- Added a "The Baseline" slide establishing what native `FormData` correctly sees from the FACE controls.
- Rewrote all three form repro slides (checkbox, multi-select, calendar picker) with `v-clicks` for progressive reveal and strengthened takeaway copy.
- Added a "The Pattern Behind All Three" slide that names the structural root cause (ngDefaultControl assumes text-input semantics) and frames the ask.
- Rewrote the template tooling section: what `CUSTOM_ELEMENTS_SCHEMA` actually does, the React contrast, the proxy directive workaround and why it's wrong, and the proposed `customElementManifests` API.
- Added a sourcemap gap slide as Gap 3.
- Added a "The Ask" section with three dedicated proposal slides (FACE-aware CVA, manifest-backed metadata, dev server passthrough).
- Added a "Why This Matters" slide framing the cumulative impact.
- Added a clean Summary table and a closing end slide.
- Added presenter notes to every slide.
- Verified the deck builds successfully with `npm run slidev:build` into `dist/slides`.

## Current Status

- `slides.md` is now a presentation-ready deck for an external audience.
- `ISSUE-10` remains `in-progress` pending ISSUE-8 (template binding timing) findings, which will add to the deck.

## Plan Coverage

- Expanded the deck with all confirmed findings from ISSUE-4, ISSUE-6, and ISSUE-7.
- Remaining open step: expand the deck as ISSUE-8 produces confirmed results.

## Files Changed

- `slides.md` — Full rewrite as a polished audience-facing presentation.
- `.issues/ISSUE-10/summary-9.md` — This session record.

## Verification

- `npm run slidev:build` — Built successfully into `dist/slides`. Non-zero exit at export step is expected (playwright-chromium not installed).

## Next Steps

- Complete ISSUE-8 (template binding timing) and incorporate confirmed findings into a new slide or expand Gap 1.
- Decide whether to add a slide showing the SSR hydration gap (ISSUE-5/ISSUE-15) as a preview of open investigations.
