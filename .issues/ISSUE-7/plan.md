# Plan

Updated: 2026-03-15

## Steps

1. Completed: Inspect the reference generators in `../box-model.ui/libs/web/generators` and map the reusable pieces to `libs/boxes`.
2. Completed: Add generator scripts for shared component metadata, `react.d.ts`, and `custom-elements.json`.
3. Completed: Wire generation into the `boxes` build so the generated assets are copied into `dist/libs/boxes` and reflected in package metadata.
4. Completed: Use the generated typings and manifest to measure Angular editor and template-tooling behavior against a baseline consumer.
5. Pending: Package the current findings for Angular: proxy directives are a workable shim, but the preferable upstream direction is manifest-backed custom-element metadata in the compiler and language service.
