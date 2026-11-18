# Setup Guide: Running Claude Code with Codex Subscription on Windows

> **Purpose**: This runbook instructs an AI agent (such as Codex CLI) or human developer on how to set up and run the **Claude Code Terminal UI** on Windows using an active **Codex subscription** (`codex login`), without requiring any OpenAI API key or Anthropic/Claude subscription.

---

## 1. Architectural Overview

```
┌─────────────────────────┐
│ Claude Code CLI (Win)   │
│ (Interactive TUI App)   │
└────────────┬────────────┘
             │  POST /v1/messages (Anthropic schema)
             ▼
┌─────────────────────────┐
│ codex-router Daemon     │  (Listens on 127.0.0.1:4202)
│ (Translates schema)     │
└────────────┬────────────┘
             │  Internal OAuth loopback
             ▼
┌─────────────────────────┐
│ Local Codex Session     │  (Reads ~/.codex/auth.json from `codex login`)
│ (OpenAI GPT-5.4 / o3)   │
└─────────────────────────┘
```

- **Claude Code bypass**: Setting `ANTHROPIC_BASE_URL` and a dummy `ANTHROPIC_API_KEY` forces Claude Code to bypass Anthropic's OAuth login entirely.
- **Codex subscription reuse**: `codex-router` taps into the existing Windows `codex login` OAuth credentials, converting incoming Anthropic Messages requests into Codex executions.

---

## 2. Prerequisites Verification

Before proceeding, open **PowerShell** (as Administrator or regular user) and ensure the prerequisites are present:

```powershell
# 1. Verify Node.js (v18.18.0 or later required)
node -v

# 2. Verify Git is available
git --version

# 3. Ensure PowerShell script execution is enabled for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

---

## 3. Step-by-Step Installation Instructions

### Step 3.1: Install Global CLI Tools

Install both the official Codex CLI and Claude Code CLI:

```powershell
npm install -g @openai/codex
npm install -g @anthropic-ai/claude-code
```

### Step 3.2: Authenticate Codex with your Subscription

Log in to your OpenAI account. This opens your default Windows browser (Edge/Chrome) to complete OAuth:

```powershell
codex login
```

Verify that Codex works in the terminal:
```powershell
codex "echo hello"
```

---

### Step 3.3: Install `codex-router` on Windows

`codex-router` is the background translation layer that connects Claude Code's Anthropic API requests to your local Codex session without needing an API key:

```powershell
$installer = Join-Path $env:TEMP "codex-router-install.ps1"
Invoke-WebRequest "https://raw.githubusercontent.com/duolahypercho/codex-router/main/install.ps1" -OutFile $installer
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $installer -Target codex -Guided
```

This sets up:
- The router background service on loopback port `4202`.
- A private caller secret saved at `$env:USERPROFILE\.codex\codex-router\caller-secret`.

---

## 4. Automation: Create the Launcher Script

Create a reusable launcher script named `Start-Claude-Codex.ps1` in your user home directory or project directory:

```powershell
# ==============================================================================
# Start-Claude-Codex.ps1
# Launches Claude Code connected directly to your local Codex subscription
# ==============================================================================

$SecretFile = "$env:USERPROFILE\.codex\codex-router\caller-secret"

if (-not (Test-Path $SecretFile)) {
    Write-Error "ERROR: Codex router secret not found at: $SecretFile"
    Write-Host "Please ensure codex-router is installed and running." -ForegroundColor Yellow
    exit 1
}

# 1. Read the private local capability token
$SECRET = (Get-Content $SecretFile -Raw).Trim()

# 2. Redirect Claude Code to the local Windows loopback gateway
$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:4202/_codex-router/$SECRET/anthropic"

# 3. Set a dummy API key to bypass Anthropic OAuth login prompt
$env:ANTHROPIC_API_KEY = "codex-local-session"

# 4. Ensure tool capabilities (Read, Edit, Bash) remain active
$env:ENABLE_TOOL_SEARCH = "true"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Launching Claude Code powered by your Codex Subscription" -ForegroundColor Green
Write-Host "  Backend: OpenAI Codex (via local router)" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 5. Launch the Claude Code interactive terminal app
claude $args
```

---

## 5. Usage & Verification

To start using Claude Code:

```powershell
# Run from any project folder in PowerShell:
.\Start-Claude-Codex.ps1
```

### What You Should See
1. Claude Code notices the custom endpoint and prints:
   ```text
   ⚠ claude.ai connectors are disabled because ANTHROPIC_API_KEY or another auth source is set...
   ```
2. The full **Claude Code interactive TUI** opens with:
   - Live streaming output
   - Real-time tool-call approvals (`[Y]es / [N]o / [A]lways`)
   - Syntax-highlighted git diff viewers
3. All prompts are answered and code edits are performed by your **Codex subscription**!

---

## 6. Troubleshooting & Health Checks

### Check 1: Is `codex-router` running?
Run this in PowerShell to verify the router daemon is active:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:4202/health"
# Expected response: {"ok": true, "service": "codex-router", ...}
```

If it is not running, restart it:
```powershell
& "$env:USERPROFILE\.local\share\codex-router\bin\codex-router.ps1" start
```

### Check 2: Did the Codex OAuth token expire?
If requests fail with an authentication error:
```powershell
codex login
```
Running `codex login` refreshes the session token in `$env:USERPROFILE\.codex\auth.json`.

### Check 3: Port conflict
If port `4202` is in use by another application:
Check `~/.codex/codex-router/router.log` to view recent startup logs.
