# Session Summary

Date: 2026-03-15

## What I Did

- Refined the Angular tooling findings into presentation-ready talking points for the upcoming Angular-team discussion.
- Updated `ISSUE-7` to make the preferred upstream direction explicit: manifest-backed custom-element metadata in Angular's compiler and language service, rather than another suppression-oriented schema token.
- Updated the issue plan so the remaining work is framed around packaging the findings for Angular, not around treating proxy directives as the desired end state.

## Key Points Captured

- The template-tooling problem is separate from the forms/CVA problems.
- Angular's current schema model is suppression-oriented and does not ingest typed custom-element metadata.
- A proxy directive proves the missing piece is Angular-side metadata integration, but it is still only a workaround.
- The stronger Angular contribution path is first-class consumption of `custom-elements.json` or equivalent manifest-backed metadata.

## Follow-Up

- Use the deck updates from `ISSUE-10` as the main presentation artifact for the Angular-team discussion.
