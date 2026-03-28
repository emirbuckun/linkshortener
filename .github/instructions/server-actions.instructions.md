---
description: Enforce mutation architecture with Next.js server actions, zod validation, typed payloads, and data-layer helpers. Use when creating, updating, or deleting app data.
---

# Server Action Mutation Rules

Use server actions as the only mutation mechanism in this app.

## Non-Negotiable Standards

- All data mutations must be implemented in server actions.
- Server actions must be invoked from client components.
- Server action files must be named `actions.ts`.
- Each `actions.ts` file must be colocated in the same directory as the client component that calls it.
- Inputs passed to server actions must use explicit TypeScript types.
- Do not use `FormData` as the server action input type.
- Validate all server action inputs with Zod before any mutation logic runs.
- Every server action must verify there is a logged-in user before database operations.
- Server actions must use helper functions in `/data` for database mutations.
- Do not write Drizzle queries directly inside server actions.

## Implementation Guardrails

- Keep mutation business logic in server actions and database interaction logic in `/data` helpers.
- If a needed mutation helper does not exist in `/data`, create one there and call it from the server action.
- Perform authentication and Zod validation first, then call `/data` helpers.
