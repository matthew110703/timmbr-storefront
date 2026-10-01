#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userArgs = process.argv.slice(2);
const isAll = userArgs.includes("--all");

const zonesDir = path.resolve(__dirname, "../zones");

// Discover all valid zone packages
const allZones = fs.existsSync(zonesDir)
  ? fs.readdirSync(zonesDir).filter((f) => {
      const fullPath = path.join(zonesDir, f);
      return (
        fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, "package.json"))
      );
    })
  : ["shell"];

// Shell is always included as the primary ingress host
const requestedZones = userArgs.filter((arg) => !arg.startsWith("--"));

let targetZones;
if (isAll) {
  targetZones = allZones;
} else {
  // Always include 'shell', plus any requested zones that exist
  const matched = requestedZones.filter((zone) => allZones.includes(zone));
  const unknown = requestedZones.filter((zone) => !allZones.includes(zone));

  if (unknown.length > 0) {
    console.warn(
      `⚠️ Warning: Unknown zone(s) requested: ${unknown.join(", ")}`,
    );
  }

  targetZones = Array.from(new Set(["shell", ...matched]));
}

const turboFlags = targetZones.flatMap((zone) => ["--filter", zone]);

console.log(`\n🚀 Booting Multi-Zone Dev Environment...`);
console.log(`📦 Active Zones: ${targetZones.join(", ")}\n`);

const command = ["pnpm", "exec", "turbo", "run", "dev", ...turboFlags].join(
  " ",
);

const child = spawn(command, {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
