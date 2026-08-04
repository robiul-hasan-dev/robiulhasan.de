#!/usr/bin/env python3
"""Update Caddy CSP with live inline-script hashes.

Fetches the live site HTML, extracts every inline <script> hash,
and rebuilds the script-src directive in the Caddyfile to include
the union of existing + live hashes. Safe: never removes existing
hashes (avoids breaking cached pages).

Usage: python3 scripts/update-csp-live.py [--dry-run]
"""
import argparse
import base64
import hashlib
import re
import sys
import urllib.request

CADDYFILE = "/opt/portfolio-site/Caddyfile"
SITE = "https://robiulhasan.de/"


def get_live_hashes() -> set[str]:
    with urllib.request.urlopen(SITE, timeout=30) as r:
        html = r.read().decode("utf-8", "replace")
    scripts = re.findall(r"<script([^>]*)>(.*?)</script>", html, re.DOTALL)
    hashes = set()
    for _attrs, content in scripts:
        if content.strip():
            h = hashlib.sha256(content.encode()).digest()
            hashes.add(f"'sha256-{base64.b64encode(h).decode()}'")
    return hashes


def get_existing(caddy: str) -> set[str]:
    m = re.search(r"script-src([^;]+);", caddy)
    if not m:
        return set()
    return {h for h in m.group(1).split() if h.startswith("'sha256-")}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    live = get_live_hashes()
    print(f"[csp] {len(live)} live inline-script hashes found")
    if not live:
        print("[csp] ERROR: no inline scripts found — aborting")
        sys.exit(1)

    caddy = open(CADDYFILE).read()
    existing = get_existing(caddy)
    print(f"[csp] {len(existing)} hashes currently in Caddy CSP")

    missing = live - existing
    if not missing:
        print("[csp] ✅ All live hashes already covered — no change needed")
        return

    print(f"[csp] {len(missing)} NEW hashes to add:")
    for h in sorted(missing):
        print(f"  + {h}")

    if args.dry_run:
        print("[csp] dry-run — not modifying Caddyfile")
        return

    # Build new script-src: keep existing order, append missing
    all_hashes = sorted(existing | live, key=lambda h: h)
    new_src = "script-src 'self' " + " ".join(all_hashes) + ";"

    caddy_new = re.sub(r"script-src[^;]+;", new_src, caddy, count=1)
    if caddy_new == caddy:
        print("[csp] ERROR: regex did not match script-src — aborting")
        sys.exit(1)

    open(CADDYFILE, "w").write(caddy_new)
    print(f"[csp] ✅ Caddyfile updated ({len(all_hashes)} total hashes)")
    print("[csp] NEXT: docker exec caddy caddy reload --config /etc/caddy/Caddyfile")


if __name__ == "__main__":
    main()
