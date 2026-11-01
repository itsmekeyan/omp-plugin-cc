import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPANION = path.join(ROOT, "plugins", "omp", "scripts", "omp-companion.mjs");

test("companion setup --json returns valid json status", () => {
  const output = execSync(`node "${COMPANION}" setup --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.equal(typeof parsed.ok, "boolean");
  assert.ok("binaryPath" in parsed);
  assert.ok("version" in parsed);
});

test("companion handoff --json outputs session handoff metadata", () => {
  const output = execSync(`node "${COMPANION}" handoff --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.ok(parsed.cwd);
  assert.equal(typeof parsed.terminalLaunched, "boolean");
});

test("companion handoff --model propagates model to launch command", () => {
  const output = execSync(`node "${COMPANION}" handoff --model opus --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.equal(parsed.model, "opus");
  assert.match(parsed.launchCmd, /--model opus/);
});

test("companion status --json outputs array of jobs", () => {
  const output = execSync(`node "${COMPANION}" status --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.ok(Array.isArray(parsed));
});
