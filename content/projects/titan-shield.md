---
title: "Titan Shield — Autonomous Security Monitoring"
slug: "titan-shield"
status: "live"
stack: ["Linux", "Bash", "Python", "Security"]
published: true
date: 2026-08-02
summary: "A security monitoring system that scans authentication logs, ports, file integrity, and Docker events every 30 minutes — with a Telegram alert watchdog."
tier: "A"
tags: ["security", "monitoring", "linux"]
---

## Live Evidence (2026-08-03)

Numbers captured directly from the running system:

| Metric | Value | Meaning |
|--------|-------|---------|
| **Failed SSH attempts blocked** | **396 IPs banned total**, 5 currently banned | fail2ban catching brute-force attacks continuously |
| **Attack sources** | 107.174.137.235, 165.154.227.158, 1.192.61.70, 172.208.48.177, 92.118.39.71 | Distributed botnet scanning |
| **External ports exposed** | 22 (SSH), 80 (HTTP), 443 (HTTPS) only | Minimal attack surface — everything else closed |
| **Scan cycle** | Every 30 minutes, autonomous | No human watching required |

### Titan Shield Found a Real Issue — and It Got Fixed

While capturing this evidence, Titan Shield's port scanner flagged **port 631 (CUPS printing)** listening on all interfaces:

```
[WARNING] [NETWORK] Unexpected port: 631 ([::]:631)
```

This was a **latent exposure** — the cloud firewall blocked it externally, but the service was listening on 0.0.0.0. If the firewall config ever changed, the printer service would have been reachable from the internet.

**The fix (applied immediately):** `ufw deny 631/tcp` — defense in depth at the second firewall layer. Verified closed from an external port check.

> This is the system working as designed: *detect → alert → fix → verify*. The monitoring isn't decorative — it found a real misconfiguration that manual checking would have missed.

## Problem

A public-facing VPS needs constant security vigilance. Manual checking doesn't scale — and silent failures are the worst kind.

## Solution

Titan Shield: a cron-driven security monitor that runs every 30 minutes:

- **Auth log monitoring** — failed SSH attempts, unusual patterns
- **Port scanning** — unexpected open ports flagged against an expected set
- **File integrity** — detects unauthorized modifications
- **Docker events** — container activity anomalies
- **Alert watchdog** — silent when clean, Telegram alert on real issues

## Architecture

```
cron (*/30) → titan-shield → checks (auth, ports, files, docker)
    │
    ├── protected log (append-only)
    ├── severity-tagged alert log
    └── titan-shield-alert (watchdog → Telegram, silent when clean)
```

**Key decisions:**
- Watchdog pattern: no output = no message (never spam)
- Expected-port allowlist — anything else is flagged
- Logs stored in a protected, non-public location

## Live Evidence

| Metric | Result |
|--------|--------|
| Scan frequency | Every 30 min |
| Alert log entries | 430+ |
| False alerts after fix | 0 (silent = clean) |

## Learnings

1. **Silence is a feature.** A watchdog that only speaks when needed respects attention.
2. **Expected-state lists beat anomaly heuristics.** Knowing what SHOULD be open makes finding what shouldn't trivial.
3. **Test alerts must be cleaned up.** A future-dated test alert kept firing — the fix was deleting it, not changing the system.

## Self-Critique

- No integration with fail2ban's block log yet
- Host-level only — cloud firewall rules checked manually
- Alert severity classification could be smarter

## Evidence References

- Script: `/root/.hermes/scripts/titan-shield`
- Alert log: stored in protected storage, never exposed
