# Session 17

**Date:** 2026-03-18

**Prompt/Ask:** Continued slide deck refinement across structure, content, and tone. Multiple rounds of changes covering slide layout, new slides, removed slides, wording, and repo file updates.

## Completed

### Slide structure changes
- Removed slides 2 and 3 (Overview, The Web Components).
- Moved "Angular Gets So Much Right" to slide 2, reworded right column as "A friendly nit-pick" to set a collaborative tone early.
- Split slide 20 (Angular SSR vs Next.js) into two slides: "Setting Up Lit SSR: Angular" and "Setting Up Lit SSR: Next.js", with the Angular slide using `two-cols-header` layout.
- Added new slide after "The Proposed Angular Direction": "Selectors Are Always String Literals in Angular Templates" — two-column comparison of Angular template string selectors vs JSX variable imports.
- Replaced the four Proposal slides and "Why This Matters" with three Recap slides: "Angular Gets So Much Right" (now slide 2), "Where the Friction Shows Up", and "These Are Solvable".
- Collapsed the three Recap slides into one "Recap" table slide to match the section title.
- Removed intermediate "Where the Friction Shows Up" and "These Are Solvable" slides.

### Slide content changes
- **Slide 8 ("My Request"):** Renamed from "Two Proposals". Focused on the near-term ask (opt-in selectors on existing directives). Reframed Proposal 2 as Signal Forms — acknowledged CVA deprecation, expressed excitement, and noted hope for first-class FACE support in the new API.
- **Slide 18 ("No Official esbuild Extension Point"):** Added "Other platforms expose this officially" callout listing Storybook and Next.js.
- **Slide 20 ("Setting Up Lit SSR: Angular"):** Expanded steps with actual code from `server.ts` and `main.ts`; added `~150 lines` call-out for the custom rendering pipeline.
- **Slide 21 ("Setting Up Lit SSR: Next.js"):** Reduced to a single numbered step. Added callout: "Both Lit and Angular are Google products. There is a real opportunity for the two teams to work together."
- **Slide 22 ("What Works · What Doesn't"):** No changes.
- **Recap slide:** Consolidated into a four-row table with "My Concern" and "My suggestion" columns; includes PR #32788 link for the sourcemap fix.
- Removed all em dashes across the entire slide file, replaced with colons, semicolons, or commas as appropriate.

### Source code changes
- `apps/boxes-angular-ssr/src/main.ts`: Removed `@/boxes/*` element imports (moved to `app.ts`); kept `@lit-labs/ssr-client/lit-element-hydrate-support.js` as the only import before bootstrap.
- `apps/boxes-angular-ssr/src/app/app.ts`: Added `@/boxes/combobox`, `checkbox`, `multi-select`, `calendar-picker` imports at the top, matching the pattern from `apps/boxes-angular`.
- `apps/boxes-angular-ssr/src/server.ts`: Dropped `.js` extensions from `@/boxes/*` dynamic imports.
- `apps/boxes-angular-ssr/src/main.ts`: Dropped `.js` extensions from `@/boxes/*` imports (prior to the element-import move).

### Repo metadata changes
- `README.md`: Replaced issue-tracking content with a clean project overview, app table, component library description, run instructions, and slide deck instructions.
- `package.json` and `package-lock.json`: Renamed package from `@angular-web-component-integration/source` to `@angular-custom-elements-lost-levels/source`.
- `slides/slides.md`: Updated cover slide GitHub link from `JSMike/angular-web-component-integration` to `JSMike/angular-custom-elements-lost-levels`.

## Current Status

- `ISSUE-10` remains `in-progress`.
- Slide deck is presentation-ready for Angular Enterprise Summit 2026-03-19.

## Files Changed

- `slides/slides.md`
- `apps/boxes-angular-ssr/src/main.ts`
- `apps/boxes-angular-ssr/src/app/app.ts`
- `apps/boxes-angular-ssr/src/server.ts`
- `README.md`
- `package.json`
- `package-lock.json`
- `.issues/ISSUE-10/summary-17.md`
