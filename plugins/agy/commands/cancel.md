---
description: Cancel an active background AGY job
argument-hint: "<job-id>"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" cancel "$ARGUMENTS"`
