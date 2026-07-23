import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
export const version = packageJson.version;

function git(args, fallback) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim() || fallback;
  } catch {
    return fallback;
  }
}

export function getBuildInfo() {
  return {
    version,
    branch: git(["branch", "--show-current"], "detached"),
    commit: git(["rev-parse", "--short=12", "HEAD"], "unknown"),
    dirty: git(["status", "--porcelain"], "") !== "",
    builtAt: new Date().toISOString(),
  };
}
