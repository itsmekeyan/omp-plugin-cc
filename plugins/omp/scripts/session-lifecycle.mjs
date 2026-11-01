#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
import { resolveWorkspaceRoot } from "./lib/workspace.mjs";
import { listJobs, upsertJob } from "./lib/state.mjs";
import { terminateProcessTree } from "./lib/job-control.mjs";

function readHookInput() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function appendEnvVar(name, value) {
  const envFile = process.env.CLAUDE_ENV_FILE;
  if (!envFile || value == null || value === "") {
    return;
  }
  const safeVal = `'${String(value).replace(/'/g, `'\\''`)}'`;
  fs.appendFileSync(envFile, `export ${name}=${safeVal}\n`, "utf8");
}

function handleSessionStart(input) {
  if (input.session_id) {
    appendEnvVar("OMP_CLAUDE_SESSION_ID", input.session_id);
  }
  if (input.transcript_path) {
    appendEnvVar("OMP_CLAUDE_TRANSCRIPT_PATH", input.transcript_path);
  }
}

function handleSessionEnd(input) {
  const cwd = input.cwd || process.cwd();
  const workspaceRoot = resolveWorkspaceRoot(cwd);
  const sessionId = input.session_id || process.env.OMP_CLAUDE_SESSION_ID;

  if (!sessionId) {
    return;
  }

  const jobs = listJobs(workspaceRoot);
  for (const job of jobs) {
    if (job.sessionId === sessionId && (job.status === "running" || job.status === "queued")) {
      terminateProcessTree(job.pid);
      upsertJob(workspaceRoot, {
        ...job,
        status: "cancelled",
        completedAt: new Date().toISOString(),
        error: "Session ended"
      });
    }
  }
}

const subcommand = process.argv[2] || "SessionStart";
const input = readHookInput();

if (subcommand === "SessionStart") {
  handleSessionStart(input);
} else if (subcommand === "SessionEnd") {
  handleSessionEnd(input);
}
