---
name: agy-result-handling
description: Internal guidance for presenting AGY review and task results to the user
user-invocable: false
---

# AGY Result Handling

When presenting AGY output:
- Preserve verdicts, summaries, findings, and next steps.
- For review output, present findings ordered by severity with exact file paths and line numbers.
- **CRITICAL**: After presenting review findings, STOP. Do NOT automatically apply fixes or edit code unless the user explicitly instructs you to do so.
- If AGY reported an error or missing binary, direct the user to `/agy:setup`.
