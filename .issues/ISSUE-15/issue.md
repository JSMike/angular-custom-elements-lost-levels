# ISSUE-15: Follow up with `@lit-labs/ssr-react` on child-driven custom-element SSR hydration mismatch

<!-- Metadata -->
| Field        | Value            |
|--------------|------------------|
| Status       | backlog          |
| Owner        | TBD              |
| Complexity   | medium           |
| Created      | 2026-03-15       |
| Source       | ISSUE-5          |
| External     | `@lit-labs/ssr-react` |
| Blocks       |                  |
| Blocked-by   |                  |
| Priority     | medium           |

## Summary

Capture the verified Next.js/Lit SSR failure mode where child-driven custom elements render empty iterable parts on the server and then fail hydration on the client because React children are not available on the server-side custom element instance before shadow rendering.

## Prompt

Document the verified issue so it can be followed up with `@lit-labs/ssr-react` later.

## Requirements

- Record the verified reproduction in `apps/boxes-nextjs`.
- Note that the affected controls derive internal render state from light-DOM `<option>` children.
- Note that the server-rendered declarative shadow DOM contains empty iterable parts for the affected controls.
- Note that client hydration then throws `unexpected longer than expected iterable`.
- Capture the likely upstream touchpoints:
  - `@lit-labs/ssr-react/lib/node/wrap-create-element.js`
  - `@lit-labs/ssr-react/lib/node/wrap-jsx.js`
  - `@lit-labs/ssr-react/lib/node/render-custom-element.js`
  - potentially `@lit-labs/ssr-dom-shim`
- Preserve the distinction between:
  - confirmed behavior in this repo
  - likely root cause
  - unverified implementation details
