#!/usr/bin/env bash
set -euo pipefail

url="${1:?usage: wait_for_endpoint.sh <url> [timeout_seconds]}"
timeout_seconds="${2:-60}"
start_epoch="$(date +%s)"

while true; do
  if curl -fsS "$url" >/dev/null; then
    echo "ready: $url"
    exit 0
  fi

  now_epoch="$(date +%s)"
  if (( now_epoch - start_epoch >= timeout_seconds )); then
    echo "timeout waiting for: $url" >&2
    exit 1
  fi

  sleep 2
done
