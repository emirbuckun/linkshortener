# Linkshortener Agent Instructions

This file is the entrypoint for all LLM coding agents working in this repository.

## Required Loading Order

Read these files before making changes.

CRITICAL REQUIREMENT: It is mandatory to read the relevant individual instruction files in `/docs` BEFORE generating ANY code.
This is non-optional and takes priority over implementation.

ALWAYS refer to the relevant .md file BEFORE generating any code:

1. `docs/auth-clerk.md` (for authentication and route-protection behavior)
2. `docs/ui-shadcn.md` (for mandatory UI component usage standards)

If a task touches auth, UI, routing, or related behavior, re-check the corresponding `/docs` file(s) first.

## Critical Framework Notice

This project uses a newer Next.js version with breaking differences from older defaults.
Before changing framework-level behavior, consult relevant guides under:

- `node_modules/next/dist/docs/`

## Mandatory Behavior

- Keep changes minimal, safe, and scoped to the request.
- Preserve existing conventions in touched files.
- Do not modify unrelated files.
- Validate changes with lint and targeted checks when relevant.
