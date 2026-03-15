# Session Summary

Date: 2026-03-15

## What I Did

- Investigated Angular's compiler and template type-checking path in `../angular` to verify how custom elements are handled.
- Confirmed from source that Angular template checking uses the DOM schema registry plus Angular directive metadata, not ambient custom-element typings or manifest data.
- Confirmed from source and docs that Angular only supports `CUSTOM_ELEMENTS_SCHEMA` and `NO_ERRORS_SCHEMA`; there is no supported custom schema extension point for feeding in `custom-elements.json`.
- Added an Angular proof-of-concept workaround in `apps/boxes-angular/src/app/boxes-proxies.ts`: standalone proxy directives for the four custom elements with typed `@Input`s.
- Updated `apps/boxes-angular/src/app/app.ts` to import those proxy directives and removed `CUSTOM_ELEMENTS_SCHEMA` from the app component.
- Verified the proxy-directive approach by building the Angular app successfully without `CUSTOM_ELEMENTS_SCHEMA`.
- Ran a negative check by temporarily adding `[notARealProp]` to `boxes-checkbox`; Angular correctly failed the build with `NG8002`, then I reverted the temporary invalid binding.
- Updated `ISSUE-7` notes to reflect the verified limitation and the current path forward.

## Verification

- `npx nx build boxes-angular`
  - Passed after importing the proxy directives and removing `CUSTOM_ELEMENTS_SCHEMA`.
- Negative validation check:
  - Temporarily added `[notARealProp]="true"` to `boxes-checkbox` in `apps/boxes-angular/src/app/app.html`.
  - `npx nx build boxes-angular` failed with `NG8002`, confirming Angular was using directive metadata for validation again.
  - Reverted the temporary invalid binding and re-ran `npx nx build boxes-angular` successfully.

## Findings

- `CUSTOM_ELEMENTS_SCHEMA` is a suppression mechanism, not a metadata integration point.
- A generated `.d.ts` or `custom-elements.json` alone does not improve Angular template validation or IDE completion in the current architecture.
- The viable path today is generating Angular proxy directives or wrappers from the same component metadata / custom-elements manifest and importing those into Angular consumers.
- A fuller solution would require upstream Angular support for extensible schemas or manifest ingestion in the compiler and language service.

## Follow-Up

- Turn the proxy-directive proof into generator output under `libs/boxes` so Angular consumers can opt into typed template checking without hand-written shims.
