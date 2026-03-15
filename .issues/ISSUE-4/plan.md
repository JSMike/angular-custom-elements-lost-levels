# Plan

## Objective

Maintain the plain web baseline and build the first Angular consumer app so the repository can directly compare Angular form state against native `FormData` for the same FACE controls.

## Steps

- [x] Build the baseline FACE fixtures in `libs/boxes`.
- [x] Build the plain web harness with dependent combobox and checkbox flow.
- [x] Move the plain web app from `app/boxes-web` to `apps/boxes-web` and update Nx/Vite/TS paths.
- [x] Create the first Angular consumer app with the same dependent form structure.
- [x] Verify the Angular app shows both Angular form state and native `FormData` state.

## Notes

- The implementation is based on the WAI-ARIA APG select-only combobox example and the WHATWG form-associated custom element example.
- `apps/boxes-angular` intentionally uses Angular forms with `ngDefaultControl` on the custom elements to expose how Angular handles FACE controls differently from native form submission.
- The Angular app consumes the built `dist/libs/boxes` entrypoints rather than the raw library source because Angular cannot bundle the Vite-specific `?inline` style imports directly from `libs/boxes/src`.
