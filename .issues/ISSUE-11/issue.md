# ISSUE-11: Update AI-README with current repo structure and build guidance

<!-- Metadata -->
| Field        | Value        |
|--------------|--------------|
| Status       | done         |
| Owner        | TBD          |
| Complexity   | low          |
| Created      | 2026-03-15   |
| Source       | user-request |
| External     |              |
| Blocks       |              |
| Blocked-by   |              |
| Priority     | medium       |

## Summary

Replace the starter `AI-README.md` template with project-specific guidance that reflects the current repository structure, commands, and operational notes for AI agents.

## Prompt

"the structure of this project has updated considerably, update the AI-README.md file and ensure this detail about slidev is included so that dist/ doesn't get overwritten"

## Requirements

- Update `AI-README.md` to describe the current project purpose and repo layout.
- Document the relevant Nx, npm, and Slidev commands used in this repository.
- Include the specific rule to use `npm run slidev:build` instead of `npx slidev build slides.md`.
- Explain why the raw Slidev build command is a problem in this repo.
- Record the work in `.issues/`.
