import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { resolvePluginDataDir, resolveWorkspaceSlug } from "./workspace.mjs";

export function resolveStateDir(workspaceRoot) {
  const dataDir = resolvePluginDataDir();
  const slug = resolveWorkspaceSlug(workspaceRoot);
  return path.join(dataDir, "state", slug);
}

export function resolveStateFile(workspaceRoot) {
  return path.join(resolveStateDir(workspaceRoot), "state.json");
}

export function generateJobId(prefix = "task") {
  const rand = crypto.randomBytes(3).toString("hex");
  return `${prefix}-${rand}`;
}

export function loadState(workspaceRoot) {
  const file = resolveStateFile(workspaceRoot);
  if (!fs.existsSync(file)) {
    return { jobs: [] };
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return { jobs: [] };
  }
}

export function saveState(workspaceRoot, state) {
  const dir = resolveStateDir(workspaceRoot);
  fs.mkdirSync(dir, { recursive: true });
  const file = resolveStateFile(workspaceRoot);
  const tmp = `${file}.tmp.${Date.now()}`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

export function listJobs(workspaceRoot) {
  return loadState(workspaceRoot).jobs || [];
}

export function getJob(workspaceRoot, jobId) {
  const jobs = listJobs(workspaceRoot);
  return jobs.find((j) => j.id === jobId) || null;
}

export function upsertJob(workspaceRoot, job) {
  const state = loadState(workspaceRoot);
  const idx = state.jobs.findIndex((j) => j.id === job.id);
  if (idx !== -1) {
    state.jobs[idx] = { ...state.jobs[idx], ...job };
  } else {
    state.jobs.push(job);
  }
  saveState(workspaceRoot, state);
  return job;
}
