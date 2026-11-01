export function renderStatusReport(jobs = []) {
  if (jobs.length === 0) {
    return "No active or recent OMP jobs recorded for this workspace.\n";
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

  return `${rows.join("\n")}\n\nUse \`/omp:result <job-id>\` to view output or \`/omp:cancel <job-id>\` to abort a running task.\n`;
}

export function renderJobDetail(job, logs = "") {
  const lines = [
    `# OMP Job Report: ${job.id}`,
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
  const launchCmd = payload.launchCmd || "omp --from-claude";
  const lines = [
    `# OMP Session Handoff`,
    "",
    "The current Claude Code workspace session is ready for handoff to the OMP harness.",
    "",
    `- **Claude Session ID**: \`${payload.sessionId || "unknown"}\``,
    `- **Transcript Path**: \`${payload.transcriptPath || "auto-detected"}\``,
    `- **Workspace Directory**: \`${payload.cwd}\``
  ];

  if (payload.model) {
    lines.push(`- **Selected Model**: \`${payload.model}\``);
  }

  lines.push(
    "",
    `### Resume interactively in OMP`,
    "Run in your terminal:",
    "```bash",
    launchCmd,
    "```",
    "This will launch OMP's interactive TUI and present the Claude session picker.",
    "",
    "Or start a fresh OMP session in this directory:",
    "```bash",
    payload.model ? `omp --model ${payload.model}` : "omp",
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
    `# OMP Plugin Setup Check`,
    "",
    `- **Binary Path**: \`${payload.binaryPath || "Not found"}\``,
    `- **OMP Version**: \`${payload.version || "Unknown"}\``,
    `- **Status**: ${payload.ok ? "✅ Ready" : "❌ Incomplete"}`
  ];

  if (!payload.ok) {
    lines.push(
      "",
      "### Troubleshooting",
      "OMP executable was not found in your `$PATH`.",
      "Ensure OMP is installed. If using Bun, verify `~/.bun/bin` is in your `PATH`:",
      "```bash",
      "export PATH=\"$HOME/.bun/bin:$PATH\"",
      "```"
    );
  }

  return `${lines.join("\n")}\n`;
}

export function renderCancelReport(job) {
  return `Cancelled OMP job \`${job.id}\` (PID: ${job.pid || "unknown"}).\n`;
}
