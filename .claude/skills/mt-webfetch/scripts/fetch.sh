#!/usr/bin/env bash
# mt-webfetch fallback fetcher via defuddle.md
# Usage: bash fetch.sh <target_url>
# Exit codes: 0 = content returned, 1 = empty/failed, 2 = bad args

set -euo pipefail

URL="${1:-}"
if [[ -z "$URL" ]]; then
  echo "Usage: fetch.sh <target_url>" >&2
  exit 2
fi

# defuddle.md expects the target URL appended as path
DEFUDDLE="https://defuddle.md/${URL}"

# -s silent, -L follow redirects, -f fail on HTTP errors, --max-time 30s
BODY=$(curl -sL --max-time 30 \
  -A "Mozilla/5.0 (compatible; mt-webfetch/1.0)" \
  "$DEFUDDLE" || true)

if [[ -z "$BODY" ]]; then
  echo "mt-webfetch: empty response from defuddle.md for $URL" >&2
  exit 1
fi

echo "$BODY"
