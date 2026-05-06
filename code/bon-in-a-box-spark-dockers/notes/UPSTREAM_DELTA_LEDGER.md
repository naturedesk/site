# Upstream Delta Ledger

## 2026-04-14

### bon-in-a-box-pipeline-engine

- Local branch: `edge`
- Remote default branch: `origin/edge`
- Remote is ahead of local

#### Relevant observed upstream deltas

- `compose.dev.yml`: `viewer` changed from image-based dev path to local build path
- `python-api/app/main_api.py`: improved startup logging and JSON write formatting
- `script-server`: dependency updates (Ktor, Kotlin, libraries)
- `Dockerfile.gateway.prod`: Node base image refresh

#### Judgment

- `viewer` local-build change: adopt candidate, low risk
- `python-api` logging change: adopt candidate, low risk
- `script-server` dependency stack refresh: hold for controlled validation
- gateway build image refresh: hold until current Spark baseline is frozen

#### Local action status

- `viewer` local-build change: applied
- `python-api` logging change: applied
- `script-server` dependency stack refresh: not adopted
- gateway build image refresh: not adopted

### bon-in-a-box-pipelines

- Local branch: `main`
- Remote default branch: `origin/main`
- Local was behind upstream main at check time

#### Relevant observed upstream deltas

- remove invalid load-polygon options in context-specific pipelines
- remove non-working climate metrics scripts from main

#### Judgment

- relevant for pipeline-surface correctness, but not an immediate Spark Docker-path change
- hold for controlled validation against local runner/integration assumptions

## 2026-05-06

### bon-in-a-box-pipeline-engine

- Local branch: `edge`
- Remote default branch: `origin/edge`
- Remote was ahead of local by newer edge Docker definitions.

#### Relevant observed upstream deltas adopted

- `Dockerfile.gateway.prod`: UI builder base `node:current-alpine3.22`, viewer builder base `node:25-alpine3.23`, simplified `/version.txt`, and `TARGETPLATFORM` architecture line.
- `python-api/Dockerfile`: default `TITILER_VERSION=2.0.1`, simplified `/version.txt`, and `TARGETPLATFORM` architecture line.
- `script-server/Dockerfile.prod`: simplified `/version.txt` and `TARGETPLATFORM` architecture line, while preserving local Spark multi-arch Docker CLI/Compose download logic.
- `ui/Dockerfile.dev`: base aligned to `node:current-alpine3.22`.
- `viewer/Dockerfile.dev`: base aligned to `node:25-alpine3.23`.
- `compose.yml`: adopted upstream `/static/scripts` gateway mount while preserving local `MY_UID` / `DOCKER_GID` Spark runtime environment.
- `compose.arm64.python-api.override.yml`: changed local override from floating `TITILER_VERSION: latest` to pinned upstream edge `2.0.1`.

#### Local Spark-specific deltas intentionally preserved

- ARM64-aware Docker CLI/Compose install logic in `script-server/Dockerfile.dev` and `script-server/Dockerfile.prod`.
- Local dev/prod nginx route fixes for `/pipeline-form`, `/script-form`, `/history`, `/info`, and `/pipeline-editor`.
- Local `MY_UID` / `DOCKER_GID` environment propagation for Spark docker-sock access.

### bon-in-a-box-pipelines

- Local branch: `main`
- Remote default branch: `origin/main`
- Remote had newer runner Docker definitions.

#### Relevant observed upstream deltas adopted

- `runners/conda/conda-dockerfile`: aligned to upstream current runner package/install policy.
- `runners/conda/r-environment.yml`: removed stale `r` channel per upstream.
- `runners/julia/julia-dockerfile`: simplified architecture version line to upstream `TARGETPLATFORM` format.
- Runner Docker GitHub workflows aligned to upstream current definitions.

### Verification

- Spark compose config parsed successfully with the arm64 override stack.
- Local dev images rebuilt successfully: `bon-in-a-box_dev-python-api`, `bon-in-a-box_dev-ui`, `bon-in-a-box_dev-viewer`, `bon-in-a-box_dev-script-server`.
- Image spot checks:
  - python-api `/version.txt`: `dev` + `Architecture: linux/arm64`; `TITILER_VERSION=2.0.1`.
  - UI/viewer images report Node v25.9.0 from current upstream node base tags.
  - script-server image reports OpenJDK 21.0.8.

## Rule

Do not adopt upstream changes into the Spark operational path without classifying them first as:

- adopt now
- hold for validation
- ignore for Spark path
