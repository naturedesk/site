# BON in a Box on Spark, Daily Commands

## Bring up working arm64 stack

```bash
export BON_ENGINE_DIR="${BON_ENGINE_DIR:-$HOME/naturedesk-bon/bon-in-a-box-pipeline-engine}"
export BON_SPARK_PACKAGE_DIR="${BON_SPARK_PACKAGE_DIR:-/path/to/code/bon-in-a-box-spark-dockers}"
export DOCKER_GID="$(getent group docker | cut -d: -f3)"
export MY_UID="$(id -u)"
cd "$BON_ENGINE_DIR"

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

## Routed endpoint checks

Use readiness-aware checks to avoid false regressions during startup.

```bash
$BON_SPARK_PACKAGE_DIR/scripts/wait_for_endpoint.sh http://127.0.0.1/tiler/
$BON_SPARK_PACKAGE_DIR/scripts/wait_for_endpoint.sh http://127.0.0.1/script/list
$BON_SPARK_PACKAGE_DIR/scripts/wait_for_endpoint.sh http://127.0.0.1/pipeline/list
```

## Hello-world execution check

```bash
payload='{"some_int":3,"study_area_bbox":{"bbox":[-73.0,45.0,-72.0,46.0],"CRS":{"authority":"EPSG","code":4326}}}'
runid=$(curl -fsS -X POST 'http://127.0.0.1/script/helloWorld%3EhelloPython.yml/run' -H 'Content-Type: application/json' --data "$payload")
sleep 5
curl -fsS 'http://127.0.0.1/api/history?limit=20'
```

## Ownership check

```bash
find "$BON_ENGINE_DIR/pipeline-repo/output/helloWorld/helloPython" -maxdepth 2 -type f -printf '%u %g %p\n' | sort
```

## GitHub update scan

```bash
git -C "$BON_ENGINE_DIR" fetch origin --quiet
git -C "${BON_PIPELINES_DIR:-$HOME/naturedesk-bon/bon-in-a-box-pipelines}" fetch origin --quiet
git -C "$BON_ENGINE_DIR" branch -r
git -C "${BON_PIPELINES_DIR:-$HOME/naturedesk-bon/bon-in-a-box-pipelines}" branch -r
```
