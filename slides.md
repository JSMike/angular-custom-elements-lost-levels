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
| Angular template tooling for custom elements | `CUSTOM_ELEMENTS_SCHEMA` suppresses errors but does not load typed custom-element metadata; Angular proxy directives can restore checking, but only as a framework-specific shim |
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

# Select-Multiple Repro

**Status:** confirmed

- Control: `boxes-multi-select`
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

layout: section
---

# Separate Topic

Template tooling, IDE integration, and local package consumption.

---

layout: two-cols
---

# Template Tooling Gap

**Status:** confirmed

- This is separate from the forms/CVA issues
- Angular today: custom elements require `CUSTOM_ELEMENTS_SCHEMA`
- `CUSTOM_ELEMENTS_SCHEMA` suppresses unknown-element and unknown-property errors
- It does not teach Angular what a custom element is, which props it supports, or which values are valid
- React gets that validation today because the generated typings augment `JSX.IntrinsicElements`

::right::

```ts
// Angular today
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <boxes-checkbox
      [checked]="true"
      [notARealProp]="true">
    </boxes-checkbox>
  `,
})
export class App {}
```

```ts
// React today
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'boxes-checkbox': ComponentProps<'boxes-checkbox'>;
    }
  }
}
```

**Takeaway:** Angular currently has only reject-or-suppress behavior for custom elements, while React can consume typed element metadata directly.

---

layout: two-cols
---

# Proxy Workaround

**Status:** confirmed workaround

- A generated Angular proxy directive can restore template validation for a selected custom element
- It works because Angular understands directive metadata, inputs, and outputs
- This proves the limitation is in Angular's metadata pipeline, not in the Web Component itself

::right::

```ts
@Directive({
  selector: 'boxes-checkbox',
  standalone: true,
})
export class BoxesCheckboxDirective {
  @Input({ transform: booleanAttribute }) checked = false;
  @Input() value = 'on';
}
```

- Verified in this repo: this kind of shim lets Angular reject `[notARealProp]` again
- But it is still the wrong solution for a Web Component library:
- it requires Angular-specific code or a companion package
- it likely creates Angular-version-specific packaging and maintenance
- it duplicates the component API surface and can drift out of sync

**Takeaway:** the only viable workaround today is an Angular-specific shim layer, which undermines the goal of shipping one framework-agnostic Web Component library.

---

layout: two-cols
---

# Potential Angular Direction

**Status:** proposal

- A new schema alone is probably not enough
- Angular's current schema path is allow/deny, not typed metadata
- The missing capability is: "load standard custom-element definitions and use them for diagnostics and completions"
- The clean direction would be manifest-backed template metadata

::right::

```json
{
  "angularCompilerOptions": {
    "customElementManifests": [
      "./custom-elements.json"
    ]
  }
}
```

- Angular could ingest `custom-elements.json` and synthesize typed element metadata for:
- selectors
- properties / attributes
- events
- completions and template diagnostics
- `CUSTOM_ELEMENTS_SCHEMA` could remain the escape hatch, while manifests become the typed path

**Takeaway:** the right upstream fix is first-class manifest-backed custom-element metadata in the compiler and language service, not broader error suppression.

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
import '@/boxes/combobox.js';

// dist/libs/boxes/combobox.js
//# sourceMappingURL=combobox.js.map
```

**Takeaway:** the verified behavior is that the browser only gets the transpiled library JavaScript; the exact Angular root cause is still being investigated.

---

# Next Build-Out

- Capture screenshots or short recordings from the Angular repro app for each confirmed issue slide.
- Decide whether the Angular proposal should stay at the API-sketch level or include compiler touchpoints from the Angular source tree.
- Decide whether the calendar picker should get a native `<input type="date">` comparison slide or stay focused on the custom-control baseline.
