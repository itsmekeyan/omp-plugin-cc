---
description: Show running and recent AGY jobs for this repository
argument-hint: "[job-id] [--json]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" status "$ARGUMENTS"`
