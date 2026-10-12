# CI/CD Pipeline & Per-Zone Deployments

Every zone in `zones/*` is its own Vercel project. GitHub Actions decides which zones a change affects, checks them, and deploys **only those zones**. Vercel's automatic Git deployments are turned off (`zones/<zone>/vercel.json` → `git.deploymentEnabled: false`), so a change to `shell` no longer redeploys `products`, `checkout` or `account`.

| Branch / event               | Checks         | Deploys                                                            |
| ---------------------------- | -------------- | ------------------------------------------------------------------ |
| PR → `staging`/`main`        | Affected zones | Nothing                                                            |
| Push to `staging`            | Affected zones | Affected zones → Vercel **Preview**, aliased to the staging domain |
| Push to `main`               | Affected zones | Affected zones → Vercel **Production**, after manual approval      |
| Manual (`workflow_dispatch`) | Zones you list | Same as the branch it was run on                                   |

Workflows: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) and the reusable [`.github/workflows/deploy-zone.yml`](../../.github/workflows/deploy-zone.yml).

---

## 1. Change detection

[`scripts/ci/affected-zones.mjs`](../../scripts/ci/affected-zones.mjs) prints the affected zones as JSON (e.g. `["shell"]`). Zone names are discovered from `zones/*`, never hard-coded.

1. **Base ref.** For a PR, the target branch. For a push, the commit of the **last successful run on that branch**. A zone whose checks or deploy failed, or whose run was cancelled, is therefore picked up again on the next push. If there is no successful run yet, every zone is affected.
2. **Global files → all zones:** root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `eslint.config.mjs`, `.github/workflows/**`, `scripts/ci/**`.
3. **Everything else** goes through `turbo ls --affected`, which maps changed files to their zone. `pnpm-lock.yaml` changes count only for the zones whose dependencies changed.
4. Changes only outside `zones/` (docs, `e2e/`, `.agents/`, …) → no zones, so nothing is checked per zone and nothing deploys.

Try it locally:

```bash
node scripts/ci/affected-zones.mjs --base origin/staging   # what a PR to staging would deploy
node scripts/ci/affected-zones.mjs --zones shell,account   # manual override
```

## 2. Jobs (`ci.yml`)

1. **`changes`**: runs the detection script and outputs `zones` and `any`.
2. **`repo-checks`**: checks for the whole repo: frozen-lockfile install and `prettier --check .`.
3. **`zone-checks`**: one matrix job per affected zone: `turbo run lint check-types test build --filter=<zone>`. Builds run with `SKIP_ENV_VALIDATION=1` and placeholder URLs, so no secrets are needed. The real env validation happens in the deploy build.
4. **`ci-ok`**: the single required status check. It passes when every zone job was skipped and fails if anything failed or was cancelled.
5. **`deploy-staging` / `deploy-production`**: one `deploy-zone.yml` call per affected zone. They run only if all checks passed. Zones without a `VERCEL_PROJECT_ID_<ZONE>` variable are checked but not deployed (listed in a run notice), so a zone with no Vercel project yet never fails the run.

Concurrency: a newer run cancels an older one on PRs and `staging`. On `main` runs queue instead, so a production deploy is never cut off mid-flight.

## 3. Deploying a zone (`deploy-zone.yml`)

```bash
vercel pull --yes --environment=preview --git-branch=staging   # or --environment=production
vercel build [--prod]
vercel deploy --prebuilt [--prod]
vercel alias set <deployment-url> <STAGING_DOMAIN_<ZONE>>     # staging only
```

`vercel pull` fetches that environment's variables, so the build sees real values. Every variable a zone reads must also be listed in `turbo.json` → `tasks.build.env`, or Turborepo's strict env mode hides it from the build.

## 4. One-time setup

**GitHub → Settings → Secrets and variables → Actions**

| Kind     | Name                       | Value                                                |
| -------- | -------------------------- | ---------------------------------------------------- |
| Secret   | `VERCEL_TOKEN`             | Vercel account token with access to the team         |
| Secret   | `TURBO_TOKEN` _(optional)_ | Turborepo remote cache token                         |
| Variable | `TURBO_TEAM` _(optional)_  | Vercel team slug for the remote cache                |
| Variable | `VERCEL_ORG_ID`            | Team ID (`.vercel/project.json` → `orgId`)           |
| Variable | `VERCEL_PROJECT_ID_<ZONE>` | One per zone, e.g. `VERCEL_PROJECT_ID_SHELL`         |
| Variable | `STAGING_DOMAIN_<ZONE>`    | Staging hostname per zone, e.g. `staging.timmbr.com` |

**GitHub → Settings → Environments**

- `staging`: no protection rules.
- `production`: **Required reviewers**, and deployment branches limited to `main`.

**GitHub → Settings → Branches**: protect `main` and `staging`, requiring the **CI OK** check.

**Vercel (each zone project)**: Root Directory = `zones/<zone>`. Staging env vars go under **Preview**, scoped to the `staging` branch.

## 5. Adding a new zone

1. Create `zones/<new-zone>/` with a `package.json` and a `vercel.json` that disables Git deploys (copy one from an existing zone).
2. Create the Vercel project with Root Directory `zones/<new-zone>`.
3. Add `VERCEL_PROJECT_ID_<NEW_ZONE>` (and `STAGING_DOMAIN_<NEW_ZONE>`) repo variables.
4. Add any new env vars to `turbo.json` → `tasks.build.env`.

No workflow changes are needed.
