# BON in a Box on Spark ARM64 — NatureDesk Docker package

This folder contains the NatureDesk Spark ARM64 Docker alignment package for BON in a Box.

It is meant for University of Amsterdam students who want to reproduce the local Spark ARM64 setup without inheriting the full experimental NatureDesk workspace.

## What this package is

A small overlay around the upstream GEO BON repositories:

- `GEO-BON/bon-in-a-box-pipeline-engine` — application services: gateway, UI, viewer, Python API, script server.
- `GEO-BON/bon-in-a-box-pipelines` — runner images and example pipelines.

The package keeps the local Spark-specific fixes separate from upstream code:

```text
code/bon-in-a-box-spark-dockers/
├── README.md
├── compose/
│   ├── compose.arm64.local.yml
│   └── compose.arm64.python-api.override.yml
├── env/
│   ├── dev-paths.env.example
│   ├── hpc-secrets.env.example
│   └── runner.env.example
├── patches/
│   ├── bon-in-a-box-pipeline-engine-spark-arm64.patch
│   └── bon-in-a-box-pipelines-runner-alignment.patch
├── scripts/
│   ├── pull_smoke_edge_arm64.sh
│   └── wait_for_endpoint.sh
├── explainers/
│   └── team_platypus_arm_stac_fix_explainer_2026-06-05.pdf
└── notes/
    ├── BON_SPARK_DAILY_CHECKLIST.md
    ├── BON_SPARK_DAILY_COMMANDS.md
    ├── ARM64_STAC_GDALCUBES_BII_FIX.md
    ├── STUDENT_CLEAN_CHECKOUT_ENV_FILES.md
    └── UPSTREAM_DELTA_LEDGER.md
```

## Current status — 2026-06-05

Known-good local Spark ARM64 alignment:

- Python API default aligned to upstream edge TiTiler `2.0.1`.
- Gateway/UI/viewer Docker base images aligned to newer upstream edge definitions.
- Script-server Dockerfile keeps NatureDesk's ARM64-aware Docker CLI / Docker Compose download logic.
- Local route fixes are preserved for `/pipeline-form`, `/script-form`, `/history`, `/info`, and `/pipeline-editor`.
- Runner Docker definitions are aligned with upstream `bon-in-a-box-pipelines` main, with Spark ARM64 R runner support for source-built packages that are unavailable as conda-forge `linux-aarch64` packages.
- BII browser workflow now passes the previous ARM64 STAC/gdalcubes conda solve blocker by routing `data>loadFromStac` and `zonal_statistics>zonal_stats` through the validated ARM64 `rbase` runner environment.

Important smoke-test result from 2026-05-06:

- `python-api:edge` pulled and passed a basic ARM64 import/version smoke test.
- `gateway:edge` pulled and passed an ARM64 asset/nginx smoke test.
- `runner-julia:edge` pulled and passed an ARM64 Julia smoke test.
- `script-server:edge` pulled as ARM64 and its Java JAR exists, but its bundled `/usr/local/bin/docker` and `/usr/local/bin/docker-compose` are still x86_64 binaries and fail with `Exec format error` on ARM64. Use the local Spark patch/build for script-server on ARM64 until upstream publishes corrected ARM64 Docker CLI binaries.

Important BII workflow result from 2026-06-04:

- Root cause: `data>loadFromStac.yml` forced a per-script conda environment with `r-gdalcubes=0.7.1` and `r-proj`, which are unavailable for the Spark ARM64 route as conda-forge `linux-aarch64` packages.
- Downstream validation exposed the same class of ARM64 conda gap in `zonal_statistics>zonal_stats.yml` through `r-exactextractr`.
- Fix: both scripts now use the validated ARM64 `rbase` runner route, with `gdalcubes` and `exactextractr` available from the runner image/source-install path.
- Verification: browser/gateway/script-server BII smoke test reached analysis, wrote STAC rasters, `BII_change.tif`, and `zonal_stats.csv` for supported years `2015` to `2020`.

