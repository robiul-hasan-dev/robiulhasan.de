---
title: "Titan/OS — A Self-Hosted AI Operating System"
slug: "titan-os"
status: "live"
stack: ["PostgreSQL", "pgvector", "n8n", "Docker", "Python"]
published: true
date: 2026-08-02
summary: "Fourteen AI departments running as agents — intelligence, knowledge validation, quality gates, legal compliance, finance — all self-hosted on a single VPS."
tier: "A"
tags: ["ai-agents", "architecture", "self-hosted", "automation"]
---

## Problem

A solo entrepreneur needs the organizational intelligence of a large company — without the headcount. The question: can AI agents replace departments?

## Solution

Titan/OS: 14 departments implemented as working agents:

- **EISRD** — external intelligence (26 sources, weekly briefings)
- **CLIKSRO** — knowledge validation gate (evidence tiers, honeypots)
- **CILQVEC** — quality gate (12-dimension checks, OS quality score)
- **Legal & Compliance** — obligations, deadlines, German document generator
- **Finance, Tax, Insurance, HR, R&D, Education, Advisory** — all with databases and cron schedules

## Architecture

```
PostgreSQL 16 + pgvector (single source of truth)
    │
    ├── EISRD (26 sources → findings)
    ├── CLIKSRO (capture → validate → knowledge graph)
    ├── CILQVEC (quality gate → debt register)
    ├── Memory (knowledge graph, 36+ nodes, auto-linking)
    └── 8 more departments (scripts + cron + tables)
```

**Key decisions:**
- Everything self-hosted on own infrastructure (€0 marginal cost)
- No VC-funded tools — only MIT/Apache/AGPL
- 20+ cron jobs, Sunday unified digest
- Knowledge graph with semantic auto-linking (pgvector)

## Live Evidence

| Metric | Result |
|--------|--------|
| Departments live | 14 |
| Cron jobs | 20+ |
| Database tables | 169 |
| Knowledge nodes | 36+ (auto-linked) |
| Cost | €0 marginal |

## Learnings

1. **Scripts ≠ departments.** The org audit (61/100) showed several agents were too narrow — Education was a "German learning agent" instead of corporate L&D. The fix was charters, not code.
2. **Honeypots work.** The anti-poisoning system caught a real breach on day one.
3. **Governance triad matters:** one gate for knowledge (what enters), one for quality (what leaves), one for intelligence (what's outside).

## Self-Critique

- Some departments remain single-purpose scripts — the gap between "script" and "department" is real
- EISRD Stage-2 LLM synthesis not yet built (keyword matching only)
- Cross-department orchestration (Sunday digest) is new — needs months of real use

## Evidence References

- Architecture: design docs in the private second-brain repository
- Org audit: 61/100 → improving (private review process)
