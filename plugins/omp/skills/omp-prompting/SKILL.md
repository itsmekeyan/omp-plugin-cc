---
name: omp-prompting
description: Internal guidance for structuring prompts sent to OMP for coding, debugging, and multi-agent execution
user-invocable: false
---

# OMP Prompting Guide

When delegating tasks to OMP:
- State the task clearly and describe the expected end state.
- Include failure logs, traceback details, or target file paths.
- Request verification before completion (e.g. running the relevant tests or build checks).
- If delegating multi-agent tasks, describe the boundaries between subtasks so OMP's internal `task` dispatcher can parallelize effectively.
- By default, tasks route to `gemini-3.5-flash` with a 1M token context window. Include complete files and stack traces without aggressive truncation.
- For subtle concurrency, state-machine, or architectural audits, specify `--effort high` to activate deeper thinking.