See `notes/ARM64_STAC_GDALCUBES_BII_FIX.md` for the issue/fix record and `explainers/team_platypus_arm_stac_fix_explainer_2026-06-05.pdf` for the stored explainer. Hans confirmed on 2026-06-05 that the explainer is public-release safe; any older internal wording inside the PDF is an outdated label.

## Prerequisites

On the Spark ARM64 host:

- Linux ARM64 host with Docker installed.
- User in the `docker` group.
- Git and Bash.
- Network access to GitHub/GHCR.

Check the host architecture and Docker access:

```bash
uname -m
# expected on Spark ARM64: aarch64

getent group docker
id -nG | grep -w docker
docker ps
```

If Docker group membership was just changed, a new login session may be required before `docker ps` works without permission errors.

## Clone upstream repositories

Use a clean workspace, for example:

```bash
mkdir -p ~/naturedesk-bon
cd ~/naturedesk-bon

git clone https://github.com/GEO-BON/bon-in-a-box-pipeline-engine.git
git clone https://github.com/GEO-BON/bon-in-a-box-pipelines.git

cd bon-in-a-box-pipeline-engine
git checkout edge
git fetch origin edge

cd ../bon-in-a-box-pipelines
git checkout main
git fetch origin main
```

## Apply the NatureDesk Spark overlay

Set one overlay path and copy the `compose/` files into the pipeline-engine checkout:

```bash
export OVERLAY_DIR=/absolute/path/to/code/bon-in-a-box-spark-dockers

test -f "$OVERLAY_DIR/README.md"

cp "$OVERLAY_DIR/compose/compose.arm64.local.yml" \
   ~/naturedesk-bon/bon-in-a-box-pipeline-engine/compose.arm64.local.yml

cp "$OVERLAY_DIR/compose/compose.arm64.python-api.override.yml" \
   ~/naturedesk-bon/bon-in-a-box-pipeline-engine/compose.arm64.python-api.override.yml
```

Apply the pipeline-engine Spark patch:

```bash
cd ~/naturedesk-bon/bon-in-a-box-pipeline-engine
git apply "$OVERLAY_DIR/patches/bon-in-a-box-pipeline-engine-spark-arm64.patch"
```

The runner patch file is intentionally a note-only placeholder at the moment. The runner Docker definitions should match upstream `bon-in-a-box-pipelines` main.

## Prepare local environment files

In the pipeline-engine checkout, the local stack expects a `pipeline-repo` path pointing to the pipelines checkout. One simple approach is a symlink:

```bash
cd ~/naturedesk-bon/bon-in-a-box-pipeline-engine
ln -s ../bon-in-a-box-pipelines pipeline-repo
```

For a clean student checkout, use the safe config-stage templates in `env/` rather than private local files:

```bash
cp "$OVERLAY_DIR/env/dev-paths.env.example" .dev-paths.env
cp "$OVERLAY_DIR/env/runner.env.example" pipeline-repo/runner.env

mkdir -p .naturedesk-dummy-secrets
touch .naturedesk-dummy-secrets/hpc_ssh_key \
      .naturedesk-dummy-secrets/hpc_known_hosts \
      .naturedesk-dummy-secrets/hpc_ssh_config
chmod 600 .naturedesk-dummy-secrets/hpc_ssh_key
cp "$OVERLAY_DIR/env/hpc-secrets.env.example" .hpc-secrets.env
```

Then set the local Docker/user variables:

```bash
export DOCKER_GID="$(getent group docker | cut -d: -f3)"
export MY_UID="$(id -u)"
```

If `DOCKER_GID` is empty or `docker ps` fails, stop and fix Docker permissions or use an explicitly documented `sudo docker` path. Do not hide this as a NatureDesk-specific issue.

For details and failure-reporting instructions, see `notes/STUDENT_CLEAN_CHECKOUT_ENV_FILES.md`.

## Config-only validation before build

Before building or starting services, run a config-only Compose check:

```bash
docker compose \
  -f compose.yml \
  -f compose.dev.yml \
  -f pipeline-repo/compose.env.yml \
  -f compose.arm64.local.yml \
  -f compose.arm64.python-api.override.yml \
  --env-file pipeline-repo/runner.env \
  --env-file .dev-paths.env \
  --env-file .hpc-secrets.env \
  config --quiet
```

