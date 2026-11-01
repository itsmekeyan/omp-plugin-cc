import { execSync } from "node:child_process";

export function isGitRepository(cwd = process.cwd()) {
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function getGitStatusSummary(cwd = process.cwd()) {
  try {
    const status = execSync("git status --short --untracked-files=all", { cwd, encoding: "utf8" }).trim();
    const diffStat = execSync("git diff --shortstat", { cwd, encoding: "utf8" }).trim();
    const cachedStat = execSync("git diff --shortstat --cached", { cwd, encoding: "utf8" }).trim();

    return {
      hasChanges: Boolean(status),
      statusLines: status ? status.split("\n") : [],
      diffStat,
      cachedStat
    };
  } catch (err) {
    return {
      hasChanges: false,
      statusLines: [],
      diffStat: "",
      cachedStat: "",
      error: err.message
    };
  }
}

export function collectGitDiff(cwd = process.cwd(), baseRef = null) {
  try {
    if (baseRef) {
      return execSync(`git diff ${baseRef}...HEAD`, { cwd, encoding: "utf8" });
    }
    // Working tree diff (cached + unstaged)
    const staged = execSync("git diff --cached", { cwd, encoding: "utf8" });
    const unstaged = execSync("git diff", { cwd, encoding: "utf8" });
    return [staged, unstaged].filter(Boolean).join("\n");
  } catch (err) {
    return "";
  }
}
