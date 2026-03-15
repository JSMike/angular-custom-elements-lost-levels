# Plan

## Objective

Tighten the local package-consumption path so Angular can debug the built `boxes` library properly while consuming it from `dist/libs/boxes`.

## Steps

- [x] Inspect the current `libs/boxes` Vite output and confirm sourcemaps are missing.
- [x] Enable sourcemap generation in the library build configuration.
- [x] Rebuild the library and verify `.map` files are emitted alongside the JS entrypoints.
- [x] Rebuild the Angular app to confirm it still consumes the built package cleanly.
- [x] Verify whether the Angular development build remaps those library sourcemaps back to `libs/boxes/src/*`.
- [x] Document the current result if Angular still stops at `dist/libs/boxes/*.js`.

## Notes

- `apps/boxes-angular` currently consumes `dist/libs/boxes/*` by design because Angular cannot bundle the raw library source with Vite-specific `?inline` style imports.
- Angular development builds now enable script, style, and vendor sourcemaps, but the emitted `main.js.map` still references `dist/libs/boxes/*.js` instead of the original library source files.
- This task is focused on the debug experience of that built-package path, not on revisiting direct source consumption.
