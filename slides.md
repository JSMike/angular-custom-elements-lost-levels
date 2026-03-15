---
theme: default
title: Angular Web Component Repros
titleTemplate: '%s'
lineNumbers: false
transition: fade-out
drawings: false
---

---
layout: cover
---

# Angular Web Component Repros

FACE controls, Angular form gaps, and presentation-ready findings.

- Baseline apps: `apps/boxes-web`, `apps/boxes-angular`
- Current focus: form binding, local package consumption, and repro planning

<!--
This deck starts as an engineering artifact, not a polished conference talk.
The early goal is to keep one slide per repro so findings can be promoted into a presentation later.
-->

---
layout: section
---

# Deck Shape

---

# Repro Template

- One slide per repro.
- Show the native or plain-web baseline first.
- Show the Angular result second.
- Call out the exact mismatch and the likely reason.
- End each repro with one takeaway sentence that can survive into the final talk.

---

# Confirmed Repros

| Repro                                     | Current Result                                                      |
| ----------------------------------------- | ------------------------------------------------------------------- |
| FACE checkbox under `ngDefaultControl`    | After uncheck, Angular keeps the last scalar value while native drops the field |
| FACE multi-select under `ngDefaultControl`| Angular only keeps a scalar `value`, not the repeated submitted set |
| FACE calendar under `ngDefaultControl`    | Angular stays stale when the control commits on `change` only       |
| Built library sourcemaps in the monorepo  | Verified: DevTools falls back to transpiled `dist/libs/boxes/*.js`; root cause inside Angular's serving/resolution path is still under investigation |

---

layout: two-cols
---

# Checkbox Repro

**Status:** confirmed

- Control: `boxes-checkbox`
- Setup validity: checkbox-like controls are driven by `checked`, not a scalar text value
- Native Angular comparison: native `<input type="checkbox">` has a dedicated checkbox accessor for this reason
- Repro interaction: check once, then uncheck
- Angular fallback here: `ngDefaultControl` still assumes text-like `input` and `value`

::right::

```json
// Angular form JSON
{
  "confirmedProduce": "confirmed"
}

// Native FormData JSON
{}
```

**Takeaway:** FACE alone is not enough to make Angular treat a custom checkbox like a native checkbox.

---

# Monorepo Dist-Alias Sourcemap Repro

**Status:** confirmed

- Current repo setup: `apps/boxes-angular/src/main.ts` imports `@/boxes/*`
- Alias path: `apps/boxes-angular/tsconfig.json` resolves that to `dist/libs/boxes/*`
- Library build: `libs/boxes` emits external `.js.map` files that point back to `libs/boxes/src/*`
- Verified claim: Angular's `main.js.map` embeds the transpiled `dist/libs/boxes/*.js` files, so DevTools can show the built JavaScript
- Verified claim: those built files still advertise `//# sourceMappingURL=...`, but the Angular dev server does not serve the matching `/dist/libs/boxes/*.js(.map)` URLs
- Practical effect: the browser cannot resolve the second-level sourcemap and debugging stays in the transpiled dist output instead of the component TypeScript files
- Root cause: still unknown; the current evidence shows a serving/resolution gap, but not the exact internal Angular decision that causes it

```ts
// apps/boxes-angular/tsconfig.json
"paths": {
  "@/boxes/*": ["dist/libs/boxes/*"]
}

// apps/boxes-angular/src/main.ts
import '@/boxes/combo-box.js';

// dist/libs/boxes/combo-box.js
//# sourceMappingURL=combo-box.js.map
```

**Takeaway:** the verified behavior is that the browser only gets the transpiled library JavaScript; the exact Angular root cause is still being investigated.

---

layout: two-cols
---

# Select-Multiple Repro

**Status:** confirmed

- Control: `boxes-select-multiple`
- Baseline app: `apps/boxes-web`
- Setup validity: the submitted platform shape is a collection with repeated `produceTags` entries
- Event model: this stays select-like, so it keeps both `input` and `change`
- User action: select `Fresh`, then `Organic`
- Native result: the form submits a repeated-key collection
- Angular result: `ngDefaultControl` still reduces the control to scalar `target.value`

::right::

```json
// Angular form JSON
{
  "produceTags": "fresh"
}

// Native FormData JSON
{
  "produceTags": ["fresh", "organic"]
}
```

**Takeaway:** FACE can submit a multi-value field correctly, but Angular's default custom-element accessor still collapses it to a single scalar `value`.

---

layout: two-cols
---

# Calendar Picker Repro

**Status:** confirmed

- Control: `boxes-calendar-picker`
- Baseline app: `apps/boxes-web`
- Setup validity: this is a commit-style date picker, not a free-text input
- Event model: the control dispatches `change` on committed selection and intentionally omits `input`
- User action: choose `Wed 18`
- Angular result: native `FormData` updates, but `ngDefaultControl` leaves the reactive form value unchanged

::right::

```json
// Angular form JSON
{
  "deliveryDate": ""
}

// Native FormData JSON
{
  "deliveryDate": "2026-03-18"
}
```

**Takeaway:** a legitimate commit-style FACE control still needs Angular-specific bridging when it does not behave like a text input.

---

# Next Build-Out

- Capture screenshots or short recordings from the Angular repro app for each confirmed issue slide.
- Add a dedicated slide for the current dependent checkbox mismatch with the exact Angular/native JSON split.
- Decide whether the calendar picker should get a native `<input type="date">` comparison slide or stay focused on the custom-control baseline.
