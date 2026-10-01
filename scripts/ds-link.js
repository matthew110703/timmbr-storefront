#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = process.cwd();
const ZONES_DIR = path.resolve(ROOT_DIR, "zones");
const DEFAULT_DS_PATH = path.resolve(ROOT_DIR, "../timmbr-ds");
const DS_PATH = process.env.TIMMBR_DS_PATH
  ? path.resolve(ROOT_DIR, process.env.TIMMBR_DS_PATH)
  : DEFAULT_DS_PATH;

const localYalcCmd = path.resolve(
  ROOT_DIR,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "yalc.cmd" : "yalc",
);
const YALC_EXEC = fs.existsSync(localYalcCmd)
  ? `"${localYalcCmd}"`
  : "pnpm exec yalc";

const action = process.argv[2] || "status";

function findDSPackages() {
  const packagesDir = path.resolve(DS_PATH, "packages");
  if (!fs.existsSync(packagesDir)) {
    console.error(
      `\x1b[31m[ERROR] Design system repository not found at:\x1b[0m ${DS_PATH}`,
    );
    console.error(
      `Please ensure the 'timmbr-ds' repository is cloned in the parent directory (../timmbr-ds) or set TIMMBR_DS_PATH.`,
    );
    process.exit(1);
  }

  const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
  const dsPackages = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pkgJsonPath = path.resolve(packagesDir, entry.name, "package.json");
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
          if (pkgJson.name && pkgJson.name.startsWith("@timmbr/")) {
            dsPackages.push({
              name: pkgJson.name,
              dir: path.resolve(packagesDir, entry.name),
              version: pkgJson.version,
            });
          }
        } catch {}
      }
    }
  }

  return dsPackages;
}

function findZones() {
  if (!fs.existsSync(ZONES_DIR)) return [];

  const entries = fs.readdirSync(ZONES_DIR, { withFileTypes: true });
  const zones = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const zoneDir = path.resolve(ZONES_DIR, entry.name);
      const pkgJsonPath = path.resolve(zoneDir, "package.json");
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
          const allDeps = {
            ...pkgJson.dependencies,
            ...pkgJson.devDependencies,
          };
          const timmbrDeps = Object.keys(allDeps).filter((dep) =>
            dep.startsWith("@timmbr/"),
          );
          zones.push({
            name: entry.name,
            dir: zoneDir,
            timmbrDeps,
            pkgJson,
          });
        } catch {}
      }
    }
  }

  return zones;
}

function getPackageStatus(zoneDir, pkgName) {
  const yalcPkgPath = path.resolve(zoneDir, ".yalc", ...pkgName.split("/"));
  if (fs.existsSync(yalcPkgPath)) {
    return { status: "yalc", details: "Yalc Local Link (.yalc/)" };
  }

  const nodeModulesPath = path.resolve(
    zoneDir,
    "node_modules",
    ...pkgName.split("/"),
  );
  if (!fs.existsSync(nodeModulesPath)) {
    return { status: "not-installed", details: "Not installed" };
  }

  try {
    const realPath = fs.realpathSync(nodeModulesPath);
    if (realPath.includes("timmbr-ds")) {
      return { status: "symlink", details: `Symlink (${realPath})` };
    }
    const pkgJsonPath = path.resolve(nodeModulesPath, "package.json");
    let version = "";
    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
      version = pkg.version ? `v${pkg.version}` : "";
    }
    return { status: "registry", details: `Registry (${version || "npm"})` };
  } catch (err) {
    return { status: "unknown", details: err.message };
  }
}

