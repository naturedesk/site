# Student clean-checkout env files

Status: NatureDesk helper note / no secrets / safe to publish after review

This note closes the main hidden assumption found in the clean-checkout rehearsal: the upstream BON in a Box compose command expects two local env files before `docker compose config --quiet` can pass.

## 1. `.dev-paths.env`

Create this file in the `bon-in-a-box-pipeline-engine` checkout.

Minimal local template:

```bash
cat > .dev-paths.env <<'ENV'
PIPELINE_REPO=./pipeline-repo
ENV
```

If upstream changes the expected variable names, prefer upstream docs and record the delta in `notes/UPSTREAM_DELTA_LEDGER.md`.

## 2. `pipeline-repo/runner.env`

Create this file in the `bon-in-a-box-pipelines` checkout, which is symlinked as `pipeline-repo` from the pipeline-engine checkout.

Minimal non-secret template for config rehearsal:

```bash
cat > pipeline-repo/runner.env <<'ENV'
MY_UID=1000
DOCKER_GID=999
ENV
```

Then override with the current host values before running compose:

```bash
export MY_UID="$(id -u)"
export DOCKER_GID="$(getent group docker | cut -d: -f3)"
```

Do not commit local secrets, API tokens, personal paths, or production credentials into `runner.env`.

## 3. Config-only check before build

Run this before any build:

```bash
docker compose \
  -f compose.yml \
  -f compose.dev.yml \
  -f pipeline-repo/compose.env.yml \
  -f compose.arm64.local.yml \
  -f compose.arm64.python-api.override.yml \
  --env-file pipeline-repo/runner.env \
  --env-file .dev-paths.env \
  config --quiet
```

If this fails, fix the first missing file/path/variable before building images.

## 4. Boundary

This env-file setup only prepares the BON Docker stack. It does not change NatureDesk KB retrieval readiness, PostgreSQL sync, or public/client-facing retrieval permissions.
