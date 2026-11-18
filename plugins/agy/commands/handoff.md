---
description: Hand off the active Claude Code session to an interactive AGY (Antigravity) harness session
argument-hint: "[--model <model>] [--effort <low|medium|high|xhigh|max>] [--mode <accept-edits|auto|plan>] [--terminal terminal|mac|iterm|tmux] [--source <claude-jsonl>] [initial prompt]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" handoff "$ARGUMENTS"`

Present the output directly to the user. Preserve the resume command and any launch instructions.
