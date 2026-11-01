---
description: Delegate investigation, fix, or multi-agent execution to the OMP rescue subagent
argument-hint: "[--background|--wait] [--model <model|role>] [--effort <low|medium|high>] [what OMP should investigate or solve]"
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

Invoke the `omp:omp-rescue` subagent via the `Agent` tool (`subagent_type: "omp:omp-rescue"`), forwarding the raw user request as the prompt.
The final response must return OMP's output verbatim.

Raw user request:
$ARGUMENTS

Execution rules:
- If the request includes `--background`, run the `omp:omp-rescue` subagent in the background.
- If the request includes `--wait`, run the `omp:omp-rescue` subagent in the foreground.
- If neither flag is present:
  - For short, quick queries, default to foreground.
  - For long-running, multi-file fixes, recommend background.
- Forward any `--model` or `--effort` flags through to the subagent.
- Return OMP's stdout verbatim with zero paraphrasing or commentary.
