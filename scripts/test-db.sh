#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

node --env-file=.env scripts/test-db.ts
