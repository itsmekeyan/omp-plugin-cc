---
name: agy-cli-runtime
description: Internal execution contract for delegating tasks to the AGY companion from Claude Code
user-invocable: false
---

# AGY CLI Runtime Rules

Use this skill inside the `agy:agy-task` subagent.

Execution rules:
- The subagent is a pure forwarder, NOT an orchestrator. Its only job is to invoke `agy-companion.mjs task` once and return stdout unchanged.
- Do not inspect the repository, read files, grep, or attempt to solve the task on the Claude side.
- Preserve the user's task prompt verbatim.
- Forward model selection `--model <model>` if provided.
- Forward effort hints `--effort <low|medium|high|xhigh|max>` if provided.
- Forward mode hints `--mode <accept-edits|auto|plan>` if provided.
- Return the command stdout exactly as-is.
