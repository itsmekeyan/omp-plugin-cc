#!/usr/bin/env node
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { parseArgs, splitRawArgumentString } from "./lib/args.mjs";
import { resolveWorkspaceRoot } from "./lib/workspace.mjs";
import {
  generateJobId,
  getJob,
  listJobs,
  upsertJob
} from "./lib/state.mjs";
import {
  createCompanionJob,
  sortJobsNewestFirst,
  terminateProcessTree
} from "./lib/job-control.mjs";
import { collectGitDiff, getGitStatusSummary, isGitRepository } from "./lib/git.mjs";
import {
  renderCancelReport,
  renderHandoffReport,
  renderJobDetail,
  renderSetupReport,
  renderStatusReport
} from "./lib/render.mjs";

const ARG_SCHEMA = {
  wait: "boolean",
  background: "boolean",
  json: "boolean",
  model: "string",
  effort: "string",
  mode: "string",
  base: "string",
  source: "string",
  terminal: "string",
  tmux: "boolean",
  iterm: "boolean",
  "dangerously-skip-permissions": "boolean"
};
const DEFAULT_MODEL = "gemini-3.8-flash-medium";

function getAgyBinary() {
  try {
    return execSync("which agy", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function getAgyVersion() {
  try {
    return execSync("agy --version", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

async function handleSetup(cwd, flags) {
  const binaryPath = getAgyBinary();
  const version = binaryPath ? getAgyVersion() : null;
  const payload = {
    ok: Boolean(binaryPath),
    binaryPath,
    version
  };

  if (flags.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    process.stdout.write(renderSetupReport(payload));
  }
}

async function handleHandoff(cwd, flags, positionals) {
  const transcriptPath = flags.source || process.env.AGY_CLAUDE_TRANSCRIPT_PATH || null;
  const sessionId = process.env.AGY_CLAUDE_SESSION_ID || (transcriptPath ? path.basename(transcriptPath, ".jsonl") : null);

  const selectedModel = flags.model || DEFAULT_MODEL;
  const modelArg = ` --model ${selectedModel}`;
  const effortArg = flags.effort ? ` --effort ${flags.effort}` : "";
  const modeArg = flags.mode ? ` --mode ${flags.mode}` : "";
  const initialPrompt = positionals.join(" ").trim();
  const promptArg = initialPrompt ? ` -i "${initialPrompt.replace(/"/g, '\\"')}"` : " -i";
  const launchCmd = `agy${promptArg}${modelArg}${effortArg}${modeArg}`;

  let terminalLaunched = false;
  let terminalType = null;

  if (flags.iterm) {
    terminalType = "iTerm2";
    try {
      execSync(
        `osascript -e 'tell application "iTerm2" to tell current window to create tab with default profile command "cd ${cwd} && ${launchCmd}"'`,
        { stdio: "ignore" }
      );
      terminalLaunched = true;
    } catch {
      // Ignore if iTerm2 script fails
    }
  } else if (flags.tmux) {
    terminalType = "tmux";
    try {
      execSync(`tmux new-window -c "${cwd}" "${launchCmd}"`, { stdio: "ignore" });
      terminalLaunched = true;
    } catch {
      // Ignore if tmux fails
    }
  } else if (flags.terminal === "terminal" || flags.terminal === "mac") {
    terminalType = "Terminal.app";
    try {
      execSync(
        `osascript -e 'tell application "Terminal" to do script "cd ${cwd} && ${launchCmd}"'`,
        { stdio: "ignore" }
      );
      terminalLaunched = true;
    } catch {
      // Ignore
    }
  }

  const payload = {
    cwd,
    sessionId,
    transcriptPath,
    model: selectedModel,
    effort: flags.effort || null,
    launchCmd,
    terminalLaunched,
    terminalType
  };

  if (flags.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    process.stdout.write(renderHandoffReport(payload));
  }
}

async function executeTask(cwd, { prompt, kind = "task", title = "AGY Task", flags = {} }) {
  const binary = getAgyBinary();
  if (!binary) {
    console.error("❌ 'agy' CLI is not found in PATH. Run /agy:setup.");
    process.exit(1);
  }

  const workspaceRoot = resolveWorkspaceRoot(cwd);
  const jobId = generateJobId(kind);
  const sessionId = process.env.AGY_CLAUDE_SESSION_ID || null;

  const job = createCompanionJob({
    id: jobId,
    kind,
    title,
    workspaceRoot,
    summary: prompt.slice(0, 100),
    sessionId
  });

  const selectedModel = flags.model || DEFAULT_MODEL;
  const agyArgs = ["-p", "--model", selectedModel];

  if (flags.effort) {
    agyArgs.push("--effort", flags.effort);
  }
  if (flags.mode) {
    agyArgs.push("--mode", flags.mode);
  }
  // Enable auto-approval for non-interactive task delegation so tool calls proceed smoothly
  agyArgs.push("--dangerously-skip-permissions");

  agyArgs.push(prompt);

  if (flags.background) {
    const out = fs.openSync(job.logFile, "a");
    const child = spawn(binary, agyArgs, {
      cwd,
      detached: true,
      stdio: ["ignore", out, out]
    });

    job.pid = child.pid;
    upsertJob(workspaceRoot, job);
    child.unref();

    console.log(`AGY ${kind} started in background.`);
    console.log(`- Job ID: ${job.id}`);
    console.log(`- PID: ${job.pid}`);
    console.log(`- Log: ${job.logFile}`);
    console.log(`\nCheck status: \`/agy:status ${job.id}\``);
    console.log(`View result when finished: \`/agy:result ${job.id}\``);
    return;
  }

  // Foreground execution
  upsertJob(workspaceRoot, job);
  const logStream = fs.createWriteStream(job.logFile, { flags: "a" });

  const child = spawn(binary, agyArgs, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    logStream.write(chunk);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
    logStream.write(chunk);
  });

  child.on("close", (code) => {
    logStream.end();
    job.status = code === 0 ? "completed" : "failed";
    job.phase = "done";
    job.completedAt = new Date().toISOString();
    job.exitCode = code;
    upsertJob(workspaceRoot, job);
    process.exit(code ?? 0);
  });
}

async function handleTask(cwd, flags, positionals) {
  const prompt = positionals.join(" ").trim();
  if (!prompt) {
    console.error("Please supply a task for AGY to perform.");
    process.exit(1);
  }
  await executeTask(cwd, {
    prompt,
    kind: "task",
    title: "AGY Task Execution",
    flags
  });
}

async function handleReview(cwd, flags, positionals, adversarial = false) {
  if (!isGitRepository(cwd)) {
    console.error("Current directory is not a git repository.");
    process.exit(1);
  }

  const gitSummary = getGitStatusSummary(cwd);
  if (!gitSummary.hasChanges && !flags.base) {
    console.log("No git changes detected to review.");
    return;
  }

  const diff = collectGitDiff(cwd, flags.base);
  const userFocus = positionals.join(" ").trim();

  let prompt = "";
  if (adversarial) {
    prompt = [
      "Perform an adversarial code review of the following change.",
      "Challenge design choices, unhandled failure modes, race conditions, and rollback safety.",
      userFocus ? `Focus area: ${userFocus}` : "",
      "Report material findings ordered by severity with exact line references.",
      "",
      "Diff:",
      diff.slice(0, 50000)
    ].filter(Boolean).join("\n");
  } else {
    prompt = [
      "Review the following code change for correctness, regressions, and bugs.",
      "Report material findings ordered by severity with exact line references.",
      "",
      "Diff:",
      diff.slice(0, 50000)
    ].join("\n");
  }

  await executeTask(cwd, {
    prompt,
    kind: adversarial ? "adversarial-review" : "review",
    title: adversarial ? "AGY Adversarial Review" : "AGY Review",
    flags
  });
}

async function handleStatus(cwd, flags, positionals) {
  const workspaceRoot = resolveWorkspaceRoot(cwd);
  const jobId = positionals[0];

  if (jobId) {
    const job = getJob(workspaceRoot, jobId);
    if (!job) {
      console.error(`Job '${jobId}' not found in workspace.`);
      process.exit(1);
    }
    let logs = "";
    if (fs.existsSync(job.logFile)) {
      logs = fs.readFileSync(job.logFile, "utf8");
    }
    if (flags.json) {
      console.log(JSON.stringify({ job, logs }, null, 2));
    } else {
      process.stdout.write(renderJobDetail(job, logs));
    }
    return;
  }

  const jobs = sortJobsNewestFirst(listJobs(workspaceRoot));
  if (flags.json) {
    console.log(JSON.stringify(jobs, null, 2));
  } else {
    process.stdout.write(renderStatusReport(jobs));
  }
}

async function handleResult(cwd, flags, positionals) {
  const workspaceRoot = resolveWorkspaceRoot(cwd);
  const jobId = positionals[0];
  const jobs = sortJobsNewestFirst(listJobs(workspaceRoot));

  const targetJob = jobId ? getJob(workspaceRoot, jobId) : jobs[0];
  if (!targetJob) {
    console.error(jobId ? `Job '${jobId}' not found.` : "No recent AGY jobs found.");
    process.exit(1);
  }

  let logs = "";
  if (fs.existsSync(targetJob.logFile)) {
    logs = fs.readFileSync(targetJob.logFile, "utf8");
  }

  if (flags.json) {
    console.log(JSON.stringify({ job: targetJob, output: logs }, null, 2));
  } else {
    process.stdout.write(renderJobDetail(targetJob, logs));
  }
}

async function handleCancel(cwd, flags, positionals) {
  const workspaceRoot = resolveWorkspaceRoot(cwd);
  const jobId = positionals[0];

  if (!jobId) {
    console.error("Please supply a job ID to cancel.");
    process.exit(1);
  }

  const job = getJob(workspaceRoot, jobId);
  if (!job) {
    console.error(`Job '${jobId}' not found.`);
    process.exit(1);
  }

  if (job.status !== "running" && job.status !== "queued") {
    console.log(`Job '${jobId}' is already ${job.status}.`);
    return;
  }

  terminateProcessTree(job.pid);
  job.status = "cancelled";
  job.phase = "cancelled";
  job.completedAt = new Date().toISOString();
  upsertJob(workspaceRoot, job);

  process.stdout.write(renderCancelReport(job));
}

async function main() {
  const argv = process.argv.slice(2);
  const subcommand = argv[0];
  const rawArgs = argv.slice(1).join(" ");
  const tokens = splitRawArgumentString(rawArgs);
  const { flags, positionals } = parseArgs(tokens, ARG_SCHEMA);
  const cwd = process.cwd();

  switch (subcommand) {
    case "setup":
      await handleSetup(cwd, flags);
      break;
    case "handoff":
    case "transfer":
      await handleHandoff(cwd, flags, positionals);
      break;
    case "task":
    case "rescue":
      await handleTask(cwd, flags, positionals);
      break;
    case "review":
      await handleReview(cwd, flags, positionals, false);
      break;
    case "adversarial-review":
      await handleReview(cwd, flags, positionals, true);
      break;
    case "status":
      await handleStatus(cwd, flags, positionals);
      break;
    case "result":
      await handleResult(cwd, flags, positionals);
      break;
    case "cancel":
      await handleCancel(cwd, flags, positionals);
      break;
    default:
      console.log(`Usage: agy-companion <setup|handoff|task|rescue|review|adversarial-review|status|result|cancel> [args]`);
      break;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
