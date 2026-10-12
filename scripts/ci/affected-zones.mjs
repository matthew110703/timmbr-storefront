#!/usr/bin/env node

/**
 * Prints the zones affected by a change range as a JSON array, e.g. ["shell"].
 *
 * Usage:
 *   node scripts/ci/affected-zones.mjs --base <ref> [--head <ref>]
 *   node scripts/ci/affected-zones.mjs --zones all|shell,account
 *
 * Rules:
 *   - --zones overrides detection (manual redeploys).
 *   - Missing/zero/unknown base ref (new branch, force-push) → all zones.
 *   - A change to a global file (see GLOBAL_PATTERNS) → all zones.
 *   - Otherwise Turborepo maps changed files to zones (`turbo ls --affected`),
 *     scoping pnpm-lock.yaml changes to the zones whose dependencies changed.
 *   - Changes outside zones/ that aren't global (docs, e2e, …) → no zones.
 *
 * When GITHUB_OUTPUT is set, also writes `zones=<json>` and `any=<bool>`.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const zonesDir = path.join(rootDir, "zones");

// Changes to these affect every zone's install, build or CI behaviour.
const GLOBAL_PATTERNS = [
  /^package\.json$/,
  /^pnpm-workspace\.yaml$/,
  /^turbo\.json$/,
  /^eslint\.config\.mjs$/,
  /^\.github\/workflows\//,
  /^scripts\/ci\//,
];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith("--")) args[key.slice(2)] = argv[i + 1] ?? "";
  }
  return args;
}

function git(...args) {
  return execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
}

function refExists(ref) {
  try {
    git("rev-parse", "--verify", "--quiet", `${ref}^{commit}`);
    return true;
  } catch {
    return false;
  }
}

const allZones = fs
  .readdirSync(zonesDir)
  .filter((z) => fs.existsSync(path.join(zonesDir, z, "package.json")))
  .sort();

function resolveZones({ base, head = "HEAD", zones }) {
  if (zones) {
    if (zones.trim() === "all")
      return { zones: allZones, reason: "manual: all" };
    const requested = zones
      .split(",")
      .map((z) => z.trim())
      .filter(Boolean);
    const unknown = requested.filter((z) => !allZones.includes(z));
    if (unknown.length)
      throw new Error(`Unknown zone(s): ${unknown.join(", ")}`);
    return { zones: requested.sort(), reason: "manual" };
  }

  if (!base || /^0+$/.test(base) || !refExists(base)) {
    return {
      zones: allZones,
      reason: `no usable base ref (${base || "none"})`,
    };
  }

  const changed = git("diff", "--name-only", `${base}...${head}`)
    .split("\n")
    .filter(Boolean);

  // turbo also counts uncommitted changes; keep an empty range empty.
  if (changed.length === 0) return { zones: [], reason: "no changes" };

  const globalHit = changed.find((f) => GLOBAL_PATTERNS.some((p) => p.test(f)));
  if (globalHit)
    return { zones: allZones, reason: `global file changed: ${globalHit}` };

  const turboBin = path.join(rootDir, "node_modules/turbo/bin/turbo");
  const out = execFileSync(
    process.execPath,
    [turboBin, "ls", "--affected", "--output=json"],
    {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
      env: { ...process.env, TURBO_SCM_BASE: base, TURBO_SCM_HEAD: head },
    },
  );
  // turbo may print a version banner before the JSON.
  const json = JSON.parse(out.slice(out.indexOf("{")));
  const affected = json.packages.items
    .map((p) => p.name)
    .filter((name) => allZones.includes(name))
    .sort();

  return {
    zones: affected,
    reason: `turbo affected (${changed.length} files changed)`,
  };
}

const { zones, reason } = resolveZones(parseArgs(process.argv.slice(2)));

console.error(
  `[affected-zones] ${reason} → ${zones.length ? zones.join(", ") : "none"}`,
);
console.log(JSON.stringify(zones));

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `zones=${JSON.stringify(zones)}\nany=${zones.length > 0}\n`,
  );
}
