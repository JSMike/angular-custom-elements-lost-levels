---
theme: default
title: custom-elements-everywhere.com the lost levels
titleTemplate: '%s'
lineNumbers: false
transition: slide-left
drawings: false
layout: cover
background: '#1a1a2e'
---

<div class="text-white">

# Web Components in Angular
## [custom-elements-everywhere.com](https://custom-elements-everywhere.com/#angular) the lost levels

**Form integration · Template type-checking · Monorepo experience · SSR setup**

<div class="mt-10 grid grid-cols-2 gap-4 text-sm">

<div>

**Michael Cebrian**  
SVP, Principal Engineer — Enterprise Design System  
M&T Bank

</div>

<div class="text-gray-300">

💼 [linkedin.com/in/michael-cebrian-94248378](https://linkedin.com/in/michael-cebrian-94248378)  
📦 [github.com/JSMike/angular-web-component-integration](https://github.com/JSMike/angular-web-component-integration)  
🔗 [box-model.dev](https://box-model.dev)

</div>

</div>

<div class="mt-4 text-gray-400 text-xs">
Angular Enterprise Summit · March 19, 2026
</div>

</div>

<!--
Intro: Hi I'm Mike
I've been using Angular for nearly 11 years, with an emphasis on Design Systems
I've been working on Web Component based design systems for the past 2.5 years
And I'm excited to share with you some of the things I've learned about integrating Web Components in Angular
-->

---
layout: default
---

# Overview

## Form Integration
- `ngDefaultControl` compatibility with Form-associated Custom Elements

## Template Type-Checking
- `CUSTOM_ELEMENTS_SCHEMA` and IDE integration

## Monorepo Experience
- TypeScript aliases and build configuration

## SSR Setup
- An overview of what's required integrate with @lit-labs/ssr

<!--
This talk will cover four integration points:
Forms Integration
Template checking
Using a local web component library within a monorepo
And SSR setup for Web Components
-->

---
layout: default
---

# The Web Components

- `<boxes-combobox>`
  - Example based on [WAI ARIA - Select-only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)
    - Baseline, works as `<input type="text">`
- `<boxes-checkbox>`
  - Example from [HTML Spec](https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example)
    - Uses state other than `value`
- `<boxes-calendar-picker>`
  - Single value that relies on `changes` event
- `<boxes-multi-select>`
  - Multi-value that relies on `change` event

<!--
For these issues I've created a small library of web components to emphasize some of the issues I've faced over the past 2.5 yrs
-->

---
layout: section
---

# Form Integration

`ngDefaultControl` compatibility with Form-associated Custom Elements

---
layout: default
---

# About FACE 🤔

```js
class MyCustomEl extends HTMLElement {
  static formAssociated = true;
  constructor() {
    super();
    this._internals = this.attachInternals();
    ...
  myUpdateFn() {
    this._internals.setFormValue(...);
```

This enables binding data to a `<form>` and its associated `FormData`

```ts
form.addEventListener('submit', (e) => {
  const data = Object.fromEntries(new FormData(form));
  console.log(JSON.stringify(data));
});
```

- `boxes-checkbox` checked → `{ "confirmedProduce": "confirmed" }`, unchecked → `{}`
- `boxes-multi-select` with Fresh + Organic → `{ "produceTags": ["fresh", "organic"] }`
- `boxes-calendar-picker` after selecting Thurs 19 → `{ "deliveryDate": "2026-03-19" }`

[HTML Spec](https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example) [Webkit Blog](https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/)

<!--
Quick overview for those not familiar with the web component spec, this is how to extend HTMLElement to create a Form Associated Custom Element.
This directly binds the element's value to a `<form>`, which can then be accessed by creating a FormData object and extracting the entries.
Here are some examples.
-->

---
layout: two-cols-header
---

# Angular Forms - In Your FACE

::left::

Angular already ships with multiple value-accessor directives, but only one exposes an opt-in selector: `DefaultValueAccessor` via `ngDefaultControl`.

```html
<boxes-combobox
  formControlName="produce"
  ngDefaultControl>
</boxes-combobox>
```

`<boxes-combobox>` works — it fires `input` and exposes `target.value`, exactly like a text input.

::right::

`ngDefaultControl` wires up the **default value accessor** — the only built-in accessor Angular lets you attach to a custom element:

1. Reads `event.target.value` on `input` events
2. Writes back via `element.value = ...`
3. Tracks touched state via `blur`

<div class="callout mt-6">

`ngDefaultControl` works for controls that follow text-input semantics — but not all controls do. Angular's forms package already accounts for this: it ships specialized value-accessor directives for native elements with different event and value models. Those directives aren't available for custom elements to opt into.

</div>

<!--
ngDefaultControl works for combobox because it was designed for exactly this shape.
The next slides show the three other patterns Angular already knows about — and why they break with custom elements.
-->

---
layout: default
---

# Built-in Directives Without a Similar Opt-in

These value-accessor directives already exist in Angular, but unlike `DefaultValueAccessor` they do not expose an additional attribute selector for custom elements to opt into.

| Angular Directive | Native selector today | View contract |
|---|---|---|
| `CheckboxControlValueAccessor` | `input[type=checkbox]` | `change` + `checked` |
| `SelectControlValueAccessor` | `select:not([multiple])` | `change` + `value` |
| `SelectMultipleControlValueAccessor` | `select[multiple]` | `change` + selected options |
| `RadioControlValueAccessor` | `input[type=radio]` | `change` + radio-group registry |
| `NumberValueAccessor` | `input[type=number]` | `input` + parsed number |
| `RangeValueAccessor` | `input[type=range]` | `input/change` + parsed number |

The gap is that only `DefaultValueAccessor` has a custom-element opt-in path.

<!--
This is the more inclusive framing.
Angular's forms package already knows about more than text/checkbox/select.
But all of the extra knowledge is trapped behind native selectors.
-->

---
layout: default
---

# When `ngDefaultControl` Is the Only Option

`ngDefaultControl` is the only value-accessor path available for FACE controls today. Applying it to all four controls exposes where that assumption breaks down.

```html
<boxes-combobox formControlName="produce" ngDefaultControl />
<boxes-checkbox formControlName="confirmedProduce" ngDefaultControl />
<boxes-calendar-picker formControlName="deliveryDate" ngDefaultControl />
<boxes-multi-select formControlName="produceTags" ngDefaultControl />
```

| Control | Angular `formControl.value` | Native `FormData` | Result |
|---|---|---|---|
| `<boxes-combobox>` | `"blueberry"` | `"blueberry"` | ✅ matches |
| `<boxes-checkbox>` after uncheck | `"confirmed"` | omitted | ❌ stale |
| `<boxes-calendar-picker>` | `""` | `"2026-03-19"` | ❌ misses `change`-only commit |
| `<boxes-multi-select>` | `"fresh"` | `["fresh", "organic"]` | ❌ loses multi-value state |

<!--
One directive path exists for custom elements today, so the right question is:
what happens if we force all these controls through that path?
Combobox is the baseline. The others expose the limits immediately.
-->

---
layout: default
---

# Two Proposal Paths

<div class="grid grid-cols-2 gap-4 mt-2">
<div>

## 1. Add opt-in selectors to existing directives

- Let FACE controls opt into existing built-ins with attribute selectors
- Examples: checkbox, single select, multi-select, radio, number, range
- Reuses Angular's current event/value semantics where the control already matches
- Best fit for FACE controls that intentionally mirror native behavior

</div>
<div>

## 2. Add a configurable custom-element directive

- Allow configuration of which event updates the model
- Allow configuration of which property Angular reads and writes
- Useful for commit-style controls or custom state shapes that do not map cleanly to native accessors

</div>
</div>

<div class="mt-6 pt-4 border-t border-gray-200 text-sm">

Both paths may be needed: reuse the existing directives where possible, and provide a configurable escape hatch where the existing patterns are too narrow.

</div>

<!--
Proposal 1 is the lowest-friction extension of what Angular already has.
Proposal 2 acknowledges that not every FACE control is just "checkbox but custom" or "select but custom".
These are complementary, not competing, ideas.
-->

---
layout: section
---

# Issue 2: Template Type-Checking

`CUSTOM_ELEMENTS_SCHEMA` suppresses errors — it does not load typed metadata

---
layout: two-cols
---

# What Angular Sees Today

To use a custom element in an Angular template, you add `CUSTOM_ELEMENTS_SCHEMA`.

```ts {3,7}
// app.ts
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <boxes-checkbox
      [checked]="true"
      [notARealProp]="'oops'">
    </boxes-checkbox>
  `,
})
export class AppComponent {}
```

::right::


**What `CUSTOM_ELEMENTS_SCHEMA` actually does:**

- Suppresses "unknown element" errors for dash-cased tags
- Suppresses "unknown property" errors on those elements
- Does **not** load any type information about the element
- Does **not** enable property completions
- Does **not** validate that `[notARealProp]` is a mistake



It is an **error suppressor**, not a schema loader. The name is misleading.


<!--
Worth saying clearly: CUSTOM_ELEMENTS_SCHEMA has "schema" in the name, but it does not ingest a schema.
It is a global opt-out from Angular's normal DOM property checking for custom elements.
-->

---
layout: two-cols
---

# What React Gets Today

The component library already ships a generated `react.d.ts` that augments JSX.

```ts
// libs/boxes/src/types/react.d.ts
import type { HTMLAttributes } from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'boxes-checkbox': HTMLAttributes<HTMLElement> & {
        checked?: boolean;
        value?: string;
        name?: string;
      };
    }
  }
}
```

::right::


In React, this gives you today:

- ✅ `[checked]` is typed as `boolean`
- ✅ `notARealProp` is a **compile error**
- ✅ Property completions in the editor
- ✅ No framework-specific runtime shims



The generated typing lives in the **component library**. Consuming apps get it for free. No suppressions needed.

**This is the baseline Angular should be able to reach.**


<!--
This is working in boxes-react today, not hypothetical.
The library ships react.d.ts and boxes-react consumes it through a Vite alias.
No Angular-equivalent path exists.
-->

---
layout: two-cols
---

# The Only Workaround: Proxy Directives

A generated Angular directive can restore typed template validation.

```ts
// generated by the component library (hypothetically)
@Directive({
  selector: 'boxes-checkbox',
  standalone: true,
})
export class BoxesCheckboxDirective {
  @Input({ transform: booleanAttribute }) checked = false;
  @Input() value = 'on';
  @Input() name = '';
}
```

::right::


**It works** — Angular now rejects `[notARealProp]` again.

**But it is the wrong boundary:**

- Requires an Angular-specific companion package or code generation step
- Likely version-sensitive across Angular major releases
- Duplicates the component API surface — can drift out of sync
- Places an Angular-specific maintenance burden on a framework-agnostic library



A Web Component library should not need to ship an Angular package to get basic template validation. That is framework lock-in through the back door.


<!--
I proved this works in the repo and then intentionally reverted it so the repo continues to show the real Angular integration path.
The workaround is valid. It is not acceptable as the permanent answer.
-->

---
layout: two-cols
---

# The Proposed Angular Direction

The missing capability: **ingest standard `custom-elements.json` and synthesize typed template metadata.**

```json
// tsconfig.json
{
  "angularCompilerOptions": {
    "customElementManifests": [
      "./node_modules/@boxes/components/custom-elements.json"
    ]
  }
}
```

::right::


With this, Angular could:

- Recognize `boxes-checkbox` as a known element
- Validate `[checked]` against the manifest's `boolean` type
- Reject `[notARealProp]` as an error
- Drive language-service completions from manifest properties and events
- Let `CUSTOM_ELEMENTS_SCHEMA` remain the escape hatch for unknown elements



The component library already generates `custom-elements.json` (CEM format). The manifest exists. Angular just does not consume it.


<!--
This is not asking for a new format. CEM (Custom Elements Manifest) is the standard.
Lit, Stencil, and most Web Component toolchains already emit it.
The ask is for Angular's compiler and language service to read it.
-->

---
layout: section
---

# Issue 3: Debug Experience

The browser debugger falls back to transpiled library JavaScript

---
layout: default
---

# The Sourcemap Gap

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

**Current monorepo setup**

```
apps/boxes-angular/tsconfig.json
  "@/boxes/*" → "dist/libs/boxes/*"

