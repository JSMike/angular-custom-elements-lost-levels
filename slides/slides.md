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
## [Custom Elements Everywhere](https://custom-elements-everywhere.com/#angular): The Lost Levels

**Form integration · Template type-checking · Monorepo integration · SSR setup**

<div class="mt-10 grid grid-cols-2 gap-4 text-sm">

<div>

**Michael Cebrian**  
SVP, Principal Engineer - Enterprise Design System  
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
I've been using Angular for nearly 10 years, with an emphasis on Design Systems
I've been working on Web Component based design systems for the past 2.5 years
And I'm excited to share with you some of the things I've learned about integrating Web Components in Angular
-->

---
layout: default
---

# Angular Gets So Much Right

The Angular team has built something genuinely impressive. Strong opinions, consistent patterns, and a TypeScript-first approach that makes large codebases maintainable at scale.

<div class="grid grid-cols-2 gap-6 mt-6">
<div>

**Things that just work**

- Reactive forms with full type safety
- Dependency injection at every layer
- Signals-based change detection
- First-class SSR with hydration
- `ng update` across major versions

</div>
<div>

**A friendly nit-pick**

This talk looks at a few places where Web Component integration is rougher than it needs to be. These are friction points I've run into building a design system over the past two and a half years, not complaints about Angular itself.

The goal is a conversation, not a critique.

</div>
</div>

<!--
Set the tone early. This is a talk from someone who has used Angular for nearly 10 years and wants to see it stay great.
-->

---
layout: section
---

# Form Integration

`ngDefaultControl` compatibility with Form-associated Custom Elements

---
layout: default
---

# About-FACE 🤔🔄️

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

`<boxes-combobox>` works: it fires `input` and exposes `target.value`, exactly like a text input.

::right::

`ngDefaultControl` wires up the **default value accessor**, the only built-in accessor Angular lets you attach to a custom element:

1. Reads `event.target.value` on `input` events
2. Writes back via `element.value = ...`
3. Tracks touched state via `blur`

<div class="callout mt-6">

`ngDefaultControl` works for controls that follow text-input semantics, but not all controls do. Angular's forms package already accounts for this: it ships specialized value-accessor directives for native elements with different event and value models. Those directives aren't available for custom elements to opt into.

</div>

<!--
ngDefaultControl works for combobox because it was designed for exactly this shape.
The next slides show the three other patterns Angular already knows about, and why they break with custom elements.
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

# My Request

As a web component library maintainer, I need to support existing Angular Forms for at least the next two years.  
The ask is small: let FACE controls opt into the directives Angular already ships.

- Extend existing built-in directives with opt-in attribute selectors
- Examples: checkbox, single select, multi-select, radio, number, range
- Reuses Angular's current event and value semantics where the control already matches
- No new API surface — just opening the door for controls that already behave correctly

<div class="callout mt-6">

Signal Forms is the right long-term direction and genuinely exciting. When it lands, there's a real opportunity to get FACE integration right from the start and avoid the friction points that exist in the current forms API today.

</div>

<!--
This is the lowest-lift ask in the talk. The directives already exist. FACE controls already implement the browser contract. The gap is just an opt-in selector that isn't there yet.
Signal Forms is where the deeper fix lives, but that doesn't help library maintainers today.
-->

---
layout: section
---

# Template Type-Checking

`CUSTOM_ELEMENTS_SCHEMA`

---
layout: two-cols
---

# What Angular Sees Today

To use a custom element in an Angular template, you must add `CUSTOM_ELEMENTS_SCHEMA`.

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


**It works.** Angular now rejects `[notARealProp]` again.

**But it is the wrong boundary:**

- Requires an Angular-specific companion package or code generation step
- Likely version-sensitive across Angular major releases
- Duplicates the component API surface, can drift out of sync
- Places an Angular-specific maintenance burden on a framework-agnostic library



A Web Component library should not need to ship an Angular package to get basic template validation. That is framework lock-in through the back door.


<!--
I proved this works in the repo and then intentionally reverted it so the repo continues to show the real Angular integration path.
The workaround is valid. It is not acceptable as the permanent answer.
-->

