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

const CANONICAL_VERSIONS = {
  "@timmbr/ui": "1.4.2",
  "@timmbr/icons": "1.2.1",
  "@timmbr/theme": "1.2.0",
  "@timmbr/motion": "1.2.0",
  "@timmbr/utils": "1.2.0",
  "@timmbr/hooks": "1.0.0-beta",
};

function getCanonicalVersion(dep) {
  const rootPkgPath = path.resolve(ROOT_DIR, "package.json");
  if (fs.existsSync(rootPkgPath)) {
    try {
      const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
      const allRootDeps = {
        ...rootPkg.dependencies,
        ...rootPkg.devDependencies,
      };
      if (allRootDeps[dep]) return allRootDeps[dep];
    } catch {}
  }
  return CANONICAL_VERSIONS[dep] || "latest";
}

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
              shortName: entry.name,
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

function getPackageStatus(zoneDir, pkgName, pkgJson) {
  const allDeps = {
    ...pkgJson?.dependencies,
    ...pkgJson?.devDependencies,
  };
  const declaredVersion = allDeps[pkgName] || "";
  const yalcPkgJsonPath = path.resolve(
    zoneDir,
    ".yalc",
    ...pkgName.split("/"),
    "package.json",
  );

  if (
    declaredVersion.startsWith("file:.yalc") ||
    fs.existsSync(yalcPkgJsonPath)
  ) {
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

const WORKSPACE_YAML_PATH = path.resolve(ROOT_DIR, "pnpm-workspace.yaml");

function syncWorkspaceOverrides() {
  if (!fs.existsSync(WORKSPACE_YAML_PATH)) return;
  const zones = findZones();
  const linkedPackages = new Set();

  for (const zone of zones) {
    const allDeps = {
      ...zone.pkgJson?.dependencies,
      ...zone.pkgJson?.devDependencies,
    };
    for (const [dep, ver] of Object.entries(allDeps)) {
      if (typeof ver === "string" && ver.startsWith("file:.yalc")) {
        linkedPackages.add(dep);
      }
    }
  }

  const yaml = fs.readFileSync(WORKSPACE_YAML_PATH, "utf8");
  const baseYaml = yaml.split(/^overrides:/m)[0].trimEnd();

  if (linkedPackages.size === 0) {
    fs.writeFileSync(WORKSPACE_YAML_PATH, `${baseYaml}\n`, "utf8");
  } else {
    const overridesLines = Array.from(linkedPackages)
      .sort()
      .map((pkg) => `  "${pkg}": "file:zones/shell/.yalc/${pkg}"`)
      .join("\n");
    fs.writeFileSync(
      WORKSPACE_YAML_PATH,
      `${baseYaml}\n\noverrides:\n${overridesLines}\n`,
      "utf8",
    );
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
      const info = getPackageStatus(zone.dir, dep, zone.pkgJson);
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

function normalizePackageName(name) {
  const clean = name.trim().toLowerCase();
  return clean.startsWith("@timmbr/") ? clean : `@timmbr/${clean}`;
}

function matchesTarget(pkgName, shortName, targets) {
  if (!targets || targets.length === 0) return true;
  const lowerPkg = pkgName.toLowerCase();
  const lowerShort = (
    shortName || lowerPkg.replace("@timmbr/", "")
  ).toLowerCase();
  return targets.some((target) => {
    const raw = target.trim().toLowerCase();
    const norm = normalizePackageName(raw);
    const short = norm.replace("@timmbr/", "");
    return (
      lowerPkg === norm ||
      lowerPkg === raw ||
      lowerShort === short ||
      lowerShort === raw
    );
  });
}

function handleLink(dsPackages, zones, specifiedTargets = []) {
  const hasFilter = specifiedTargets.length > 0;

  const packagesToPublish = hasFilter
    ? dsPackages.filter((pkg) =>
        matchesTarget(pkg.name, pkg.shortName, specifiedTargets),
      )
    : dsPackages;

  if (hasFilter && packagesToPublish.length === 0) {
    console.error(
      `\x1b[31m[ERROR] No matching design system packages found for: ${specifiedTargets.join(", ")}\x1b[0m`,
    );
    console.log(
      `Available in ${DS_PATH}: ${dsPackages.map((p) => p.name).join(", ")}`,
    );
    process.exit(1);
  }

  console.log(
    `\n\x1b[36m[Yalc] Publishing packages from: ${DS_PATH}...\x1b[0m\n`,
  );

  // 1. Publish matching packages to local yalc store
  for (const pkg of packagesToPublish) {
    try {
      execSync(`${YALC_EXEC} publish --push`, {
        cwd: pkg.dir,
        stdio: "pipe",
      });
      console.log(`  ✔ Published ${pkg.name} to yalc store`);
    } catch (err) {
      console.warn(`  ⚠️ Could not publish ${pkg.name}: ${err.message}`);
    }
  }

  // 2. Add packages to target zones
  let anyLinked = false;
  for (const zone of zones) {
    if (zone.timmbrDeps.length === 0) continue;

    const packagesToLink = hasFilter
      ? zone.timmbrDeps.filter((dep) =>
          matchesTarget(dep, null, specifiedTargets),
        )
      : zone.timmbrDeps;

    if (packagesToLink.length === 0) {
      console.log(
        `  \x1b[33m[SKIP] No matching dependencies in zones/${zone.name}\x1b[0m`,
      );
      continue;
    }

    console.log(
      `\n\x1b[36m[Yalc] Linking into zones/${zone.name}: ${packagesToLink.join(" ")}...\x1b[0m`,
    );
    try {
      execSync(`${YALC_EXEC} add ${packagesToLink.join(" ")}`, {
        cwd: zone.dir,
        stdio: "inherit",
      });
      anyLinked = true;
      console.log(
        `\x1b[32m✔ Successfully added ${packagesToLink.join(", ")} into zones/${zone.name}\x1b[0m`,
      );
    } catch (err) {
      console.error(
        `\x1b[31m✖ Failed linking into zones/${zone.name}: ${err.message}\x1b[0m`,
      );
    }
  }

  if (anyLinked) {
    syncWorkspaceOverrides();
    console.log(
      `\n\x1b[36m[Yalc] Running pnpm install across storefront...\x1b[0m`,
    );
    execSync("pnpm install", { cwd: ROOT_DIR, stdio: "inherit" });
  }

  handleStatus(findZones());
}

function handleUnlink(zones, specifiedTargets = []) {
  const hasFilter = specifiedTargets.length > 0;

  if (hasFilter) {
    console.log(
      `\n\x1b[36m[Yalc] Unlinking specified packages (${specifiedTargets.join(", ")}) across zones...\x1b[0m\n`,
    );

    let anyUnlinked = false;
    for (const zone of zones) {
      if (zone.timmbrDeps.length === 0) continue;

      const packagesToUnlink = zone.timmbrDeps.filter((dep) =>
        matchesTarget(dep, null, specifiedTargets),
      );

      if (packagesToUnlink.length === 0) continue;

      console.log(
        `\x1b[36m[Yalc] Removing from zones/${zone.name}: ${packagesToUnlink.join(" ")}...\x1b[0m`,
      );
      try {
        execSync(`${YALC_EXEC} remove ${packagesToUnlink.join(" ")}`, {
          cwd: zone.dir,
          stdio: "inherit",
        });
        anyUnlinked = true;
      } catch (err) {
        console.warn(
          `  ⚠️ Could not remove from zones/${zone.name}: ${err.message}`,
        );
      }

      // Clean up package folders in .yalc if leftover
      for (const dep of packagesToUnlink) {
        const depYalcDir = path.resolve(zone.dir, ".yalc", ...dep.split("/"));
        if (fs.existsSync(depYalcDir)) {
          fs.rmSync(depYalcDir, { recursive: true, force: true });
        }
      }

      // Fallback check: if package.json in zone still has file:.yalc for this package, restore canonical version
      const zonePkgJsonPath = path.resolve(zone.dir, "package.json");
      if (fs.existsSync(zonePkgJsonPath)) {
        const zonePkg = JSON.parse(fs.readFileSync(zonePkgJsonPath, "utf8"));
        let modified = false;
        for (const dep of packagesToUnlink) {
          if (
            zonePkg.dependencies?.[dep] &&
            zonePkg.dependencies[dep].startsWith("file:.yalc")
          ) {
            zonePkg.dependencies[dep] = getCanonicalVersion(dep);
            modified = true;
          }
          if (
            zonePkg.devDependencies?.[dep] &&
            zonePkg.devDependencies[dep].startsWith("file:.yalc")
          ) {
            zonePkg.devDependencies[dep] = getCanonicalVersion(dep);
            modified = true;
          }
        }
        if (modified) {
          fs.writeFileSync(
            zonePkgJsonPath,
            JSON.stringify(zonePkg, null, 2) + "\n",
            "utf8",
          );
        }
      }

      // Check if any yalc packages remain in this zone
      const freshZonePkgJson = JSON.parse(
        fs.readFileSync(path.resolve(zone.dir, "package.json"), "utf8"),
      );
      const remainingYalc = Object.values({
        ...freshZonePkgJson.dependencies,
        ...freshZonePkgJson.devDependencies,
      }).some((v) => typeof v === "string" && v.startsWith("file:.yalc"));

      if (!remainingYalc) {
        const yalcDir = path.resolve(zone.dir, ".yalc");
        if (fs.existsSync(yalcDir)) {
          fs.rmSync(yalcDir, { recursive: true, force: true });
        }
        const yalcLock = path.resolve(zone.dir, "yalc.lock");
        if (fs.existsSync(yalcLock)) {
          fs.rmSync(yalcLock, { force: true });
        }
      }
    }

    if (anyUnlinked) {
      syncWorkspaceOverrides();
      console.log(
        "\n\x1b[36mRestoring registry packages via pnpm install...\x1b[0m",
      );
      execSync("pnpm install", { cwd: ROOT_DIR, stdio: "inherit" });
      console.log(
        `\x1b[32m✔ Successfully unlinked ${specifiedTargets.join(", ")} across zones!\x1b[0m\n`,
      );
    }
  } else {
    console.log(
      `\n\x1b[36m[Yalc] Unlinking all @timmbr packages across zones...\x1b[0m\n`,
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

      // Ensure fallback versions are restored in package.json
      const zonePkgJsonPath = path.resolve(zone.dir, "package.json");
      if (fs.existsSync(zonePkgJsonPath)) {
        const zonePkg = JSON.parse(fs.readFileSync(zonePkgJsonPath, "utf8"));
        let modified = false;
        for (const dep of zone.timmbrDeps) {
          if (
            zonePkg.dependencies?.[dep] &&
            zonePkg.dependencies[dep].startsWith("file:.yalc")
          ) {
            zonePkg.dependencies[dep] = getCanonicalVersion(dep);
            modified = true;
          }
          if (
            zonePkg.devDependencies?.[dep] &&
            zonePkg.devDependencies[dep].startsWith("file:.yalc")
          ) {
            zonePkg.devDependencies[dep] = getCanonicalVersion(dep);
            modified = true;
          }
        }
        if (modified) {
          fs.writeFileSync(
            zonePkgJsonPath,
            JSON.stringify(zonePkg, null, 2) + "\n",
            "utf8",
          );
        }
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

    syncWorkspaceOverrides();

    console.log(
      "\n\x1b[36mRestoring registry packages via pnpm install...\x1b[0m",
    );
    execSync("pnpm install", { cwd: ROOT_DIR, stdio: "inherit" });

    console.log(
      `\x1b[32m✔ Successfully restored registry packages across all zones!\x1b[0m\n`,
    );
  }

  handleStatus(findZones());
}

function handleCheck(zones) {
  const linkedItems = [];

  for (const zone of zones) {
    for (const dep of zone.timmbrDeps) {
      const info = getPackageStatus(zone.dir, dep, zone.pkgJson);
      if (info.status === "yalc" || info.status === "symlink") {
        linkedItems.push({
          location: `zones/${zone.name}`,
          pkg: dep,
          details: info.details,
        });
      }
    }

    // Check if .yalc directory or yalc.lock exists in zone
    const zoneYalcDir = path.resolve(zone.dir, ".yalc");
    const zoneYalcLock = path.resolve(zone.dir, "yalc.lock");
    if (fs.existsSync(zoneYalcDir) || fs.existsSync(zoneYalcLock)) {
      const alreadyReported = linkedItems.some(
        (item) => item.location === `zones/${zone.name}`,
      );
      if (!alreadyReported) {
        linkedItems.push({
          location: `zones/${zone.name}`,
          pkg: "local .yalc artifacts",
          details: "found .yalc or yalc.lock",
        });
      }
    }
  }

  // Check pnpm-workspace.yaml for overrides
  if (fs.existsSync(WORKSPACE_YAML_PATH)) {
    const yaml = fs.readFileSync(WORKSPACE_YAML_PATH, "utf8");
    if (yaml.includes("overrides:") && yaml.includes(".yalc")) {
      linkedItems.push({
        location: "pnpm-workspace.yaml",
        pkg: "overrides",
        details: "contains local yalc overrides",
      });
    }
  }

  // Check root package.json for file:.yalc
  const rootPkgPath = path.resolve(ROOT_DIR, "package.json");
  if (fs.existsSync(rootPkgPath)) {
    try {
      const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
      const allRootDeps = {
        ...rootPkg.dependencies,
        ...rootPkg.devDependencies,
      };
      for (const [dep, val] of Object.entries(allRootDeps)) {
        if (
          dep.startsWith("@timmbr/") &&
          typeof val === "string" &&
          val.startsWith("file:.yalc")
        ) {
          linkedItems.push({
            location: "root package.json",
            pkg: dep,
            details: val,
          });
        }
      }
    } catch {}
  }

  if (linkedItems.length > 0) {
    console.error(
      "\n\x1b[31m=============================================================",
    );
    console.error(
      "  ✖ [PRE-COMMIT BLOCKED] LOCAL YALC DESIGN SYSTEM LINKS FOUND",
    );
    console.error(
      "=============================================================\x1b[0m\n",
    );
    console.error(
      "Local Yalc links were detected in the following package(s):\n",
    );
    for (const item of linkedItems) {
      console.error(
        `  - \x1b[33m${item.location}\x1b[0m: \x1b[31m${item.pkg}\x1b[0m (${item.details})`,
      );
    }
    console.error(
      "\n\x1b[36mLocal Yalc links must not be committed to source control.\x1b[0m",
    );
    console.error(
      "Please run \x1b[32mpnpm ds:unlink\x1b[0m to restore registry versions before committing.\n",
    );
    process.exit(1);
  }

  console.log(
    "\x1b[32m✔ [ds:check] Clean: No local Yalc design system links detected.\x1b[0m",
  );
}

function printHelp() {
  console.log(`
TIMMBR STOREFRONT DESIGN SYSTEM LINKER (Yalc)

Usage:
  pnpm ds:link [packages...] [--zone <zone>]
  pnpm ds:unlink [packages...] [--zone <zone>]
  pnpm ds:status [--zone <zone>]
  pnpm ds:check [--zone <zone>]

Examples:
  pnpm ds:link ui            # Link only @timmbr/ui into all zones
  pnpm ds:link ui theme      # Link @timmbr/ui and @timmbr/theme
  pnpm ds:link               # Link all @timmbr packages
  pnpm ds:unlink ui          # Unlink @timmbr/ui and restore registry version
  pnpm ds:unlink             # Unlink all @timmbr packages
  pnpm ds:status             # Check current link status
  pnpm ds:check              # Pre-commit verification for local Yalc links
`);
}

// Argument parsing
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

let targetZones = [];
const positionalArgs = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--zone" || arg === "-z") {
    if (args[i + 1]) {
      targetZones.push(args[i + 1].toLowerCase());
      i++;
    }
  } else if (arg.startsWith("--zone=")) {
    targetZones.push(arg.split("=")[1].toLowerCase());
  } else if (arg === "--") {
    continue;
  } else if (!arg.startsWith("-")) {
    positionalArgs.push(arg);
  }
}

const firstPositional = positionalArgs[0] || "status";
let action = "status";
let rawTargets = [];

if (["link", "unlink", "status", "check"].includes(firstPositional)) {
  action = firstPositional;
  rawTargets = positionalArgs.slice(1);
} else {
  action = "link";
  rawTargets = positionalArgs;
}

const specifiedTargets = rawTargets
  .flatMap((arg) => arg.split(","))
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const allZones = findZones();
const activeZones =
  targetZones.length > 0
    ? allZones.filter((z) => targetZones.includes(z.name.toLowerCase()))
    : allZones;

if (targetZones.length > 0 && activeZones.length === 0) {
  console.error(
    `\x1b[31m[ERROR] No matching zones found for: ${targetZones.join(", ")}\x1b[0m`,
  );
  console.log(`Available zones: ${allZones.map((z) => z.name).join(", ")}`);
  process.exit(1);
}

switch (action) {
  case "link": {
    const dsPackages = findDSPackages();
    handleLink(dsPackages, activeZones, specifiedTargets);
    break;
  }
  case "unlink":
    handleUnlink(activeZones, specifiedTargets);
    break;
  case "check":
    handleCheck(activeZones);
    break;
  case "status":
  default:
    handleStatus(activeZones);
    break;
}
