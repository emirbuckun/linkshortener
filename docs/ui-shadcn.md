# UI Component Rules

Use shadcn/ui as the only UI component system in this app.

## Component Installation

- Use the shadcn CLI to add components. In this repo, use npm commands:
  - `npx shadcn@latest add <component-name>`
  - Example: `npx shadcn@latest add button`
- Add only the components needed for the current task.
- Do not handcraft replacements for components that exist in shadcn/ui.

## Available Components

- Check the official shadcn/ui components index before implementing UI: https://ui.shadcn.com/docs/components
- Use existing local components in `components/ui/` first.
- If a component is not in local `components/ui/` but exists in shadcn/ui docs, add it with the CLI.
- If a component is not available in core docs, check the shadcn registry directory for vetted options: https://ui.shadcn.com/docs/directory

## Non-Negotiable Standards

- All UI elements must use existing shadcn/ui components.
- Do not create custom UI components when a shadcn/ui component can be used.
- Prefer composing shadcn/ui primitives over building new bespoke component wrappers.

## Implementation Guidelines

- Compose screens from shadcn/ui primitives (for example: `Card`, `Button`, `Input`, `Dialog`) rather than introducing new design systems.
- Keep component source files under `components/ui/` as shadcn-generated, with minimal and intentional edits.
- Use variants and utility classes to style components instead of duplicating component logic.
- Keep accessibility behavior from shadcn/radix primitives intact (focus, keyboard interaction, aria attributes).
- When UI requirements are complex, prefer composing multiple shadcn components instead of creating a single custom catch-all component.

## Implementation Guardrails

- Before adding UI, check `components/ui/` for an existing shadcn/ui component.
- If a required shadcn/ui component is missing, add it using the shadcn pattern for this project instead of writing a custom replacement.
- Keep styling changes within the existing shadcn utility-class approach used in the codebase.
