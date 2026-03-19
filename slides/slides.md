---
theme: default
title: Custom Elements Everywhere - The Lost Levels - Angular
titleTemplate: '%s'
lineNumbers: false
transition: slide-left
drawings: false
colorSchema: dark
layout: cover
---

<div class="v1-game-cover">
  <div class="v1-scanlines"></div>

  <div class="v1-hud">
    <div class="v1-hud-item">
      <div class="v1-hud-label">SCORE</div>
      <div class="v1-hud-value">000000</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">LIVES</div>
      <div class="v1-hud-value">♥️♥️♥️♥️</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">TIME</div>
      <div class="v1-hud-value">1800</div>
    </div>
  </div>

  <div class="v1-center">
    <div class="v1-eyebrow">CUSTOM ELEMENTS EVERYWHERE</div>
    <div class="v1-main-title">THE LOST<br>LEVELS</div>
    <div class="v1-sub">Web Components in Angular</div>
    <div class="v1-press"><span class="slide-sym">▶</span> PRESS START <span class="slide-sym">◀</span></div>
    <div class="v1-topics">
      <span><span class="slide-sym">◆</span> FORMS</span>
      <span><span class="slide-sym">◆</span> TEMPLATE-CHECKING</span>
      <span><span class="slide-sym">◆</span> MONOREPO SUPPORT</span>
      <span><span class="slide-sym">◆</span> SSR</span>
    </div>
  </div>

  <div class="v1-footer">
    <div class="v1-player">
      <span class="v1-p1">1P</span>
      <div>
        <div class="v1-p-name">MICHAEL CEBRIAN</div>
        <div class="v1-p-sub">PRINCIPAL ENG · ENTERPRISE DESIGN SYSTEM</div>
        <div class="v1-p-sub">Senior Vice President · M&T BANK</div>
      </div>
    </div>
    <div class="v1-links">
      <div><a href="https://github.com/JSMike/angular-custom-elements-lost-levels">github.com/JSMike</a></div>
      <div><a href="https://linkedin.com/in/michael-cebrian-94248378">linkedin.com/in/michael-cebrian-94248378</a></div>
      <div>Angular Enterprise Summit · March 19, 2026</div>
    </div>
  </div>
</div>

---
layout: default
class: world-0-1 world-0
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

---
layout: default
class: world-0-2 world-0
---

# The Repo

A small monorepo with a shared Lit web component library and framework-specific consumer apps to reproduce each integration point.

| App | Purpose |
|-----|---------|
| `libs/boxes` | FACE controls built with Lit: combobox, checkbox, calendar-picker, multi-select |
| `apps/boxes-web` | Plain web baseline, no framework |
| `apps/boxes-angular` | Angular consumer, main reproduction app |
| `apps/boxes-react` | React consumer, type-checking comparison |
| `apps/boxes-angular-ssr` | Angular SSR reproduction |
| `apps/boxes-nextjs` | Next.js SSR comparison |

