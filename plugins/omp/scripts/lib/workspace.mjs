import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export function resolveWorkspaceRoot(cwd = process.cwd()) {
  let current = path.resolve(cwd);
  while (true) {
    if (fs.existsSync(path.join(current, ".git"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return path.resolve(cwd);
}

export function resolvePluginDataDir() {
  const custom = process.env.CLAUDE_PLUGIN_DATA;
  if (custom) {
    return custom;
  }
  return path.join(os.homedir(), ".claude", "plugins", "data", "omp");
}

export function resolveWorkspaceSlug(workspaceRoot) {
  const base = path.basename(workspaceRoot) || "root";
  const hash = crypto.createHash("sha256").update(workspaceRoot).digest("hex").slice(0, 12);
  return `${base}-${hash}`;
}
