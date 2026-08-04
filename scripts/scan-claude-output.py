#!/usr/bin/env python3
"""Claude Code output scanner — checks generated code for malicious patterns.

Runs AFTER Claude Code writes files, BEFORE anything is built/deployed.
Catches: sleeping viruses, backdoors, crypto miners, obfuscated payloads,
network exfiltration, dangerous eval, suspicious deps, postinstall scripts.

Usage: python3 scripts/scan-claude-output.py [--path /root/site] [--strict]
Exit code 0 = clean, 1 = findings (review before proceeding).
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

# ── High-signal malicious patterns ─────────────────────────────────────
HIGH_RISK = [
    # Process execution / reverse shells
    (r"child_process", "child_process import (process exec)"),
    (r"exec\(|spawn\(|popen\(|system\(", "process execution"),
    (r"reverse\s*shell|bash\s*-i|/dev/tcp/|nc\s+-e", "reverse shell"),
    (r"base64\.b64decode\(|atob\(|fromCharCode", "obfuscated payload decode"),
    (r"eval\(|new\s+Function\(|Function\(['\"]", "dynamic eval"),
    (r"innerHTML\s*=\s*['\"`]?\s*<script", "XSS via innerHTML"),
    (r"document\.cookie|document\.location\s*=", "cookie/location theft"),
    # Crypto mining
    (r"coinhive|miner|monero|xmrig|cryptonight|webminepool", "crypto miner"),
    # Network exfiltration
    (r"https?://(?!robiulhasan|localhost|127\.0\.0\.1|schema\.org|w3\.org|nextjs|react|github|linkedin|fonts)",
     "unexpected external URL"),
    (r"fetch\(['\"`](?!['\"`]?/)", "fetch to absolute URL"),
    (r"XMLHttpRequest|WebSocket\(|EventSource\(", "network call"),
    # Suspicious deps / install
    (r"npm\s+install\s+.*--global|curl.*\|.*(sh|bash)|wget.*\|.*sh", "remote code install"),
    (r"postinstall", "postinstall script (supply-chain risk)"),
    (r"eval\s*\(.*request|Function\s*\(.*response", "reflected code exec"),
    # Obfuscation
    (r"\\x[0-9a-f]{2}\\x[0-9a-f]{2}\\x[0-9a-f]{2}", "hex-encoded strings"),
    (r"String\.fromCharCode\(|\.replace\(/./g", "character obfuscation"),
    (r"constructor\.constructor|__proto__|prototype\s*\[", "prototype pollution"),
    # Env/fs access OUTSIDE server-only files (client-side leak risk)
    (r"process\.env", "env access (verify it's server-side only)"),
    (r"require\(['\"]fs['\"]\)", "fs access"),
]

# ── Medium-signal (review manually) ────────────────────────────────────
MEDIUM_RISK = [
    (r"dangerouslySetInnerHTML", "dangerouslySetInnerHTML (sanitize check)"),
    (r"localStorage|sessionStorage", "storage access"),
    (r"setInterval|setTimeout", "timers (check intent)"),
    (r"Math\.random", "randomness (check intent)"),
    (r"window\.open|location\.href\s*=", "navigation"),
]


def scan_file(path: Path, strict: bool) -> list[str]:
    findings = []
    try:
        content = path.read_text(errors="replace")
    except Exception:
        return findings
    patterns = HIGH_RISK if strict else HIGH_RISK
    for pat, desc in patterns:
        for m in re.finditer(pat, content, re.IGNORECASE):
            line_no = content[: m.start()].count("\n") + 1
            line = content.splitlines()[line_no - 1].strip()[:100]
            findings.append(f"{path}:{line_no} [{desc}] → {line}")
    return findings


def scan_new_deps(package_json: Path) -> list[str]:
    findings = []
    if not package_json.exists():
        return findings
    try:
        deps = json.loads(package_json.read_text()).get("dependencies", {})
    except Exception:
        return findings
    known = {"next", "react", "react-dom", "gray-matter", "remark", "remark-html",
             "zod", "pg", "typescript", "eslint", "tailwindcss", "three",
             "@react-three/fiber", "@types/three"}
    for dep in deps:
        if dep not in known:
            findings.append(f"NEW DEPENDENCY: {dep}@{deps[dep]} — review before install")
    return findings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default="/root/site", help="dir to scan")
    ap.add_argument("--strict", action="store_true", help="include medium-risk patterns")
    args = ap.parse_args()

    root = Path(args.path)
    findings = []
    scanned = 0

    for ext in ("tsx", "ts", "js", "mjs", "cjs", "json", "yml", "yaml", "mjs"):
        for p in root.rglob(f"*.{ext}"):
            if any(part.startswith(".") or part in ("node_modules", ".next") for part in p.parts):
                continue
            scanned += 1
            findings.extend(scan_file(p, args.strict))

    findings.extend(scan_new_deps(root / "package.json"))

    print(f"Scanned {scanned} files.")
    if findings:
        print(f"\n⚠️  {len(findings)} FINDING(S):")
        for f in findings[:40]:
            print(f"  {f}")
        print("\n→ Review before building. Clean findings first, then re-scan.")
        sys.exit(1)
    print("✅ CLEAN — no malicious patterns detected.")
    sys.exit(0)


if __name__ == "__main__":
    main()
