---
description: Check OMP installation, binary path, and version
argument-hint: "[--json]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" setup "$ARGUMENTS"`
