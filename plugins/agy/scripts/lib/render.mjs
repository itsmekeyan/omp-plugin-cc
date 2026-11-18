export function renderStatusReport(jobs = []) {
  if (jobs.length === 0) {
    return "No active or recent AGY jobs recorded for this workspace.\n";
  }

  const rows = [
    "| Job ID | Kind | Status | Phase | Created | Summary |",
    "| :--- | :--- | :--- | :--- | :--- | :--- |"
  ];

  for (const job of jobs) {
    const elapsed = job.completedAt
      ? `${Math.round((new Date(job.completedAt) - new Date(job.createdAt)) / 1000)}s`
      : "running";
    const summary = (job.summary || "No summary").replace(/\|/g, "-").slice(0, 50);
    rows.push(
      `| \`${job.id}\` | ${job.kind} | **${job.status}** | ${job.phase || "-"} | ${elapsed} | ${summary} |`
    );
  }

  return `${rows.join("\n")}\n\nUse \`/agy:result <job-id>\` to view output or \`/agy:cancel <job-id>\` to abort a running task.\n`;
}

export function renderJobDetail(job, logs = "") {
  const lines = [
    `# AGY Job Report: ${job.id}`,
    "",
    `- **Kind**: ${job.kind}`,
    `- **Status**: ${job.status}`,
    `- **Phase**: ${job.phase || "n/a"}`,
    `- **Created**: ${job.createdAt}`,
    `- **Completed**: ${job.completedAt || "In progress"}`,
    `- **Log File**: \`${job.logFile}\``,
    ""
  ];

  if (job.summary) {
    lines.push(`### Summary`, job.summary, "");
  }

  if (job.error) {
    lines.push(`### Error`, `\`\`\``, job.error, `\`\`\``, "");
  }

  if (logs) {
    lines.push(`### Output Logs`, `\`\`\``, logs.trim(), `\`\`\``, "");
  }

  return `${lines.join("\n")}\n`;
}

export function renderHandoffReport(payload) {
  const launchCmd = payload.launchCmd || "agy -i";
  const lines = [
    `# AGY Session Handoff`,
    "",
    "The current Claude Code workspace session is ready for handoff to the AGY (Antigravity) harness.",
    "",
    `- **Claude Session ID**: \`${payload.sessionId || "unknown"}\``,
    `- **Transcript Path**: \`${payload.transcriptPath || "auto-detected"}\``,
    `- **Workspace Directory**: \`${payload.cwd}\``
  ];

  if (payload.model) {
    lines.push(`- **Selected Model**: \`${payload.model}\``);
  }
  if (payload.effort) {
    lines.push(`- **Reasoning Effort**: \`${payload.effort}\``);
  }

  lines.push(
    "",
    `### Resume interactively in AGY`,
    "Run in your terminal:",
    "```bash",
    launchCmd,
    "```",
    "This will launch an interactive AGY session in this workspace.",
    "",
    "Or resume the most recent AGY conversation in this repository:",
    "```bash",
    payload.model ? `agy -c --model ${payload.model}` : "agy -c",
    "```"
  );

  if (payload.terminalLaunched) {
    lines.push(
      "",
      `> **Notice**: Automatically opened new terminal tab (${payload.terminalType}) running \`${launchCmd}\`.`
    );
  }

  return `${lines.join("\n")}\n`;
}

export function renderSetupReport(payload) {
  const lines = [
    `# AGY Plugin Setup Check`,
    "",
    `- **Binary Path**: \`${payload.binaryPath || "Not found"}\``,
    `- **AGY Version**: \`${payload.version || "Unknown"}\``,
    `- **Status**: ${payload.ok ? "✅ Ready" : "❌ Incomplete"}`
  ];

  if (!payload.ok) {
    lines.push(
      "",
      "### Troubleshooting",
      "AGY executable was not found in your `$PATH`.",
      "Verify that `agy` is installed and accessible:",
      "```bash",
      "which agy",
      "```",
      "If installed under `~/.local/bin`, ensure it is added to your `$PATH` in `~/.zshrc` or `~/.bashrc`:",
      "```bash",
      "export PATH=\"$HOME/.local/bin:$PATH\"",
      "```"
    );
  }

  return `${lines.join("\n")}\n`;
}

export function renderCancelReport(job) {
  return `Cancelled AGY job \`${job.id}\` (PID: ${job.pid || "unknown"}).\n`;
}
