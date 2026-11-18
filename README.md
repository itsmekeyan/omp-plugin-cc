# Agent Companion Plugins for Claude Code

A collection of Claude Code plugins to delegate tasks, execute code reviews, and hand off sessions to **AGY (Antigravity)** and **OMP (Oh My Pi)**.

Inspired by OpenAI's official `codex-plugin-cc`, this repository provides seamless bridges connecting Claude Code with local agent harnesses.

---

## Available Plugins

| Plugin | Marketplace ID | Target Agent | Primary Models |
|---|---|---|---|
| **AGY** | `agy@omp-plugins` | **AGY (Antigravity)** CLI (`agy`) | `gemini-3.8-flash-medium`, `gemini-3.8-flash-high`, `claude-sonnet-4-6`, `claude-opus-4-6-thinking` |
| **OMP** | `omp@omp-plugins` | **OMP (Oh My Pi)** CLI (`omp`) | `gemini-3.5-flash`, `opus` |

---

## AGY Plugin (`plugins/agy`)

Delegate tasks, run code reviews, and hand off interactive sessions to the **AGY (Antigravity)** CLI harness from inside Claude Code.

### AGY Features

- **`/agy:task`** (or **`/agy:rescue`**): Delegate investigation, bug fixes, or complex tasks to the `agy:agy-task` subagent.
- **`/agy:handoff`**: Hand off the active Claude Code session to an interactive AGY session (with optional terminal tabs: iTerm2, tmux, Terminal.app).
- **`/agy:review`**: Run read-only code reviews of working tree changes or branch diffs via AGY.
- **`/agy:adversarial-review`**: Challenge architecture, rollback safety, and race conditions.
- **`/agy:status`**, **`/agy:result`**, **`/agy:cancel`**: Manage background AGY jobs without blocking Claude Code.
- **`/agy:setup`**: Verify AGY CLI availability and version.
- **Model & Effort Routing**: Specify `--model` (e.g., `gemini-3.8-flash-high`, `claude-opus-4-6-thinking`) and `--effort` (`low`, `medium`, `high`, `xhigh`, `max`).
- **Execution Mode**: Specify `--mode` (`accept-edits`, `auto`, `plan`).

### AGY Installation

Inside Claude Code:

1. **Add the marketplace (if not already added):**
   ```bash
   /plugin marketplace add itsmekeyan/omp-plugin-cc
   ```

2. **Install the AGY plugin:**
   ```bash
   /plugin install agy@omp-plugins
   ```

3. **Reload plugins:**
   ```bash
   /reload-plugins
   ```

4. **Verify setup:**
   ```bash
   /agy:setup
   ```

### AGY Usage Examples

#### 1. Task Delegation (`/agy:task`)
```bash
# Delegate investigation in foreground
/agy:task investigate why the auth session tests are failing

# Run with high reasoning effort and specific model
/agy:task --model gemini-3.8-flash-high --effort high "audit database migration script"

# Run long refactor in the background
/agy:task --background refactor legacy payment gateway adapter

# Run in pure planning mode
/agy:task --mode plan design the multi-tenant architecture
```

#### 2. Interactive Session Handoff (`/agy:handoff`)
```bash
# Basic handoff prompt
/agy:handoff

# Auto-launch into a new iTerm2 or tmux window with specific model
/agy:handoff --model claude-opus-4-6-thinking --effort high --iterm
/agy:handoff --tmux
```

#### 3. Code Review (`/agy:review` & `/agy:adversarial-review`)
```bash
# Review uncommitted changes
/agy:review

# Review against base branch
/agy:review --base main

# Adversarial review challenging failure modes
/agy:adversarial-review --base main --effort high challenge rollback safety and concurrency
```

#### 4. Background Job Management
```bash
# List all workspace jobs
/agy:status

# Inspect a specific job and view its logs
/agy:status task-a1b2c3

# View full logs of completed job
/agy:result task-a1b2c3

# Cancel a running background job
/agy:cancel task-a1b2c3
```

---

## OMP Plugin (`plugins/omp`)

Delegate tasks, execute code reviews, and hand off sessions to the **OMP (Oh My Pi)** harness.

### OMP Features

- **`/omp:handoff`**: Hand off active Claude Code session to OMP (`omp --from-claude`).
- **`/omp:rescue`**: Delegate complex tasks to OMP using `omp:omp-rescue`.
- **`/omp:review`**: Run read-only code reviews.
- **`/omp:adversarial-review`**: Run adversarial architectural reviews.
- **`/omp:status`**, **`/omp:result`**, **`/omp:cancel`**: Manage background OMP tasks.
- **`/omp:setup`**: Verify OMP CLI installation.

### OMP Installation

```bash
/plugin marketplace add itsmekeyan/omp-plugin-cc
/plugin install omp@omp-plugins
/reload-plugins
/omp:setup
```

---

## Development & Testing

```bash
git clone https://github.com/itsmekeyan/omp-plugin-cc.git
cd omp-plugin-cc

# Run test suite for both plugins
npm test
```

## License

[Apache-2.0](LICENSE)
