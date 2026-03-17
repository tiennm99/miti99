#!/bin/bash
# List existing tags in the repo ranked by frequency.
# Usage: list_existing_tags.sh
# Outputs: tag count and name, sorted most-used first (top 40)
#
# NOTE: This script is NOT currently used by the mt-add-tags skill.
# Tag normalization is disabled until existing posts have standardized tags.
# To enable, uncomment step 4a in SKILL.md.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
CONTENT_DIR="$PROJECT_ROOT/content/post"

grep -rh "^tags:" "$CONTENT_DIR" \
  | tr ',' '\n' \
  | grep -oP '(?<=")[^"]+(?=")' \
  | sort \
  | uniq -c \
  | sort -rn \
  | head -40
