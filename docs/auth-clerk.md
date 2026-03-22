# Clerk Auth Rules

Use Clerk as the only authentication provider in this app.

## Non-Negotiable Standards

- All authentication and session checks must use Clerk.
- Do not add or use any non-Clerk auth method (custom auth, NextAuth, JWT-only flows, or parallel providers).
- The `/dashboard` route is protected and must require an authenticated user.
- If an authenticated user opens `/`, redirect them to `/dashboard`.
- Sign in and sign up must open through Clerk modal flows.

## Implementation Guardrails

- For route protection, rely on Clerk middleware or Clerk server/session helpers.
- Keep redirect logic consistent between middleware and page-level handlers.
- If auth behavior is changed, verify these flows:
  - Unauthenticated user can not access `/dashboard`.
  - Authenticated user visiting `/` is redirected to `/dashboard`.
  - Sign-in and sign-up actions launch Clerk modal UI.
