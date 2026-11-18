# Gemini 3.5 Flash Prompt Recipes

Use these starting templates when dispatching tasks or reviews to Gemini 3.5 Flash via OMP.

---

## 1. Fast Bug Diagnosis

```xml
<task>
Diagnose why the test or command failed in this repository.
Inspect the provided failure logs and code context.
</task>

<context>
{{FAILURE_LOGS_OR_TRACEBACK}}
</context>

<structured_output_contract>
Return:
1. Root cause
2. Supporting code path evidence (file + line numbers)
3. Minimal safe fix recommendation
</structured_output_contract>

<verification_loop>
Verify that the proposed root cause explains the exact error symptoms in the trace.
</verification_loop>
```

---

## 2. Surgical Fix Implementation

```xml
<task>
Implement the minimal safe fix for the identified issue in this repository.
Preserve existing behavior outside the failing path.
</task>

<structured_output_contract>
Return:
1. Summary of changes made
2. Modified files
3. Verification steps run
</structured_output_contract>

<action_safety>
Keep changes tightly scoped to the target issue. Avoid unrelated formatting or cleanup.
</action_safety>

<verification_loop>
Before finalizing, verify that changed code is syntactically coherent and satisfies test criteria.
</verification_loop>
```

---

## 3. Large-Scale Code Review

```xml
<task>
Perform a comprehensive code review of the attached diff.
Evaluate correctness, boundary conditions, edge cases, and performance regressions.
</task>

<diff>
{{DIFF_CONTENT}}
</diff>

<structured_output_contract>
Return:
- Findings ordered by severity: Critical, High, Medium, Low
- For each finding: Affected file, line range, failure scenario, and recommended fix
- Overall ship assessment
</structured_output_contract>

<grounding_rules>
Ground every finding in the provided diff and repository state. Label hypotheses explicitly.
</grounding_rules>
```

---

## 4. Adversarial Architecture Review

```xml
<task>
Challenge the design, assumptions, and failure modes of this implementation.
Identify where this change can break under stress or concurrency.
Focus areas: rollback safety, race conditions, partial failures, data consistency.
</task>

<structured_output_contract>
Return:
1. Identified architectural risks
2. Specific failure scenarios
3. Concrete mitigations
</structured_output_contract>
```
