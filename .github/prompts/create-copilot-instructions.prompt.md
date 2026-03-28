---
name: create-copilot-instructions
description: Draft or update Copilot instruction files for workspace or user scope with clear rules, applyTo patterns, and concise guardrails.
argument-hint: Topic, scope, and target file for the instructions
agent: agent
---

Create or update a Copilot instruction file based on the user request. Generate a [NAME].instructions.md file in the /.github/instructions directory with clear, concise rules and guardrails. If a file already exists, preserve valid rules and only add new ones relevant to the request. Update AGENTS.md to reference the new or updated instructions file.

Inputs to infer or ask for:

- Instruction scope: workspace or user profile
- Instruction type: general instructions, file-scoped instructions, agent instructions, or skill guidance
- Target path and filename
- Rules to enforce, including required and forbidden behaviors
- Optional applyTo patterns for file-scoped instructions

Workflow:

1. Identify missing essentials. If any are unclear, ask only the minimum targeted questions before writing.
2. Propose the best target file path and explain why.
3. Draft the instruction content using short, specific, enforceable bullets.
4. Keep scope tight: include only rules relevant to the requested task.
5. If an existing instruction file is provided, preserve valid rules and improve clarity without broad rewrites.

Quality bar:

- Use concrete trigger phrases in description fields so the instruction is discoverable.
- Avoid vague language like should when must is intended.
- Keep instructions concise and non-redundant.
- Prefer safe defaults and explicit guardrails.

Output format:

- Proposed file path
- Draft file content
- Assumptions made
- Open questions to finalize
