#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
if curl -sf "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
  echo "Support ticket server already running on port ${PORT}"
  exit 0
fi

exec npm run dev