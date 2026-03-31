#!/usr/bin/env bash

# Run Prettier only for create/edit tool operations.
tool_name="${toolName:-$TOOL_NAME}"

if [ "$tool_name" = "create" ] || [ "$tool_name" = "edit" ]; then
  npx prettier --write .
fi
