---
description: Show running and recent OMP jobs for this repository
argument-hint: "[job-id] [--json]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" status "$ARGUMENTS"`
