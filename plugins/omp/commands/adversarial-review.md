---
description: Run an adversarial OMP review that challenges implementation choices and failure modes
argument-hint: "[--wait|--background] [--base <ref>] [focus area...]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(node:*), Bash(git:*), AskUserQuestion
---

Run an adversarial OMP review to challenge architecture, rollback paths, race conditions, and unhandled edge cases.

Raw slash-command arguments:
$ARGUMENTS

Core constraint:
- This command is review-only.
- Do not fix issues, apply patches, or alter code.
- Return OMP's output verbatim.

Foreground flow:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" adversarial-review "$ARGUMENTS"
```
Return stdout verbatim.

Background flow:
Launch with `Bash(..., run_in_background: true)`:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/omp-companion.mjs" adversarial-review "$ARGUMENTS"
```
Tell the user: "OMP adversarial review started in the background. Check `/omp:status` for progress."