---
layout: two-cols
---

# The JSX Framework Workaround

`@types/react` defines `JSX.IntrinsicElements` as an extendable interface. Component libraries augment it to ship typed bindings alongside the components.

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

This isn't free: must be authored or generated, built, and kept in sync per framework.

::right::

With the `.d.ts` added to the consuming app's `tsconfig`:

```json
// tsconfig.app.json
"types": ["boxes/types/react.d.ts"]
```

- ✅ `checked` is typed as `boolean`
- ✅ `notARealProp` is a **compile error**
- ✅ Property completions in the IDE
- ✅ No suppressions, no runtime shims

<div class="callout mt-2">

This works for any framework with a `jsx-runtime` module that exposes a `JSX.IntrinsicElements` interface: React, Preact, and Solid all support this pattern. The `boxes` library already ships `react.d.ts` and it works today in `boxes-react`.

</div>

Preferable to proxy directives: one app-level `tsconfig` entry rather than importing directives into every Angular component, but still not the right answer. A framework-agnostic source of truth shouldn't require per-framework artifacts.

<!--
The key point: the extensibility is in the type system, not the framework.
Any JSX-based framework can consume the same declaration file.
The boxes library already generates this. Angular has no equivalent path.
The next slide shows what the actual standard looks like: custom-elements.json.
-->

---
layout: default
---

# The Proposed Angular Direction

<div class="grid grid-cols-2 gap-4">
<div>

