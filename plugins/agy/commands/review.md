---
description: Run an AGY code review against local git state
argument-hint: "[--wait|--background] [--model <model>] [--effort <low|medium|high>] [--base <ref>]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(node:*), Bash(git:*), AskUserQuestion
---

Run an AGY review against local working tree changes or a base branch.

Raw slash-command arguments:
$ARGUMENTS

Core constraint:
- This command is review-only.
- Do not fix issues, apply patches, or suggest changes on your own.
- Your job is to run the review and return AGY's output verbatim.

Execution mode rules:
- If raw arguments include `--wait`, run in foreground.
- If raw arguments include `--background`, run in background with `Bash(..., run_in_background: true)`.
- Otherwise, check git status:
  - If tiny (1-2 files), recommend wait.
  - If larger or multi-file, recommend background.
  - Use `AskUserQuestion` with:
    - `Wait for results`
    - `Run in background`

Foreground flow:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" review "$ARGUMENTS"
```
Return the stdout verbatim.

Background flow:
Launch with `Bash(..., run_in_background: true)`:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/agy-companion.mjs" review "$ARGUMENTS"
```
Tell the user: "AGY review started in the background. Check `/agy:status` for progress."
