import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { resolveStateDir } from "./state.mjs";

export function createJobLogFile(workspaceRoot, jobId) {
  const dir = path.join(resolveStateDir(workspaceRoot), "jobs");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${jobId}.log`);
}

export function createCompanionJob({
  id,
  kind = "task",
  title = "OMP Task",
  workspaceRoot,
  summary = "",
  sessionId = null,
  pid = null
}) {
  const now = new Date().toISOString();
  return {
    id,
    kind,
    title,
    workspaceRoot,
    summary,
    sessionId,
    pid,
    status: "running",
    phase: "executing",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    logFile: createJobLogFile(workspaceRoot, id),
    error: null,
    exitCode: null
  };
}

export function terminateProcessTree(pid) {
  if (!pid || Number.isNaN(pid)) {
    return;
  }
  try {
    // Attempt SIGTERM to process group
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      // Fallback: kill single PID
      process.kill(pid, "SIGTERM");
    } catch {
      // Ignore if already dead
    }
  }
}

export function sortJobsNewestFirst(jobs = []) {
  return [...jobs].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });
}
