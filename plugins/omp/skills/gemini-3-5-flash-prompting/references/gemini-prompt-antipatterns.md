# Gemini 3.5 Flash Prompt Anti-Patterns

Avoid these common pitfalls when prompting Gemini 3.5 Flash in OMP.

---

## 1. Unnecessary Context Redaction
- **Anti-pattern**: Aggressively cutting out files or truncating error logs to save tokens.
- **Better**: Gemini 3.5 Flash supports a 1M token context window. Feed full error logs, full stack traces, and complete related source files to maximize grounded reasoning.

## 2. Vague Output Demands
- **Anti-pattern**: "Look at this code and let me know if it's okay."
- **Better**: Specify an exact `<structured_output_contract>` with severity tiers (Critical/High/Medium/Low) and exact file/line anchors.

## 3. Omitting Reasoning Effort on Hard Problems
- **Anti-pattern**: Running subtle race-condition or architectural audits with default minimal thinking.
- **Better**: Add `--effort high` for complex concurrent paths, state machine invariants, or multi-step root causes.

## 4. Multi-Task Bundling
- **Anti-pattern**: Asking for a review, an implementation, documentation rewrite, and roadmap in a single prompt.
- **Better**: Split into distinct passes: diagnose first, review second, execute fix third.
