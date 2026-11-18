---
description: Run an adversarial AGY review that challenges implementation choices and failure modes
argument-hint: "[--wait|--background] [--model <model>] [--effort <low|medium|high|xhigh|max>] [--base <ref>] [focus area...]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(node:*), Bash(git:*), AskUserQuestion
---

Run an adversarial AGY review to challenge architecture, rollback paths, race conditions, and unhandled edge cases.

Raw slash-command arguments:
$ARGUMENTS

Core constraint:
- This command is review-only.
- Do not fix issues, apply patches, or alter code.
- Return AGY's output verbatim.

Foreground flow:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" adversarial-review "$ARGUMENTS"
```
Return stdout verbatim.

Background flow:
Launch with `Bash(..., run_in_background: true)`:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" adversarial-review "$ARGUMENTS"
```
Tell the user: "AGY adversarial review started in the background. Check `/agy:status` for progress."
