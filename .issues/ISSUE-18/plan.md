# Plan

**Date:** 2026-03-17

## Goal

Understand the current Angular forms directive landscape well enough to explain how native accessors are wired today and where custom elements do or do not fit.

## Approach

1. Read the core directive plumbing in `control_value_accessor.ts` and `shared.ts`.
2. Review the built-in value-accessor directives:
   - `default_value_accessor.ts`
   - `checkbox_value_accessor.ts`
   - `select_control_value_accessor.ts`
   - `select_multiple_control_value_accessor.ts`
   - `radio_control_value_accessor.ts`
   - `number_value_accessor.ts`
   - `range_value_accessor.ts`
3. Review adjacent directive infrastructure where relevant:
   - `ng_model.ts`
   - `ng_form.ts`
   - `validators.ts`
4. Summarize findings in review format without making any code changes.
