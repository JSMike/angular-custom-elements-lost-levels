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

| Repro                                     | Current Result                                                      | Tracking  |
| ----------------------------------------- | ------------------------------------------------------------------- | --------- |
| FACE checkbox under `ngDefaultControl`    | After uncheck, Angular keeps the last scalar value while native drops the field | `ISSUE-4` |
| FACE multi-select under `ngDefaultControl`| Angular only keeps a scalar `value`, not the repeated submitted set | `ISSUE-4` |
| FACE calendar under `ngDefaultControl`    | Angular stays stale when the control commits on `change` only       | `ISSUE-4` |
| Built library sourcemaps in the monorepo  | Angular map output stops at `dist/libs/boxes/*.js`                  | `ISSUE-6` |

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

# Monorepo Sourcemap Repro

**Status:** confirmed

- Library build emits `.js.map` files for `libs/boxes`
- Angular dev builds emit `main.js.map` with vendor sourcemaps enabled
- Current finding: Angular still maps only to `dist/libs/boxes/*.js`
- Original library sources under `libs/boxes/src/*` stay unavailable in Chrome DevTools

**Takeaway:** same-monorepo package consumption is still a debugging limitation worth showing explicitly.

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