[github.com/JSMike/angular-custom-elements-lost-levels](https://github.com/JSMike/angular-custom-elements-lost-levels)

<!--
Keep this brief. Happy to pull it up and walk through it if there are questions after the talk.
-->

---
layout: cover
background: '#0d1b2a'
---

<div class="ws1-world">
  <div class="v1-scanlines"></div>
  <div class="v1-hud">
    <div class="v1-hud-item">
      <div class="v1-hud-label">SCORE</div>
      <div class="v1-hud-value">000000</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">LIVES</div>
      <div class="v1-hud-value">♥️♥️♥️♥️</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-value" style="color: #4fc3f7">WORLD 1</div>
    </div>
  </div>
  <div class="ws1-center">
    <div class="ws1-eyebrow"><span class="slide-sym">◆</span> LEVEL ONE <span class="slide-sym">◆</span></div>
    <div class="ws1-title">FORM<br>INTEGRATION</div>
    <div class="ws1-sub">ngDefaultControl compatibility<br>with Form-associated Custom Elements</div>
    <div class="ws1-start"><span class="slide-sym">▶</span> LEVEL START! <span class="slide-sym">◀</span></div>
  </div>
  <div class="ws1-deco">
    <div class="ws1-wave"></div>
    <div class="ws1-wave"></div>
    <div class="ws1-wave"></div>
    <div class="ws1-seabed"></div>
  </div>
</div>

---
layout: default
class: world-1-1 world-1
---

# About-FACE <span class="slide-emoji">🤔🔄️</span>

```js
class MyCustomEl extends HTMLElement {
  static formAssociated = true;
  constructor() {
    super();
    this._internals = this.attachInternals();
    /* ... */
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

- `boxes-checkbox` checked → `{ "acceptQuest": "accepted" }`, unchecked → `{}`
- `boxes-multi-select` with Mushroom + Star → `{ "powerUps": ["mushroom", "star"] }`
- `boxes-calendar-picker` after selecting Thurs 19 → `{ "questDate": "2026-03-19" }`

[HTML Spec](https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example) [Webkit Blog](https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/)

<!--
Quick overview for those not familiar with the web component spec, this is how to extend HTMLElement to create a Form Associated Custom Element.
This directly binds the element's value to a `<form>`, which can then be accessed by creating a FormData object and extracting the entries.
Here are some examples.
-->

---
layout: two-cols-header
class: world-1-2 world-1
---

# Angular Forms - In Your FACE

::left::

Angular already ships with multiple value-accessor directives, but only one exposes an opt-in selector: `DefaultValueAccessor` via `ngDefaultControl`.

```html
<boxes-combobox
  formControlName="character"
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
-->

---
layout: default
class: world-1-3 world-1
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
Angular's forms package already supports these patterns but they're trapped behind native selectors.
-->

---
layout: default
class: world-1-4 world-1
---

# When `ngDefaultControl` Is the Only Option

`ngDefaultControl` is the only value-accessor path available for FACE controls today. Applying it to all four controls exposes where that assumption breaks down.

```html
<boxes-combobox formControlName="character" ngDefaultControl>...</boxes-combobox>
<boxes-checkbox formControlName="acceptQuest" ngDefaultControl></boxes-checkbox>
<boxes-calendar-picker formControlName="questDate" ngDefaultControl>...</boxes-calendar-picker>
<boxes-multi-select formControlName="powerUps" ngDefaultControl>...</boxes-multi-select>
```

| Control | Angular `formControl.value` | Native `FormData` | Result |
|---|---|---|---|
| `<boxes-combobox>` | `"mage"` | `"mage"` | ✅ matches |
| `<boxes-checkbox>` after uncheck | `"accepted"` | omitted | ❌ stale |
| `<boxes-calendar-picker>` | `""` | `"2026-03-19"` | ❌ misses `change`-only commit |
| `<boxes-multi-select>` | `"mushroom"` | `["mushroom", "star"]` | ❌ loses multi-value state |

<!--
One directive path exists for custom elements today, so the right question is:
what happens if we force all these controls through that path?
-->

---
layout: default
class: world-1-5 world-1
---

# Saving FACE

As a web component library maintainer, I need to support existing Angular Forms for at least the next two years.  
The ask is small: let FACE controls opt into the directives Angular already ships.

- Extend existing built-in directives with opt-in attribute selectors

<div class="callout mt-6">

Signal Forms is currently in development and I'm genuinely excited about it. My hope is that FACE support is baked in from the start, so the friction points in the current forms API never have a chance to carry over.

</div>

[#63015](https://github.com/angular/angular/issues/63015) — open feature request for ngDefaultControl-style opt-in directives for additional value types

---
layout: cover
background: '#0a0000'
---

<div class="ws2-world">
  <div class="v1-scanlines"></div>
  <div class="v1-hud">
    <div class="v1-hud-item">
      <div class="v1-hud-label">SCORE</div>
      <div class="v1-hud-value">026934</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">LIVES</div>
      <div class="v1-hud-value">♥️♥️♥️</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-value" style="color: #ff6d00">WORLD 2</div>
    </div>
  </div>
  <div class="ws2-center">
    <div class="ws2-eyebrow"><span class="slide-sym">◆</span> LEVEL TWO <span class="slide-sym">◆</span></div>
    <div class="ws2-title">TEMPLATE<br>TYPE-CHECK</div>
    <div class="ws2-sub">CUSTOM_ELEMENTS_SCHEMA</div>
    <div class="ws2-start"><span class="slide-sym">▶</span> LEVEL START! <span class="slide-sym">◀</span></div>
  </div>
  <div class="ws2-deco">
    <div class="ws2-flame"></div>
    <div class="ws2-flame"></div>
    <div class="ws2-flame"></div>
    <div class="ws2-lava"></div>
  </div>
</div>

---
layout: two-cols
class: world-2-1 world-2
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
layout: two-cols-header
class: world-2-2 world-2
---

# The Workaround: Proxy Directives

::left::

A generated Angular directive can restore typed template validation.

```ts
// generated by the component library (hypothetically)
@Directive({
  selector: 'boxes-checkbox',
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

::bottom::

<div class="callout">

Even if a library ships these, every new Angular major forces a new major version of the wrapper, a breaking change for consumers who haven't upgraded yet. Could foundational features like `@Directive` and `@Input` be treated as a stable core, so a wrapper could declare `"@angular/core": ">=20"` and just work, as long as it only uses those stable core features?

</div>

---
layout: two-cols
class: world-2-3 world-2
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
The boxes library already generates this. Angular has no equivalent path.
-->

---
layout: default
class: world-2-4 world-2
---

# A Typed Alternative to `CUSTOM_ELEMENTS_SCHEMA`

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

---
layout: cover
background: '#080604'
---

<div class="ws3-world">
  <div class="v1-scanlines"></div>
  <div class="ws3-ceiling"></div>
  <div class="v1-hud">
    <div class="v1-hud-item">
      <div class="v1-hud-label">SCORE</div>
      <div class="v1-hud-value">053440</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">LIVES</div>
      <div class="v1-hud-value">♥️♥️</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-value" style="color: #ffb300">WORLD 3</div>
    </div>
  </div>
  <div class="ws3-center">
    <div class="ws3-eyebrow"><span class="slide-sym">◆</span> LEVEL THREE <span class="slide-sym">◆</span></div>
    <div class="ws3-title">MONOREPO<br>INTEGRATION</div>
    <div class="ws3-sub">Difficulties with Angular<br>in an integrated monorepo</div>
    <div class="ws3-start"><span class="slide-sym">▶</span> LEVEL START! <span class="slide-sym">◀</span></div>
  </div>
  <div class="ws3-floor"></div>
</div>

---
layout: default
class: world-3-1 world-3
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
class: world-3-2 world-3
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
  //# sourceMappingURL=data:...  ← TS compiler appends
  combobox.js.map  ← never read

esbuild follows last comment
  sourcesContent: compiled JS  ← chain stops here
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
class: world-3-3 world-3
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
Storybook and Next.js treat build extension as a first-class feature. Angular's lack of an equivalent makes Web Component tooling integration significantly harder.
-->

---
layout: cover
background: '#0d2137'
---

<div class="ws4-world">
  <div class="v1-scanlines"></div>
  <div class="ws4-cloud ws4-cloud-a"></div>
  <div class="ws4-cloud ws4-cloud-b"></div>
  <div class="ws4-cloud ws4-cloud-c"></div>
  <div class="v1-hud">
    <div class="v1-hud-item">
      <div class="v1-hud-label">SCORE</div>
      <div class="v1-hud-value">093470</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">LIVES</div>
      <div class="v1-hud-value">♥️</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-value" style="color: #fff9c4">WORLD 4</div>
    </div>
  </div>
  <div class="ws4-center">
    <div class="ws4-eyebrow"><span class="slide-sym">◆</span> LEVEL FOUR <span class="slide-sym">◆</span></div>
    <div class="ws4-title">SSR<br>SETUP</div>
    <div class="ws4-sub">Steps required to enable<br>@lit-labs/ssr</div>
    <div class="ws4-start"><span class="slide-sym">▶</span> LEVEL START! <span class="slide-sym">◀</span></div>
  </div>
  <div class="ws4-ground"></div>
</div>

---
layout: two-cols-header
class: world-4-1 world-4
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
layout: default
class: world-4-2 world-4
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
layout: two-cols-header
class: world-4-3 world-4
---

# Lit SSR: What Works · What Doesn't

::left::

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
- This is a known limitation of `@lit-labs/ssr` with child-driven patterns; [lit/lit#1994](https://github.com/lit/lit/issues/1994)

**Takeaway:**  
Simple self-contained FACE controls SSR correctly  
Child-driven controls need an upstream fix in `@lit-labs/ssr`

<!--
This is a split result, not a total failure.
The form mismatch repros survive SSR and hydration, which means the core findings still hold.
The child-driven SSR limitation is a separate upstream issue, not an Angular-specific problem.
-->

---
layout: cover
background: '#020208'
---

<div class="ws5-world">
  <div class="v1-scanlines"></div>
  <div class="v1-hud">
    <div class="v1-hud-item">
      <div class="v1-hud-label">SCORE</div>
      <div class="v1-hud-value">118403</div>
    </div>
    <div class="v1-hud-item">
      <div class="v1-hud-label">LIVES</div>
      <div class="v1-hud-value"></div>
    </div>
    <div class="v1-hud-item">
      <div class="ws5-badge">GAME OVER</div>
    </div>
  </div>
  
  <div class="ws5-center">
    <div class="ws5-eyebrow"><span class="slide-sym">◆</span> CUSTOM ELEMENTS EVERYWHERE: THE LOST LEVELS <span class="slide-sym">◆</span></div>
    <div class="ws5-title">LEADER<br>BOARD</div>
    <div class="ws5-sub">How does Angular rank?</div>
    <div class="ws5-start"><span class="slide-sym">▶</span> INSERT COIN <span class="slide-sym">◀</span></div>
  </div>
</div>

---
layout: default
class: world-5
---

# Custom Elements Everywhere: How Does Angular Score?

#### [custom-elements-everywhere.com](https://custom-elements-everywhere.com/#angular): <span class="score-label">Cleared</span>

Angular has supported Web Components since 2.0, nearly 10 years ago.
Thank you for being an early adopter and helping establish Web Components as a viable target for design systems.

#### The Lost Levels: <span class="score-label">Still in Progress</span>

| Level | What remains | To Clear |
|---|---|---|
| **Forms** | FACE controls need hand-written CVAs | Opt-in selectors; FACE-first Signal Forms |
| **Template-checking** | `CUSTOM_ELEMENTS_SCHEMA` suppresses errors | `customElementManifests` compiler option |
| **Monorepo: Build** | No esbuild extension point | Official build config hook |
| **Monorepo: Debug** | Local libraries break sourcemaps | Sourcemap chaining ([PR #32788](https://github.com/angular/angular-cli/pull/32788)) |
| **SSR** | Lit SSR requires a custom server pipeline | Angular + Lit teams collaborating |

<!--
Leave plenty of time for discussion here.
The goal is alignment, not advocacy.
-->

---
layout: cover
background: '#010108'
---

<div class="gc-screen">
  <div class="gc-scanlines"></div>

  <div class="gc-header"><span class="slide-sym">★</span> STAFF CREDITS <span class="slide-sym">★</span></div>

  <div class="gc-block">
    <div class="gc-role">PRESENTER</div>
    <div class="gc-name">MICHAEL CEBRIAN</div>
  </div>

  <div class="gc-block">
    <div class="gc-role">PRINCIPAL ENGINEER · ENTERPRISE DESIGN SYSTEM</div>
    <div class="gc-name">SENIOR VICE PRESIDENT · M&T BANK</div>
  </div>

  <div class="gc-divider"></div>

  <div class="gc-link">
    <div><a href="https://github.com/JSMike/angular-custom-elements-lost-levels">github.com/JSMike/angular-custom-elements-lost-levels</a></div>
    <div><a href="https://linkedin.com/in/michael-cebrian-94248378">linkedin.com/in/michael-cebrian-94248378</a></div>
    <div>Angular Enterprise Summit · March 19, 2026</div>
  </div>

  <div class="gc-end"><span class="slide-sym">▶</span> THANKS FOR PLAYING <span class="slide-sym">◀</span></div>
</div>

<!--
All repros in the repo are live. Happy to walk through any of them.
-->
