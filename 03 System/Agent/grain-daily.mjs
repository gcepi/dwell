#!/usr/bin/env node
// Import recent Grain recordings, then commit and push only new source files.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
const CREDENTIAL_ROOT = "/home/openclaw/.openclaw/credentials/github/system";

function env() {
  const result = { ...process.env };
  for (const key of Object.keys(result)) {
    if (/^GIT_CONFIG_(COUNT|KEY_\d+|VALUE_\d+)$/.test(key)) delete result[key];
  }
  result.GIT_AUTHOR_NAME = "C-3PO";
  result.GIT_AUTHOR_EMAIL = "noreply@openclaw.ai";
  result.GIT_COMMITTER_NAME = "C-3PO";
  result.GIT_COMMITTER_EMAIL = "noreply@openclaw.ai";
  if (!result.GH_CONFIG_DIR) {
    try {
      result.GH_CONFIG_DIR = fs.readdirSync(CREDENTIAL_ROOT)
        .map((name) => path.join(CREDENTIAL_ROOT, name))
        .find((dir) => fs.existsSync(path.join(dir, "hosts.yml")));
    } catch { /* git reports a real credential failure below */ }
  }
  if (!result.GIT_SSL_CAINFO) {
    try {
      const proxy = "/home/openclaw/.openclaw/secret-egress-proxy";
      result.GIT_SSL_CAINFO = fs.readdirSync(proxy)
        .map((name) => path.join(proxy, name, "trust-bundle.pem"))
        .find((file) => fs.existsSync(file));
    } catch { /* git reports a real TLS failure below */ }
  }
  return result;
}

function run(file, args, options = {}) {
  return execFileSync(file, args, { cwd: ROOT, encoding: "utf8", env: env(), maxBuffer: 64 * 1024 * 1024, ...options }).trim();
}

const dirty = run("git", ["status", "--porcelain"]);
if (dirty) throw new Error(`refusing to run with a dirty tree:\n${dirty}`);
run("git", ["fetch", "origin", "--quiet"]);
run("git", ["pull", "--rebase", "--quiet", "origin", "main"]);

const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
const result = JSON.parse(run("node", ["03 System/Agent/grain-sync.mjs", "--since", since]));
let commit = null;
if (result.imported) {
  const changed = run("git", ["status", "--porcelain"]).split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).replace(/^"|"$/g, ""));
  const outside = changed.filter((file) => file !== "03 System/Agent/grain-manifest.json" && !file.startsWith("03 System/Sources/Grain/"));
  if (outside.length) throw new Error(`refusing to commit paths outside Grain scope: ${outside.join(", ")}`);
  run("git", ["add", "--", ...changed]);
  run("git", ["commit", "-m", `Import ${result.imported} Grain recording${result.imported === 1 ? "" : "s"}`]);
  commit = run("git", ["rev-parse", "--short", "HEAD"]);
  run("git", ["pull", "--rebase", "--quiet", "origin", "main"]);
  run("git", ["push", "--quiet", "origin", "HEAD:main"]);
}

process.stdout.write(JSON.stringify({ ...result, since, commit }) + "\n");
