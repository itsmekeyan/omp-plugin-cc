import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("manifests and commands exist and have valid structure", () => {
  const marketplacePath = path.join(ROOT, ".claude-plugin", "marketplace.json");
  assert.ok(fs.existsSync(marketplacePath));
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
  assert.equal(marketplace.name, "omp-plugins");
  assert.ok(Array.isArray(marketplace.plugins));
  assert.equal(marketplace.plugins[0].name, "omp");

  const pluginPath = path.join(ROOT, "plugins", "omp", ".claude-plugin", "plugin.json");
  assert.ok(fs.existsSync(pluginPath));
  const plugin = JSON.parse(fs.readFileSync(pluginPath, "utf8"));
  assert.equal(plugin.name, "omp");
  assert.equal(plugin.version, "1.0.0");

  const hooksPath = path.join(ROOT, "plugins", "omp", "hooks", "hooks.json");
  assert.ok(fs.existsSync(hooksPath));
  const hooks = JSON.parse(fs.readFileSync(hooksPath, "utf8"));
  assert.ok(hooks.hooks.SessionStart);
  assert.ok(hooks.hooks.SessionEnd);

  const expectedCommands = [
    "handoff.md",
    "rescue.md",
    "review.md",
    "adversarial-review.md",
    "status.md",
    "result.md",
    "cancel.md",
    "setup.md"
  ];
  for (const cmd of expectedCommands) {
    const cmdPath = path.join(ROOT, "plugins", "omp", "commands", cmd);
    assert.ok(fs.existsSync(cmdPath), `Missing command: ${cmd}`);
  }

  const agentPath = path.join(ROOT, "plugins", "omp", "agents", "omp-rescue.md");
  assert.ok(fs.existsSync(agentPath));

  const expectedSkills = ["omp-cli-runtime", "omp-prompting", "omp-result-handling", "gemini-3-5-flash-prompting"];
  for (const sk of expectedSkills) {
    const skillPath = path.join(ROOT, "plugins", "omp", "skills", sk, "SKILL.md");
    assert.ok(fs.existsSync(skillPath), `Missing skill: ${sk}`);
  }
});
