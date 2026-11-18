---
name: gemini-prompting
description: Specialized prompt engineering and execution guidance for Gemini models in AGY
user-invocable: false
---

# Gemini Prompting Guide for AGY

Use this skill when composing prompts for Gemini models (`gemini-3.8-flash-high`, `gemini-3.8-flash-medium`, `gemini-3.8-flash-low`), the default execution models in AGY.

## Model Profile

- **Context Window**: 1,000,000+ tokens.
- **Max Output**: 64,000+ tokens.
- **Reasoning Effort Levels**: `low`, `medium`, `high`, `xhigh`, `max`.
- **Strengths**: Ultra-low latency, massive context comprehension, fast multi-file navigation, and structured code generation.

---

## Core Prompting Rules

1. **Leverage the Large Context Window Freely**:
   Unlike models with small context windows, Gemini excels when provided with complete target files, full test logs, and entire diffs. Do not aggressively compress or omit relevant repository context.

2. **Select Thinking Levels Intentionally**:
   - `--effort low`: Single-file bug fixes, test implementations, doc updates, and lightweight reviews.
   - `--effort medium` (Default): Multi-file diagnosis, feature implementation, and code reviews.
   - `--effort high` / `--effort xhigh` / `--effort max`: Complex concurrency bugs, architectural challenge reviews, rollback safety analysis.

3. **Specify Explicit Verification Criteria**:
   Always instruct Gemini to run existing tests or build commands before concluding.

4. **Reference Recipes and Anti-Patterns**:
   - Refer to [gemini-prompt-recipes.md](./references/gemini-prompt-recipes.md) for task templates.
   - Refer to [gemini-prompt-antipatterns.md](./references/gemini-prompt-antipatterns.md) to avoid common pitfalls.
