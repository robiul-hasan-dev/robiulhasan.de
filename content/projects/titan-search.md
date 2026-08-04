---
title: "Titan Search — Self-Hosted Private AI Search"
slug: "titan-search"
status: "live"
stack: ["SearXNG", "Python", "Docker", "AI", "Datenschutz"]
published: true
date: 2026-08-02
summary: "A private, self-hosted search infrastructure that solves Google's CAPTCHA blocking of automated browsing — with zero tracking, unlimited queries, and an AI synthesis layer."
tier: "A"
tags: ["search", "self-hosted", "docker", "privacy", "ai"]
---

## Problem

Google blocks automated browsing with CAPTCHAs. For an AI Operating System that needs to research continuously, this was a hard wall:

- Every automated research query eventually hit a CAPTCHA challenge
- Browser automation against Google is unreliable and rate-limited
- The system needed **unlimited, private, reliable search** — not a workaround

## Solution

A fully self-hosted search stack:

1. **SearXNG** (open-source metasearch engine) in Docker — aggregates results from multiple engines without tracking users
2. **Custom AI synthesis layer** — wraps raw results with an AI-generated summary
3. **Private by design** — no search history, no tracking, no third-party cookies

## Architecture

```
AI Agents (Hermes, Claude, Gemini)
    │
    ▼
titan-search (synthesis wrapper)
    │
    ▼
SearXNG (Docker, internal network only)
    │
    ▼
Multiple search engines (aggregated, untracked)
```

**Key decisions:**
- SearXNG bound to local interface only — never exposed publicly (ADR-010)
- Custom `settings.yml` branded "Titan Search"
- UID permissions fixed for container security (not running as root)
- Result: **42 results per query, no CAPTCHAs, unlimited volume**

## Live Evidence

| Metric | Result |
|--------|--------|
| CAPTCHA blocks | **0** (vs constant with Google) |
| Results per query | 42 |
| Cost | €0 (self-hosted, existing VPS) |
| Privacy | No tracking, no history |
| Availability | 24/7, no rate limits |

## Learnings

1. **Self-hosted beats workaround.** Google's CAPTCHA isn't a technical challenge to solve — it's a signal to own your infrastructure.
2. **Metasearch is the privacy answer.** Aggregating engines means no single provider builds a profile of you.
3. **The AI layer changes everything.** Raw search results are data; synthesized answers are intelligence.

## Self-Critique

- Search result quality varies by engine health — needs better failover
- No caching layer yet — repeated queries re-fetch
- Synthesis quality depends on the model used; could be improved with a dedicated ranking step

## Evidence References

- Repo: private second-brain (architecture docs)
- Live: internal network only (no public exposure)
