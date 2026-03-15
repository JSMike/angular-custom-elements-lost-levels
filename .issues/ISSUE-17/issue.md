# ISSUE-17: Confirm Lit dev-mode warning source in Angular apps

<!-- Metadata -->
| Field        | Value            |
|--------------|------------------|
| Status       | done             |
| Owner        | TBD              |
| Complexity   | small            |
| Created      | 2026-03-15       |
| Source       | user-request     |
| External     |                  |
| Blocks       |                  |
| Blocked-by   |                  |
| Priority     | low              |

## Summary

Confirm whether the Lit dev-mode warning shown in the Angular and Angular SSR apps is caused by the `libs/boxes` bundle, or whether it is expected because `lit` remains external and the Angular apps are resolving Lit in development mode.

## Prompt

"Both the Angular and Angular SSR apps are showing this warning ... this is due to the libs/boxes library not setting NODE_ENV=production during build"

## Requirements

- Determine whether `libs/boxes` bundles `lit` or keeps it external.
- Confirm whether the warning points to a real packaging problem in this repo.
- If it is not a real issue, document why no code change is required and close it.
