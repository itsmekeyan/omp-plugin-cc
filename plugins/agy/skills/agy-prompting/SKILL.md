---
name: agy-prompting
description: Internal guidance for structuring prompts sent to AGY for coding, debugging, and multi-step execution
user-invocable: false
---

# AGY Prompting Guide

When delegating tasks to AGY:
- State the task clearly and describe the expected end state.
- Include failure logs, traceback details, or target file paths.
- Request verification before completion (e.g. running the relevant tests or build checks).
- If delegating multi-agent tasks or planning, describe the boundaries between subtasks so AGY's planning mode or workflow dispatcher can organize effectively.
- By default, tasks route to `gemini-3.8-flash-medium` with a massive context window. Include complete files and stack traces without aggressive truncation.
- For subtle concurrency, state-machine, or architectural audits, specify `--effort high` or `--effort max` to activate deeper reasoning.
- To enforce pure planning without edits, specify `--mode plan`. To allow autonomous edits and terminal tool calls, use `--mode auto` or `--mode accept-edits`.
