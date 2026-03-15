# ISSUE-6: Investigate Angular sourcemap handling for aliased local Web Component packages

<!-- Metadata -->

| Field      | Value          |
| ---------- | -------------- |
| Status     | done           |
| Owner      | TBD            |
| Complexity | medium         |
| Created    | 2026-03-14     |
| Source     | readme-roadmap |
| External   |                |
| Blocks     |                |
| Blocked-by |                |
| Priority   | medium         |

## Summary

Determine the cleanest way for Angular apps in this workspace to consume local Web Component packages during development and reproduction work.

## Prompt

Seeded from the `README.md` heading `Aliasing / Build Config`.

## Requirements

- Test whether Angular can consume the local component library directly from source.
- Test whether Angular requires prebuilt package output for reliable consumption.
- Document aliasing, packaging, and module-resolution constraints encountered.
- Recommend the smallest repo structure that still supports portable reproductions.
- Preserve notes that can be reused when future Angular repro apps are added.

## Current Session Focus

- Correct the sourcemap finding so it reflects the actual browser behavior in the current repo.
- Distinguish what is verified from what is still only a hypothesis about Angular's internal resolution behavior.

## Known Findings

- `apps/boxes-angular/src/main.ts` imports the Web Components through `@/boxes/*`.
- `apps/boxes-angular/tsconfig.json` resolves that alias to `dist/libs/boxes/*` inside the same monorepo.
- This dist-alias path exists by design in the current repo because Angular is not consuming the raw `libs/boxes/src/*` source directly.
- The `boxes` library can emit external `.js.map` files for its built output.
- The transpiled library files in `dist/libs/boxes/*.js` still include `//# sourceMappingURL=...` comments such as `//# sourceMappingURL=combo-box.js.map`.
- `apps/boxes-angular` development builds can enable Angular sourcemaps with `scripts`, `styles`, and `vendor` all turned on.
- Even with both of those in place, Angular's emitted `dist/apps/boxes-angular/browser/main.js.map` still points to:
  - `dist/libs/boxes/property-DhOurD-o.js`
  - `dist/libs/boxes/query-DMPvxsdM.js`
  - `dist/libs/boxes/combo-box.js`
  - `dist/libs/boxes/checkbox.js`
  - `dist/libs/boxes/select-multiple.js`
  - `dist/libs/boxes/calendar-picker.js`
- The Angular bundle map embeds the transpiled library files as `sourcesContent`, which is why Chrome DevTools can still show the built JavaScript.
- The Angular dev server serves `main.js.map`, but it does **not** serve the aliased library URLs:
  - `/dist/libs/boxes/combo-box.js` -> `404`
  - `/dist/libs/boxes/combo-box.js.map` -> `404`
- Because that second-level sourcemap URL is not served to the browser, Chrome DevTools cannot follow the library's `sourceMappingURL` comment back to `libs/boxes/src/*`.
- Angular's Vite dev-server configuration explicitly allows `node_modules` and asset paths, while the Angular memory plugin serves only generated application output files. This supports the conclusion that the aliased `dist/libs/boxes/*` path is outside what the dev server exposes directly.
- Not directly confirmed from the current repo: a browser request to `node_modules/@/boxes/*`. The emitted `main.js.map` references `dist/libs/boxes/*.js`, not `node_modules`.
- This is the useful repro point for the presentation: in the current repository, the browser debugger falls back to transpiled library JavaScript because the second-level library sourcemap path is unavailable.
