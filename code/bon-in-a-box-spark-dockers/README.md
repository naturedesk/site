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
├── patches/
│   ├── bon-in-a-box-pipeline-engine-spark-arm64.patch
│   └── bon-in-a-box-pipelines-runner-alignment.patch
├── scripts/
│   └── pull_smoke_edge_arm64.sh
└── notes/
    ├── BON_SPARK_DAILY_CHECKLIST.md
    ├── BON_SPARK_DAILY_COMMANDS.md
    └── UPSTREAM_DELTA_LEDGER.md
```

## Current status — 2026-05-06

Known-good local Spark ARM64 alignment:

- Python API default aligned to upstream edge TiTiler `2.0.1`.
- Gateway/UI/viewer Docker base images aligned to newer upstream edge definitions.
- Script-server Dockerfile keeps NatureDesk's ARM64-aware Docker CLI / Docker Compose download logic.
- Local route fixes are preserved for `/pipeline-form`, `/script-form`, `/history`, `/info`, and `/pipeline-editor`.
- Runner Docker definitions are aligned with upstream `bon-in-a-box-pipelines` main; no extra NatureDesk runner patch is currently required.

Important smoke-test result from 2026-05-06:

- `python-api:edge` pulled and passed a basic ARM64 import/version smoke test.
- `gateway:edge` pulled and passed an ARM64 asset/nginx smoke test.
- `runner-julia:edge` pulled and passed an ARM64 Julia smoke test.
- `script-server:edge` pulled as ARM64 and its Java JAR exists, but its bundled `/usr/local/bin/docker` and `/usr/local/bin/docker-compose` are still x86_64 binaries and fail with `Exec format error` on ARM64. Use the local Spark patch/build for script-server on ARM64 until upstream publishes corrected ARM64 Docker CLI binaries.

## Prerequisites

On the Spark ARM64 host:

- Linux ARM64 host with Docker installed.
- User in the `docker` group.
- Git and Bash.
- Network access to GitHub/GHCR.

Check the host architecture:

```bash
uname -m
# expected on Spark ARM64: aarch64
```

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

Copy the `compose/` files into the pipeline-engine checkout:

```bash
cp /path/to/code/bon-in-a-box-spark-dockers/compose/compose.arm64.local.yml \
   ~/naturedesk-bon/bon-in-a-box-pipeline-engine/compose.arm64.local.yml

cp /path/to/code/bon-in-a-box-spark-dockers/compose/compose.arm64.python-api.override.yml \
   ~/naturedesk-bon/bon-in-a-box-pipeline-engine/compose.arm64.python-api.override.yml
```

Apply the pipeline-engine Spark patch:

```bash
cd ~/naturedesk-bon/bon-in-a-box-pipeline-engine
git apply /path/to/code/bon-in-a-box-spark-dockers/patches/bon-in-a-box-pipeline-engine-spark-arm64.patch
```

The runner patch file is intentionally a note-only placeholder at the moment. The runner Docker definitions should match upstream `bon-in-a-box-pipelines` main.

## Prepare local environment files

In the pipeline-engine checkout, the local stack expects a `pipeline-repo` path pointing to the pipelines checkout. One simple approach is a symlink:

```bash
cd ~/naturedesk-bon/bon-in-a-box-pipeline-engine
ln -s ../bon-in-a-box-pipelines pipeline-repo
```

Create or verify the expected path/env files according to the upstream project docs and the copied notes in `notes/`.

For local Spark runs, these environment values are normally needed:

```bash
export DOCKER_GID="$(getent group docker | cut -d: -f3)"
export MY_UID="$(id -u)"
```

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
  up -d script-server python-api gateway runner-conda runner-julia
```

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