A passing config check means the overlay and local env wiring are coherent enough for the next rehearsal step. It does **not** prove that the full stack builds, runs, or is student/production ready.

## Build the local Spark ARM64 services

From `bon-in-a-box-pipeline-engine`:

```bash
export DOCKER_GID="$(getent group docker | cut -d: -f3)"
export MY_UID="$(id -u)"

docker compose \
  -f compose.yml \
  -f compose.dev.yml \
  -f pipeline-repo/compose.env.yml \
  -f compose.arm64.local.yml \
  -f compose.arm64.python-api.override.yml \
  --env-file pipeline-repo/runner.env \
  --env-file .dev-paths.env \
  --env-file .hpc-secrets.env \
  build python-api ui viewer script-server
```

Then start the local stack:

```bash
docker compose \
  -f compose.yml \
  -f compose.dev.yml \
  -f pipeline-repo/compose.env.yml \
  -f compose.arm64.local.yml \
  -f compose.arm64.python-api.override.yml \
  --env-file pipeline-repo/runner.env \
  --env-file .dev-paths.env \
  --env-file .hpc-secrets.env \
  up -d script-server python-api gateway runner-conda runner-julia
```

## Known issue box — `script-server:edge` on ARM64

The upstream `script-server:edge` image currently pulls as ARM64, but its bundled Docker CLI / Docker Compose binaries may still be x86_64 and fail with `Exec format error` on ARM64.

Interpretation:

- this is why the NatureDesk local Spark script-server Docker patch still exists;
- do not claim upstream `script-server:edge` alone is ARM64-runtime-ready;
- do not hide this from students — it is a useful reproducibility lesson.

## Fixed issue box — BII `loadFromStac` conda solve on ARM64

The BII browser workflow previously failed before analysis when `data>loadFromStac` tried to create a script-specific conda environment on ARM64.

Interpretation:

- this was a package availability problem in the ARM64 conda solve path, not a student input problem;
- `r-gdalcubes`, `r-proj`, and later `r-exactextractr` exposed the same missing-package class;
- the fixed Docker/runner documentation route is to use the validated ARM64 `rbase` environment for these R geospatial scripts;
- BII year selection still matters: the BII change step supports `2000`, `2005`, `2010`, `2015`, and `2020`.

## Smoke-test upstream edge images only

To test the published GHCR edge images without mutating source repos or running Compose:

```bash
bash /path/to/code/bon-in-a-box-spark-dockers/scripts/pull_smoke_edge_arm64.sh
```

Expected interpretation:

- Python API, gateway, and runner-julia should pass basic ARM64 smoke checks.
- Upstream `script-server:edge` may still fail on Docker CLI / Compose execution with `Exec format error`; that is the known reason for keeping the local Spark script-server Docker patch.

## Useful local endpoints after stack startup

```bash
curl -fsS http://127.0.0.1/tiler/
curl -fsS http://127.0.0.1/script/list
curl -fsS http://127.0.0.1/pipeline/list
```

For readiness-aware endpoint checks and a hello-world run, see:

- `notes/BON_SPARK_DAILY_COMMANDS.md`
- `notes/BON_SPARK_DAILY_CHECKLIST.md`

## Maintenance rules

1. Keep upstream GEO BON code and NatureDesk Spark overlays separate.
2. Fetch upstream first, then classify changes as: adopt now, hold for validation, or ignore for Spark path.
3. Do not remove the local ARM64 script-server Docker CLI logic until upstream `script-server:edge` passes Docker CLI / Compose smoke tests on ARM64.
4. Do not treat a successful image pull as a successful runtime test; always run the smoke checks.
5. Record meaningful upstream alignment decisions in `notes/UPSTREAM_DELTA_LEDGER.md`.

## For students: what to submit when reporting a problem

Please include:

- Host architecture: `uname -m`.
- Docker version: `docker --version`.
- Output of `docker compose config --quiet` if Compose startup fails.
- Output of `scripts/pull_smoke_edge_arm64.sh` if upstream image compatibility is the issue.
- The exact command you ran and the first real error line.

Keep reports small and reproducible. That is more useful than a full terminal dump.
