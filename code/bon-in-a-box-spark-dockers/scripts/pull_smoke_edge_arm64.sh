#!/usr/bin/env bash
set -euo pipefail

# Pull and smoke-test upstream BON in a Box edge images for linux/arm64.
# This script does not mutate source repositories and does not run Docker Compose.

images=(
  "ghcr.io/geo-bon/bon-in-a-box-pipeline-engine/python-api:edge"
  "ghcr.io/geo-bon/bon-in-a-box-pipeline-engine/gateway:edge"
  "ghcr.io/geo-bon/bon-in-a-box-pipeline-engine/script-server:edge"
  "ghcr.io/geo-bon/bon-in-a-box-pipelines/runner-julia:edge"
)

for img in "${images[@]}"; do
  echo "=== pull ${img} ==="
  docker pull --platform linux/arm64 "${img}"
  docker image inspect "${img}" --format 'id={{.Id}} arch={{.Architecture}} os={{.Os}} created={{.Created}}'
done

echo "=== smoke python-api ==="
docker run --rm --platform linux/arm64 \
  --entrypoint sh ghcr.io/geo-bon/bon-in-a-box-pipeline-engine/python-api:edge \
  -lc 'cat /version.txt; echo TITILER_VERSION=${TITILER_VERSION:-}; python - <<"PY"
import fastapi
print("python_ok")
print("fastapi", fastapi.__version__)
PY'

echo "=== smoke gateway ==="
docker run --rm --platform linux/arm64 \
  --entrypoint sh ghcr.io/geo-bon/bon-in-a-box-pipeline-engine/gateway:edge \
  -lc 'cat /version.txt; /usr/sbin/nginx -v; test -d /etc/nginx/html/ui; test -d /etc/nginx/html/viewer; echo gateway_assets_ok'

echo "=== smoke script-server ==="
docker run --rm --platform linux/arm64 \
  --entrypoint sh ghcr.io/geo-bon/bon-in-a-box-pipeline-engine/script-server:edge \
  -lc 'cat /version.txt; java -version 2>&1 | head -1; test -f /root/biab-script-server.jar; echo script_server_jar_ok; /usr/local/bin/docker --version; /usr/local/bin/docker-compose --version'

echo "=== smoke runner-julia ==="
docker run --rm --platform linux/arm64 \
  ghcr.io/geo-bon/bon-in-a-box-pipelines/runner-julia:edge --version
docker run --rm --platform linux/arm64 \
  --entrypoint /usr/local/julia/bin/julia ghcr.io/geo-bon/bon-in-a-box-pipelines/runner-julia:edge \
  -e 'println(VERSION); println(Sys.ARCH); println("julia_ok")'
