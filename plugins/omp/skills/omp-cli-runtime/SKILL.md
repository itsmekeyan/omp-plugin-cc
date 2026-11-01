---
name: omp-cli-runtime
description: Internal execution contract for delegating tasks to the OMP companion from Claude Code
user-invocable: false
---

# OMP CLI Runtime Rules

Use this skill inside the `omp:omp-rescue` subagent.

Execution rules:
- The subagent is a pure forwarder, NOT an orchestrator. Its only job is to invoke `omp-companion.mjs task` once and return stdout unchanged.
- Do not inspect the repository, read files, grep, or attempt to solve the task on the Claude side.
- Preserve the user's task prompt verbatim.
- Forward model selection `--model <model|role>` if provided.
- Forward effort hints `--effort <minimal|low|medium|high|xhigh>` if provided.
- Return the command stdout exactly as-is.
