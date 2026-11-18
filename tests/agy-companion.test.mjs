import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPANION = path.join(ROOT, "plugins", "agy", "scripts", "agy-companion.mjs");

test("agy companion setup --json returns valid json status", () => {
  const output = execSync(`node "${COMPANION}" setup --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.equal(typeof parsed.ok, "boolean");
  assert.ok("binaryPath" in parsed);
  assert.ok("version" in parsed);
});

test("agy companion handoff --json outputs session handoff metadata", () => {
  const output = execSync(`node "${COMPANION}" handoff --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.ok(parsed.cwd);
  assert.equal(parsed.model, "gemini-3.8-flash-medium");
  assert.match(parsed.launchCmd, /--model gemini-3\.8-flash-medium/);
  assert.equal(typeof parsed.terminalLaunched, "boolean");
});

test("agy companion handoff --model propagates model and effort to launch command", () => {
  const output = execSync(`node "${COMPANION}" handoff --model claude-opus-4-6-thinking --effort high --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.equal(parsed.model, "claude-opus-4-6-thinking");
  assert.equal(parsed.effort, "high");
  assert.match(parsed.launchCmd, /--model claude-opus-4-6-thinking/);
  assert.match(parsed.launchCmd, /--effort high/);
});

test("agy companion status --json outputs array of jobs", () => {
  const output = execSync(`node "${COMPANION}" status --json`, { encoding: "utf8" });
  const parsed = JSON.parse(output);
  assert.ok(Array.isArray(parsed));
});
