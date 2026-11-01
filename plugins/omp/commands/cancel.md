---
description: Cancel an active background OMP job
argument-hint: "<job-id>"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" cancel "$ARGUMENTS"`
