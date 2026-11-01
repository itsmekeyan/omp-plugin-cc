# OMP Plugin for Claude Code

A Claude Code plugin to delegate tasks, execute code reviews, and hand off sessions to the **OMP (Oh My Pi)** harness.

Inspired by OpenAI's official `codex-plugin-cc`, this plugin connects Claude Code with your local OMP installation, enabling seamless task delegation and session transitions.

---

## Features

- **`/omp:handoff`**: Hand off the current Claude Code session directly to OMP with `omp --from-claude` or launch into a new terminal/tmux window.
- **`/omp:rescue`**: Delegate complex tasks, multi-agent runs, or second opinions to OMP using the `omp:omp-rescue` subagent.
- **`/omp:review`**: Run read-only code reviews of working-tree changes or branch diffs.
- **`/omp:adversarial-review`**: Run adversarial reviews that challenge architecture, race conditions, and rollback safety.
- **`/omp:status`**, **`/omp:result`**, **`/omp:cancel`**: Manage background OMP tasks without blocking Claude Code.
- **`/omp:setup`**: Verify OMP CLI availability and version.

---

## Requirements

- **Node.js 18.18.0 or later**
- **OMP (Oh My Pi)** installed and reachable in your `$PATH` (`which omp`).

---

## Installation

Inside Claude Code:

1. **Add the marketplace:**
   ```bash
   /plugin marketplace add itsmekeyan/omp-plugin-cc
   ```

2. **Install the plugin:**
   ```bash
   /plugin install omp@omp-plugins
   ```

3. **Reload plugins:**
   ```bash
   /reload-plugins
   ```

4. **Verify setup:**
   ```bash
   /omp:setup
   ```

---

## Usage

### 1. Handoff to OMP (`/omp:handoff`)
Transfers the active workspace and session context into an interactive OMP session:
```bash
/omp:handoff
/omp:handoff --model opus
```
Auto-launch directly in a new terminal tab or multiplexer with a specific model:
```bash
/omp:handoff --model @slow --iterm
/omp:handoff --model opus --tmux
/omp:handoff --terminal
```
### 2. Task Delegation (`/omp:rescue`)
Delegate work to OMP in the foreground or background:
```bash
# Foreground execution
/omp:rescue investigate why integration tests in tests/ are failing

# Route to a specific model or role
/omp:rescue --model openai-codex/gpt-5.4 "fix the auth header parsing bug"

# Background execution for long tasks
/omp:rescue --background refactor the payment gateway adapter
```

### 3. Code Review (`/omp:review` & `/omp:adversarial-review`)
Review working-tree changes:
```bash
/omp:review
```
Review against a base branch:
```bash
/omp:review --base main
```
Run an adversarial challenge review:
```bash
/omp:adversarial-review --base main challenge rollback safety and race conditions
```

### 4. Background Job Management
```bash
# List all workspace jobs
/omp:status

# Inspect a specific job
/omp:status task-a1b2c3

# View full logs of finished job
/omp:result task-a1b2c3

# Cancel a running background job
/omp:cancel task-a1b2c3
```

---

## Development & Testing

```bash
git clone https://github.com/itsmekeyan/omp-plugin-cc.git
cd omp-plugin-cc

# Run test suite
npm test
```

## License

[Apache-2.0](LICENSE)
