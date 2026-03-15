# Angular Web Component Integration

This repository is for isolating Web Component integration issues that appear in Angular, validating the same behavior outside Angular, and then turning the validated findings into presentation material.

## Current Status

- `libs/boxes` contains the baseline custom elements used as repro fixtures.
- `apps/boxes-web` is a plain web harness used to confirm baseline behavior before Angular is introduced.
- `apps/boxes-angular` is the first Angular consumer app used to compare Angular form state with the plain web baseline.
- Current known limitation: when Angular consumes the built Web Component library from the same monorepo, Chrome DevTools still stops at `dist/libs/boxes/*.js` instead of mapping back to `libs/boxes/src/*`, even when the library emits sourcemaps.
- The current goal is to grow the component set, then add Angular repro apps, then add comparison apps in other frameworks or plain web where needed.

## Roadmap

1. Expand the baseline Web Component library with the smallest set of components needed to trigger integration edge cases.
2. Create one or more Angular consumer apps with a consistent reproduction structure.
3. Reproduce and document the Angular-specific issues tracked below.
4. Build comparison consumers in plain web and other frameworks to confirm whether each issue is unique to Angular.
5. Convert validated reproductions into slides that show setup, expected behavior, Angular behavior, comparison behavior, and the takeaway.

The level 2 headings below map directly to tracked backlog issues in `.issues/`.

## Form Associated Custom Elements

Tracked in [ISSUE-4](./.issues/ISSUE-4/issue.md).

Goal: determine whether Angular forms can work cleanly with form-associated custom elements, or whether Angular still forces custom `ControlValueAccessor` integration for cases the platform already supports.

Initial questions:

- Does Angular preserve native form participation, submission, and validation behavior?
- Which scenarios still require a custom `ControlValueAccessor`?
- How different is the Angular setup from the plain web baseline?

Done when:

- There is a minimal Angular repro and a matching non-Angular comparison.
- The required workaround and slide takeaway are documented.

## SSR

Tracked in [ISSUE-5](./.issues/ISSUE-5/issue.md).

Goal: verify how Angular SSR and hydration behave when pages render custom elements, especially before the elements are defined on the client.

Initial questions:

- Does SSR output remain stable once custom elements upgrade?
- Are there hydration warnings, mismatches, or broken interactions?
- Which mitigations are Angular-specific versus generally required for custom elements?

Done when:

- There is a reproducible SSR case with expected and actual behavior captured.
- Comparison notes make clear whether the problem is Angular-specific.

## Aliasing / Build Config

Tracked in [ISSUE-6](./.issues/ISSUE-6/issue.md).

Goal: define the cleanest way for Angular apps in this workspace to consume local Web Components during development and reproduction work.

Current finding:

- `libs/boxes` can emit `.js.map` files, and `apps/boxes-angular` can enable Angular development sourcemaps with vendor resolution.
- That is still not enough when the Angular app consumes the built library from the same monorepo path.
- Angular's emitted `main.js.map` stops at `dist/libs/boxes/*.js` instead of chaining back to `libs/boxes/src/*`, which leaves the original component sources unavailable in Chrome DevTools.

Initial questions:

- Can Angular consume the component library directly from source, or does it need a built package?
- Which aliasing, packaging, or module-resolution constraints get in the way?
- What setup produces the smallest and most portable repro repository?

Done when:

- There is a documented Angular consumption path that is either proven to work or proven to fail in a reproducible way.
- The repo structure needed for future repros is clear.

## IDE Integration

Tracked in [ISSUE-7](./.issues/ISSUE-7/issue.md).

Goal: understand how well Angular tooling recognizes custom element typings, attributes, events, and manifests during authoring.

Initial questions:

- Can Angular template tooling use generated typings or a Web Component Manifest?
- Which editor warnings are valid, and which require suppression or schema changes?
- How much friction does Angular introduce compared with plain HTML or other frameworks?

Done when:

- The tooling limitations and available mitigations are documented.
- The slide takeaway is supported by concrete editor and type-checking examples.

## Template Binding

Tracked in [ISSUE-8](./.issues/ISSUE-8/issue.md).

Goal: confirm how Angular binds to custom element properties and attributes, including timing and upgrade-order edge cases.

Initial questions:

- Does `[binding]="value"` target a DOM property, an attribute, or depend on timing?
- How do property bindings compare with `attr.` bindings and plain DOM assignment?
- Are there upgrade-order issues when Angular renders before the custom element definition is loaded?

Done when:

- There is a minimal repro covering property binding, attribute binding, and upgrade timing.
- The Angular behavior is compared against the plain web baseline and summarized for slides.
