import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  generateJobId,
  getJob,
  listJobs,
  loadState,
  saveState,
  upsertJob
} from "../plugins/omp/scripts/lib/state.mjs";

test("state operations save and retrieve jobs for workspace", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "omp-state-test-"));
  process.env.CLAUDE_PLUGIN_DATA = tmpDir;

  const workspaceRoot = "/tmp/test-workspace";
  const jobId = generateJobId("task");
  assert.match(jobId, /^task-[0-9a-f]{6}$/);

  const initialJob = {
    id: jobId,
    kind: "task",
    title: "Test Job",
    workspaceRoot,
    status: "running"
  };

  upsertJob(workspaceRoot, initialJob);

  const retrieved = getJob(workspaceRoot, jobId);
  assert.ok(retrieved);
  assert.equal(retrieved.title, "Test Job");
  assert.equal(retrieved.status, "running");

  // Update status
  upsertJob(workspaceRoot, { id: jobId, status: "completed" });
  const updated = getJob(workspaceRoot, jobId);
  assert.equal(updated.status, "completed");

  const all = listJobs(workspaceRoot);
  assert.equal(all.length, 1);
  assert.equal(all[0].id, jobId);

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