function handleStatus(zones) {
  console.log(
    "\n=============================================================",
  );
  console.log("        TIMMBR STOREFRONT DESIGN SYSTEM STATUS (YALC)");
  console.log("=============================================================");
  console.log(`Design System Source: \x1b[36m${DS_PATH}\x1b[0m\n`);

  for (const zone of zones) {
    console.log(`\x1b[1mZone: zones/${zone.name}\x1b[0m`);
    if (zone.timmbrDeps.length === 0) {
      console.log("  No @timmbr dependencies found.");
      continue;
    }

    for (const dep of zone.timmbrDeps) {
      const info = getPackageStatus(zone.dir, dep);
      if (info.status === "yalc") {
        console.log(
          `  \x1b[32m✔ ${dep.padEnd(20)}\x1b[0m -> \x1b[32m${info.details}\x1b[0m`,
        );
      } else if (info.status === "registry") {
        console.log(
          `  \x1b[34m📦 ${dep.padEnd(20)}\x1b[0m -> \x1b[34m${info.details}\x1b[0m`,
        );
      } else if (info.status === "symlink") {
        console.log(`  \x1b[33m🔗 ${dep.padEnd(20)}\x1b[0m -> ${info.details}`);
      } else {
        console.log(
          `  \x1b[31m⚠️  ${dep.padEnd(20)}\x1b[0m -> ${info.details}`,
        );
      }
    }
    console.log("");
  }
  console.log(
    "=============================================================\n",
  );
}

function handleLink(dsPackages, zones) {
  console.log(
    `\n\x1b[36m[Yalc] Publishing packages from: ${DS_PATH}...\x1b[0m\n`,
  );

  // 1. Publish all DS packages to yalc store
  for (const pkg of dsPackages) {
    try {
      execSync(`pnpm dlx yalc publish --push`, {
        cwd: pkg.dir,
        stdio: "pipe",
      });
      console.log(`  ✔ Published ${pkg.name} to yalc store`);
    } catch (err) {
      console.warn(`  ⚠️ Could not publish ${pkg.name}: ${err.message}`);
    }
  }

  // 2. Add packages to each zone
  for (const zone of zones) {
    if (zone.timmbrDeps.length === 0) continue;
    console.log(`\n\x1b[36m[Yalc] Linking into zones/${zone.name}...\x1b[0m`);
    try {
      execSync(`${YALC_EXEC} add ${zone.timmbrDeps.join(" ")}`, {
        cwd: zone.dir,
        stdio: "inherit",
      });
      console.log(
        `\x1b[32m✔ Successfully added @timmbr packages into zones/${zone.name}\x1b[0m`,
      );
    } catch (err) {
      console.error(
        `\x1b[31m✖ Failed linking into zones/${zone.name}: ${err.message}\x1b[0m`,
      );
    }
  }

  console.log(
    `\n\x1b[36m[Yalc] Running pnpm install across storefront...\x1b[0m`,
  );
  execSync("pnpm install", { cwd: ROOT_DIR, stdio: "inherit" });

  handleStatus(zones);
}

function handleUnlink(zones) {
  console.log(
    `\n\x1b[36m[Yalc] Unlinking @timmbr packages across zones...\x1b[0m\n`,
  );

  for (const zone of zones) {
    if (zone.timmbrDeps.length === 0) continue;
    try {
      execSync(`${YALC_EXEC} remove --all`, {
        cwd: zone.dir,
        stdio: "inherit",
      });
    } catch {
      // Continue if nothing to remove
    }

    const yalcDir = path.resolve(zone.dir, ".yalc");
    if (fs.existsSync(yalcDir)) {
      fs.rmSync(yalcDir, { recursive: true, force: true });
    }
    const yalcLock = path.resolve(zone.dir, "yalc.lock");
    if (fs.existsSync(yalcLock)) {
      fs.rmSync(yalcLock, { force: true });
    }
  }

  console.log("\x1b[36mRestoring registry packages via pnpm install...\x1b[0m");
  execSync("pnpm install", { cwd: ROOT_DIR, stdio: "inherit" });

  console.log(
    `\x1b[32m✔ Successfully restored registry packages across all zones!\x1b[0m\n`,
  );
  handleStatus(zones);
}

const dsPackages = findDSPackages();
const zones = findZones();

switch (action) {
  case "link":
    handleLink(dsPackages, zones);
    break;
  case "unlink":
    handleUnlink(zones);
    break;
  case "status":
  default:
    handleStatus(zones);
    break;
}
