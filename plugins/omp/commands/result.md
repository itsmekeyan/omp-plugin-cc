---
description: Show the stored output logs for a finished OMP job
argument-hint: "[job-id] [--json]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" result "$ARGUMENTS"`
