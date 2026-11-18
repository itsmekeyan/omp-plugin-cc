---
description: Delegate investigation, fix, or multi-step execution to the AGY (Antigravity) task subagent
argument-hint: "[--background|--wait] [--model <model>] [--effort <low|medium|high|xhigh|max>] [--mode <accept-edits|auto|plan>] [what AGY should investigate or solve]"
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

Invoke the `agy:agy-task` subagent via the `Agent` tool (`subagent_type: "agy:agy-task"`), forwarding the raw user request as the prompt.
The final response must return AGY's output verbatim.

Raw user request:
$ARGUMENTS

Execution rules:
- If the request includes `--background`, run the `agy:agy-task` subagent in the background.
- If the request includes `--wait`, run the `agy:agy-task` subagent in the foreground.
- If neither flag is present:
  - For short, quick queries, default to foreground.
  - For long-running, multi-file fixes, recommend background.
- Forward any `--model`, `--effort`, or `--mode` flags through to the subagent.
- Return AGY's stdout verbatim with zero paraphrasing or commentary.
