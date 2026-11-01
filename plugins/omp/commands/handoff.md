---
description: Hand off the active Claude Code session to an interactive OMP harness session
argument-hint: "[--model <model|role>] [--effort <low|medium|high>] [--terminal terminal|mac|iterm|tmux] [--source <claude-jsonl>]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" handoff "$ARGUMENTS"`

Present the output directly to the user. Preserve the resume command and any launch instructions.
