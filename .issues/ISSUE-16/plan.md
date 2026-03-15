# Plan

**Date:** 2026-03-15

## Goal

Remove the Lit `change-in-update` warnings without regressing the current SSR-friendly initialization behavior of the child-driven controls.

## Approach

1. Confirm that the warnings are caused by `_syncOptionsFromLightDom()` running in `firstUpdated()` for `combobox`, `multi-select`, and `calendar-picker`.
2. Move the initial light-DOM sync into a pre-render browser update path that does not run during the Lit SSR server renderer.
3. Keep the existing `slotchange` handling for subsequent light-DOM changes.
4. Verify the warnings are gone in the Angular SSR app and that the controls still render and interact correctly.
