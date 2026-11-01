---
name: gemini-3-5-flash-prompting
description: Specialized prompt engineering and execution guidance for Gemini 3.5 Flash when running tasks, reviews, and diagnoses in OMP
user-invocable: false
---

# Gemini 3.5 Flash Prompting Guide

Use this skill when composing prompts for Gemini 3.5 Flash (`gemini-3.5-flash`), the default execution model in OMP.

## Model Profile

- **Context Window**: 1,000,000 tokens (1M).
- **Max Output**: 66,000 tokens (66K).
- **Thinking / Reasoning Levels**: `minimal`, `low`, `medium`, `high`.
- **Strengths**: Ultra-low latency, massive context comprehension, fast multi-file navigation, and structured code generation.

---

## Core Prompting Rules

1. **Leverage the 1M Context Window Freely**:
   Unlike models with 8k-32k context windows, Gemini 3.5 Flash excels when provided with complete target files, full test logs, and entire diffs. Do not aggressively compress or omit relevant repository context.

2. **Select Thinking Levels Intentionally**:
   - `--effort minimal`: Mechanical refactors, formatting, doc updates, and fast syntax fixes.
   - `--effort low`: Single-file bug fixes, test implementations, and lightweight reviews.
   - `--effort medium` (Default): Multi-file diagnosis, feature implementation, and code reviews.
   - `--effort high`: Complex concurrency bugs, architectural challenge reviews, rollback safety analysis.

3. **Use Modular XML Prompt Blocks**:
   Gemini 3.5 Flash adheres strictly to structured XML tags:
   - `<task>`: The explicit job, target files, and expected end state.
   - `<structured_output_contract>`: Clear output schema, severity ordering, and brevity rules.
   - `<verification_loop>`: Mandate self-verification against observed error logs before finalizing.
   - `<grounding_rules>`: Require claims to be grounded in verified code paths, not inferences.

4. **Operator Framing**:
   Instruct the model as an operator with clear success criteria:
   - State what "done" looks like.
   - Enforce safe editing: forbid unsolicited stylistic changes, unrelated renames, or broad refactors.

---

## Quick Reference Templates

Detailed prompt recipes and anti-patterns live in:
- [references/gemini-prompt-recipes.md](references/gemini-prompt-recipes.md)
- [references/gemini-prompt-antipatterns.md](references/gemini-prompt-antipatterns.md)