The proposal: an Angular compiler option that reads `custom-elements.json` and synthesizes typed template bindings. This enables web component libraries to follow the [Custom Elements Manifest standard](https://github.com/webcomponents/custom-elements-manifest) and ship one manifest, with no per-framework builds required.

```json
// tsconfig.json
{
  "angularCompilerOptions": {
    "customElementManifests": [
      "@boxes/components/custom-elements.json"
    ]
  }
}
```

</div>
<div>

With this, Angular could:

- Recognize `boxes-checkbox` as a known element
- Validate `[checked]` against the manifest's `boolean` type
- Reject `[notARealProp]` as an error
- Drive language-service completions from manifest properties and events
- Remove the need for per-component `CUSTOM_ELEMENTS_SCHEMA` opt-in

</div>
</div>

<div class="mt-2 border-t border-gray-200 text-sm">

This is a well-documented community ask:  
[#12045](https://github.com/angular/angular/issues/12045) (the canonical RFC, open since 2016)  
[#36893](https://github.com/angular/angular/issues/36893) (Language Service + `custom-elements.json`, 2020)  
[#58483](https://github.com/angular/angular/issues/58483) (TypeScript interface augmentation approach, 2024)

</div>

<!--
#12045 is P3, open since 2016; maintainers close CEM-related issues as duplicates of it.
#36893 specifically requests language service integration with the CEM format.
#58483 proposes a TypeScript-first approach (interface augmentation) that CEM tooling could target; most actionable recent proposal.
None have shipped.
-->

---
layout: two-cols-header
---

# Selectors Are Always String Literals in Angular Templates

::left::

**Angular**

The selector must be spelled out as a string literal in every template. There is no way to reference the element class or import.

```html
<!-- app.html -->
<boxes-checkbox
  [checked]="isChecked"
  name="confirmedProduce">
</boxes-checkbox>
```

If the selector changes, every template that uses it must be updated manually. TypeScript has no way to enforce the connection between the string and the class.

::right::

**JSX**

The element is imported as a variable. The selector string is an implementation detail the consumer never needs to know.

```tsx
import { Checkbox } from '@/boxes/checkbox';

<Checkbox
  checked={isChecked}
  name="confirmedProduce"
/>
```

Renaming the element is a refactor, not a find-and-replace across templates. The import is the reference.

<!--
This is not just a DX complaint. It means Angular templates cannot participate in TypeScript's module graph the same way JSX can.
-->

---
layout: section
---

# Monorepo Integration

Difficulties with Angular in an integrated monorepo

---
layout: default
---

# Libraries with Custom Build Requirements

This is an edge case specific to web component libraries that use Vite-native import patterns. The `boxes` library imports component styles using `.scss?inline`, a Vite feature that compiles SCSS and returns it as a string. Angular's esbuild pipeline has no loader for this pattern, so the library source cannot be referenced directly.

Angular must point to pre-built `dist/` output where the `.scss?inline` imports have already been resolved by Vite:

```json
// tsconfig.json (Angular)
"paths": { "@boxes/*": ["dist/libs/boxes/*"] }
```

Every change to the `boxes` library requires a `dist/` rebuild before it is reflected in the running Angular app. Libraries that do not use Vite-specific import patterns are not affected.

<div class="callout mt-4">

Frameworks that bundle with Vite or support import plugin configuration handle `.scss?inline` natively and can reference library source directly. Community workarounds for Angular (`@angular-builders/custom-esbuild`) may solve for this but break `ng update` compatibility.

</div>

<!--
Angular libraries and simple web component files work fine; this constraint is specific to libraries with build-time requirements outside Angular's builder.
-->

---
layout: default
---

# The Debug Cost of Building to `dist/`

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

**What the Angular bundler does**

```
combobox.js → JS transformer
  //# sourceMappingURL=combobox.js.map  ← original
  //# sourceMappingURL=data:...         ← TS compiler appends
  combobox.js.map                       ← never read

esbuild follows last comment
  sourcesContent: compiled JS    ← chain stops here
```

</div>

</div>

<div class="mt-4 pt-4 border-t border-gray-200 text-sm">

**Root cause:** When no Babel plugins are needed, Angular's JS transformer never reads the `.map` file from disk. With `allowJs` + `inlineSourceMap` enabled, the TypeScript compiler also appends its own inline `data:` sourcemap; esbuild follows the last one, which only traces back to the compiled JS. The chain to TypeScript is never formed.

**The fix:** Read the external `.map` file, strip both `sourceMappingURL` comments, and replace them with a single inline base64 map pointing to the TypeScript source. esbuild chains it correctly. [PR #32788](https://github.com/angular/angular-cli/pull/32788)

</div>

<!--
The hit path is transformData() in javascript-transformer.ts, not the worker; it short-circuits when skipLinker=true and advancedOptimizations=false.
With allowJs + inlineSourceMap, the TS compiler keeps the original //# sourceMappingURL=combobox.js.map AND appends its own data: inline map. esbuild uses the last one, which wraps the compiled JS content; so sourcesContent in main.js.map contains the JS with the external reference still embedded, unreachable from the browser.
The fix strips both comments and appends a single inline map (the content of combobox.js.map base64-encoded). No additional dependencies needed.
-->

---
layout: two-cols
---

# No Official esbuild Extension Point

Angular's builder treats its esbuild configuration as an internal implementation detail with no documented extension point. Community options exist for both builders: `@angular-builders/custom-webpack` and `@angular-builders/custom-esbuild`. Both require replacing the builder string in `angular.json`.

```json
// angular.json: required change
"serve": {
  "builder": "@angular-builders/custom-esbuild:dev-server"
}
```

```ts
// custom-esbuild.config.ts
export default {
  plugins: [myPlugin()],
};
```

::right::

**Tradeoffs**

- Replacing the builder string in `angular.json` breaks `ng update` compatibility
- Community maintained, not official Angular packages
- Angular team has declined to expose a build configuration extension point

**Related issues (closed)**

- [#26329](https://github.com/angular/angular-cli/issues/26329): custom esbuild plugins
- [#27695](https://github.com/angular/angular-cli/issues/27695): Vite config extension

**Other platforms expose this officially**

- **Storybook**: `viteFinal` / `webpackFinal` hooks in `.storybook/main.ts`
- **Next.js**: `webpack()` and experimental `turbopack` config in `next.config.js`

<!--
Both issues were closed without resolution; the Angular team's position is that the build pipeline is an internal detail.
custom-esbuild replaces the builder entirely, so any Angular CLI updates that change builder options or defaults require manual migration rather than ng update.
Storybook and Next.js treat build extension as a first-class feature. Angular's lack of an equivalent makes Web Component tooling integration significantly harder.
-->

---
layout: section
---

# SSR Setup

Steps required to enable @lit-labs/ssr

---
layout: two-cols-header
---

# Setting Up Lit SSR: Angular

::left::

1. Import hydration support first in `main.ts`, before any element registrations:

```ts
import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
```

2. In `server.ts`, install the DOM shim and register each element so Lit can render them on the server:

```ts
installWindowOnGlobal();
await import('@/boxes/combobox');
// remaining elements...
```

3. Define a regex to identify every custom element selector in the Angular-rendered HTML:

```ts
/<(boxes-(?:checkbox|combobox|...))\b([^>]*)>([\s\S]*?)<\/\1>/g
```

::right::

4. Intercept Angular's response: for each HTML page, pass the body through a custom transform before writing it to the client

5. For each regex match, instantiate a `LitElementRenderer`, apply attributes and properties, call `connectedCallback()`, and collect the rendered shadow tree

6. Replace the matched element in the HTML with a declarative shadow DOM equivalent:

```html
<boxes-combobox>
  <template shadowrootmode="open">
    <!-- rendered shadow tree -->
  </template>
</boxes-combobox>
```

<!--
Angular has no documented hook for transforming SSR output; the response interception and Lit rendering pipeline must be implemented manually in server.ts.
-->

---

# Setting Up Lit SSR: Next.js

1. Wrap the Next.js config with `@lit-labs/nextjs`:

```ts
// next.config.js
import withLitSSR from '@lit-labs/nextjs';
export default withLitSSR({});
```

That's it. `@lit-labs/nextjs` handles declarative shadow DOM server rendering automatically.

**Takeaway:** the same result takes one config line in Next.js and a custom ~150 line server pipeline in Angular.

<div class="callout mt-6">

Both Lit and Angular are Google products. There is a real opportunity here for the two teams to work together and make this a first-class experience.

</div>

<!--
@lit-labs/nextjs exists specifically because Next.js exposes an official hook for transforming server-rendered HTML.
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
  // after the element upgrades in the browser;
  // not available at server render time
  this._options = [...this.querySelectorAll('option')];
}
```

- Child-driven controls (`combobox`, `multi-select`, `calendar-picker`) can only SSR their shell
- Options passed as light DOM children are not accessible before `renderShadow()` on the server
- This is a known limitation of `@lit-labs/ssr` with child-driven patterns; tracked in ISSUE-15

**Takeaway:** simple self-contained FACE controls SSR correctly; child-driven controls need an upstream fix in `@lit-labs/ssr`.

<!--
This is a split result, not a total failure.
The form mismatch repros survive SSR and hydration, which means the core findings still hold.
The child-driven SSR limitation is a separate upstream issue, not an Angular-specific problem.
-->

---
layout: section
---

# Recap


---
layout: default
---

# Recap

| Area | My Concern | My suggestion |
|------|------------|---------------|
| **Form integration** | FACE controls need hand-written CVAs; `ngDefaultControl` reads `event.target.value` only | Opt-in selectors on existing directives now; FACE-aware Signal Forms long term |
| **Template type-checking** | `CUSTOM_ELEMENTS_SCHEMA` suppresses all errors | `customElementManifests` compiler option to load `custom-elements.json`. Consider variable selectors. |
| **Build / debug** | Sourcemaps don't chain through path aliases to TypeScript source | Sourcemap chaining fix ([PR #32788](https://github.com/angular/angular-cli/pull/32788) open) |
| **SSR setup** | Lit SSR requires a custom server pipeline; no official hook to plug into | Angular + Lit teams collaborating on first-class support |


<!--
Leave plenty of time for discussion here.
The Angular team may have context on internal work that addresses some of these; that's a great outcome.
The goal is alignment, not advocacy.
-->

---
layout: end
---

# Thank You

**Repo:** [https://github.com/jsmike/angular-custom-elements-lost-levels](https://github.com/jsmike/angular-custom-elements-lost-levels)

<!--
Mention that ISSUE-8 (template binding timing) and ISSUE-5 (SSR) are next on the investigation list.
Those findings will add to this deck as they are confirmed.
-->
