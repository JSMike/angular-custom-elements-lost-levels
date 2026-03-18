# Angular: Custom Elements — The Lost Levels

A monorepo exploring Web Component integration friction points in Angular, with companion slides for the Angular Enterprise Summit 2026.

## Apps

| App | Description |
|-----|-------------|
| `apps/boxes-web` | Plain web harness — baseline behavior without any framework |
| `apps/boxes-angular` | Angular consumer app — form integration, template type-checking, and build setup reproductions |
| `apps/boxes-react` | React consumer app — comparison baseline for form integration and type-checking |
| `apps/boxes-angular-ssr` | Angular SSR app — Lit SSR integration reproduction |
| `apps/boxes-nextjs` | Next.js SSR app — comparison baseline for SSR setup |

## Component Library

`libs/boxes` — FACE controls built with Lit. Ships `custom-elements.json` and `react.d.ts`.

- `boxes-combobox` — select-only combobox, mirrors `<input type="text">` semantics
- `boxes-checkbox` — boolean checked state via `ElementInternals`
- `boxes-calendar-picker` — single value via `changes` event
- `boxes-multi-select` — multi-value via `change` event

## Running the Apps

```bash
# Install dependencies
npm install

# Angular app
npx nx serve boxes-angular

# Angular SSR app
npx nx serve boxes-angular-ssr

# React app
npx nx serve boxes-react

# Plain web app
npx nx serve boxes-web

# Next.js app
npx nx dev boxes-nextjs
```

## Slide Deck

The slides are built with [Slidev](https://sli.dev).

```bash
# Start the slide deck
npm run slidev
```

Then open [http://localhost:3030](http://localhost:3030).
