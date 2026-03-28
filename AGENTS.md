# Linkshortener Agent Instructions

This file is the entrypoint for all LLM coding agents working in this repository.

## Critical Framework Notice

This project uses a newer Next.js version with breaking differences from older defaults.
Before changing framework-level behavior, consult relevant guides under:

- `node_modules/next/dist/docs/`

## Mandatory Behavior

- Keep changes minimal, safe, and scoped to the request.
- Preserve existing conventions in touched files.
- Do not modify unrelated files.
- Validate changes with lint and targeted checks when relevant.

## Instruction Files

- `.github/instructions/auth-clerk.instructions.md`: Clerk-only authentication rules and required auth flows.
- `.github/instructions/data-fetching.instructions.md`: Data fetching rules (server components + `/data` helpers with Drizzle).
- `.github/instructions/server-actions.instructions.md`: Mutation architecture rules (server actions + Zod validation + `/data` mutation helpers).
- `.github/instructions/ui-shadcn.instructions.md`: UI component rules (use shadcn/ui components and CLI workflow).
