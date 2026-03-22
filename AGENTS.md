# Linkshortener Agent Instructions

This file is the entrypoint for all LLM coding agents working in this repository.

## Required Loading Order

Read these files before making changes.
ALWAYS refer to the relevant .md file BEFORE generating any code:

1. `docs/auth-clerk.md` (for authentication and route-protection behavior)
2. `docs/ui-shadcn.md` (for mandatory UI component usage standards)

## Critical Framework Notice

This project uses a newer Next.js version with breaking differences from older defaults.
Before changing framework-level behavior, consult relevant guides under:

- `node_modules/next/dist/docs/`

## Mandatory Behavior

- Keep changes minimal, safe, and scoped to the request.
- Preserve existing conventions in touched files.
- Do not modify unrelated files.
- Validate changes with lint and targeted checks when relevant.