libs/boxes (Vite build)
  → dist/libs/boxes/combobox.js
  → dist/libs/boxes/combobox.js.map  ← exists
    (points to libs/boxes/src/combobox.ts)
```

</div>

<div>

**What the Angular dev server serves**

```
/main.js          ✅ served
/main.js.map      ✅ served
  (embeds dist/libs/boxes/combobox.js source)

/dist/libs/boxes/combobox.js      ❌ 404
/dist/libs/boxes/combobox.js.map  ❌ 404
```

</div>

</div>


**Practical result:** Chrome DevTools can show the transpiled `dist/libs/boxes/combobox.js` because it is embedded in `main.js.map`. But it cannot follow the `sourceMappingURL` comment in that file to reach the original TypeScript source — because the library file URL is never served.



**Debugging stays in transpiled JavaScript instead of component TypeScript.** The root cause inside Angular's dev server configuration is still under investigation, but the browser-level failure is confirmed.


<!--
This is less severe than the forms and tooling gaps, but it compounds the developer experience problem.
When something goes wrong in a FACE control used in Angular, you cannot easily set a breakpoint in the component source.
-->

---
layout: section
---

# Issue 4: SSR Setup

Getting custom elements into Angular SSR requires manual work the platform already solves elsewhere

---
layout: two-cols
---

# Next.js vs Angular SSR

**Next.js baseline** (`apps/boxes-nextjs`)

```ts
// next.config.js
import withLitSSR from '@lit-labs/nextjs';
export default withLitSSR({});
```

That's it. `@lit-labs/nextjs` handles declarative shadow DOM server rendering automatically.

::right::

**Angular SSR** (`apps/boxes-angular-ssr`) required:

- Configure Angular SSR to allow `localhost` — without this it silently falls back to CSR
- Implement a manual Lit SSR response transform in `server.ts` using `@lit-labs/ssr`
- Externalize `lit/*` from the library Vite build so the server transform and the built library share one Lit runtime
- Register `@lit-labs/ssr-client/lit-element-hydrate-support.js` in the browser entry before elements are registered

**Takeaway:** the same result takes one config line in Next.js and a custom server pipeline in Angular.

<!--
This is not a criticism of Angular SSR itself — it is a criticism of the gap between the two ecosystems.
@lit-labs/nextjs exists specifically because Next.js has a hook for transforming server-rendered HTML.
Angular's equivalent hook exists but is not documented or supported for this use case.
-->

---
layout: two-cols
---

# What Works · What Doesn't

**✅ Working after the manual setup**

- Angular renders the app shell server-side
- Over-the-wire HTML includes declarative shadow DOM for all four controls
- Angular hydration completes without console errors
- Post-hydration interactions reproduce the same form mismatches as the client-only app
- `boxes-checkbox` fully deep-SSRs (self-contained shadow content)

::right::

**❌ Remaining limitation**

```ts
// libs/boxes/src/combobox/combobox.ts
firstUpdated() {
  // option state is derived from light DOM
  // after the element upgrades in the browser —
  // not available at server render time
  this._options = [...this.querySelectorAll('option')];
}
```

- Child-driven controls (`combobox`, `multi-select`, `calendar-picker`) can only SSR their shell
- Options passed as light DOM children are not accessible before `renderShadow()` on the server
- This is a known limitation of `@lit-labs/ssr` with child-driven patterns — tracked in ISSUE-15

**Takeaway:** simple self-contained FACE controls SSR correctly; child-driven controls need an upstream fix in `@lit-labs/ssr`.

<!--
This is a split result — not a total failure.
The form mismatch repros survive SSR and hydration, which means the core findings still hold.
The child-driven SSR limitation is a separate upstream issue, not an Angular-specific problem.
-->

---
layout: section
---

# The Ask

Four concrete proposals for the Angular team

---
layout: default
---

# Proposal 1 — FACE-Aware Form Integration

**Problem:** `ngDefaultControl` assumes text-input semantics. FACE controls that use multi-value `setFormValue`, commit-style events, or boolean `checked` semantics silently fail.


**Option A — Built-in FACE CVA**

Ship a `FormAssociatedControlValueAccessor` directive that reads from `ElementInternals` rather than `event.target.value`. Automatically detected when a custom element has `formAssociated = true`.

**Option B — FACE-first `ngDefaultControl`**

Extend `ngDefaultControl` to detect `formAssociated` elements and delegate to the FACE value path (observe form reset, read the internals value) before falling back to text-input behavior.

**Either path** eliminates the need for library authors or consuming app developers to write custom CVAs for controls that already implement the platform contract.


<!--
The browser already has a rich integration surface through ElementInternals.
Angular should be able to read it the same way the browser's form system does.
-->

---
layout: default
---

# Proposal 2 — Manifest-Backed Template Metadata

**Problem:** `CUSTOM_ELEMENTS_SCHEMA` is a suppressor. Angular has no first-class path to load typed custom-element metadata for template checking and language-service completions.


**Proposed API**

```json
{
  "angularCompilerOptions": {
    "customElementManifests": ["./node_modules/@boxes/components/custom-elements.json"]
  }
}
```

**What Angular would synthesize from the manifest:**

- Typed template bindings from `attributes` and `properties` entries
- Event completions and `(event)` binding support from `events` entries
- Type errors when a binding references a non-existent property
- Language-service completions without any runtime shim



`CUSTOM_ELEMENTS_SCHEMA` remains the opt-out. Manifests become the opt-in typed path.


<!--
CEM (Custom Elements Manifest) is already the ecosystem standard.
Lit, Stencil, and Shoelace all ship it. The Angular compiler team has the most leverage to make this real.
-->

---
layout: default
---

# Proposal 3 — Dev Server Sourcemap Passthrough

**Problem:** The Angular dev server does not serve library files resolved through `tsconfig.json` path aliases. The browser cannot follow the second-level sourcemap chain into component TypeScript source.


**Ask:** When the Angular dev server resolves a `paths` alias to a local `dist/` or workspace path, serve the corresponding source files and sourcemaps so the browser can resolve the full chain:

```
main.js.map → dist/libs/boxes/combobox.js → combobox.js.map → src/combobox.ts
```

This is lower priority than the forms and tooling gaps, but it compounds the experience problem: when debugging a FACE integration issue in Angular, you are debugging transpiled library output instead of component source.


<!--
This may be a Vite plugin configuration question rather than a deeper Angular change.
But the effect — that local workspace library source is invisible to the debugger — is real.
-->

---
layout: default
---

# Proposal 4 — First-Class Lit SSR Integration

**Problem:** Angular SSR has no built-in path for server-rendering custom elements with declarative shadow DOM. Achieving it requires a manual response transform, library build changes, and host configuration that should not be the consuming app's responsibility.

**Option A — Official `@angular/ssr` + Lit integration package**

Ship or document an `@angular/ssr` plugin that applies the Lit SSR transform automatically, equivalent to what `@lit-labs/nextjs` does for Next.js.

**Option B — HTML response transform hook**

Expose a supported, documented `server.ts` hook for transforming the Angular SSR HTML response before it is sent to the browser. This would let `@lit-labs/ssr` or any other tool plug in without custom plumbing.

**Either path** removes the need for consuming apps to maintain a custom server pipeline just to get declarative shadow DOM in their initial HTML response.

<!--
The manual transform works. The point is that it should not be manual.
@lit-labs/nextjs is ~200 lines of code that any Angular integration could replicate — once there is a hook to plug into.
-->

---
layout: default
---

# Why This Matters

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

**The Web Component promise**

- Write once, use anywhere
- Framework-agnostic design system components
- Platform-native form participation via FACE
- No per-framework runtime shims

</div>

<div>

**What the current Angular gaps require**

- Custom `ControlValueAccessor` per FACE control per semantic type
- Angular-specific proxy directive package per library
- Suppressions (`CUSTOM_ELEMENTS_SCHEMA`) instead of validation
- Transpiled-JS debugging instead of TypeScript source

</div>

</div>


Each gap individually is workable. Together, they make Angular the **hardest framework to integrate Web Components into** — despite Angular being the framework most committed to TypeScript correctness.



These findings are reproducible. The monorepo is available. The goal of this conversation is to find the Angular team's preferred path to closing these gaps.


<!--
This is not adversarial. Angular has the strongest TypeScript story of any major framework.
These gaps are inconsistencies with that story — not fundamental incompatibilities.
The proposals are designed to be additive, not breaking.
-->

---
layout: default
---

# Summary

| Issue | Current Angular behavior | Proposed path |
|-----|--------------------------|---------------|
| **Form integration** | `ngDefaultControl` reads `input` + `target.value` only | Built-in FACE CVA or FACE-first `ngDefaultControl` |
| **Template type-checking** | `CUSTOM_ELEMENTS_SCHEMA` suppresses all errors | `customElementManifests` in `angularCompilerOptions` |
| **Debug experience** | Library sourcemaps not served through path aliases | Dev server passthrough for workspace alias targets |
| **SSR setup** | Manual Lit SSR transform + host config + build changes required | Official `@angular/ssr` + Lit integration or a supported HTML transform hook |


**Reproductions available in:** `apps/boxes-angular`, `apps/boxes-web`, `apps/boxes-react`

**Component library:** `libs/boxes` — FACE controls built with Lit, ships `custom-elements.json` and `react.d.ts`



Questions welcome. All three repros are live and runnable.


<!--
Leave plenty of time for discussion here.
The Angular team may have context on internal work that addresses some of these — that's a great outcome.
The goal is alignment, not advocacy.
-->

---
layout: end
---

# Thank You

**Monorepo:** `angular-web-component-integration`

Five apps · Four FACE controls · Every finding reproducible

<div class="mt-8 text-gray-400 text-sm">

Open question still being investigated: Template binding timing during element upgrade (ISSUE-8) · Child-driven SSR upstream fix (ISSUE-15)

</div>

<!--
Mention that ISSUE-8 (template binding timing) and ISSUE-5 (SSR) are next on the investigation list.
Those findings will add to this deck as they are confirmed.
-->
