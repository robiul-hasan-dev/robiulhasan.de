#!/usr/bin/env bash
# Writes public/data/shield.json — a minimal, public-safe status heartbeat
# consumed by ShieldStrip.tsx. No internal operational data belongs here:
# status + timestamps only.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DATA_DIR="${SITE_ROOT}/public/data"
OUT_FILE="${DATA_DIR}/shield.json"

mkdir -p "${DATA_DIR}"

TMP_FILE="$(mktemp "${DATA_DIR}/.shield.json.XXXXXX")"
trap 'rm -f "${TMP_FILE}"' EXIT

NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

cat > "${TMP_FILE}" <<JSON
{
  "generated_at": "${NOW}",
  "status": "operational",
  "last_check": "${NOW}"
}
JSON

# Atomic swap: visitors never observe a half-written file.
chmod 644 "${TMP_FILE}"
mv -f "${TMP_FILE}" "${OUT_FILE}"
trap - EXIT
