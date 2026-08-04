---
title: "Titan/OS — A Self-Hosted AI Operating System"
slug: "titan-os"
status: "live"
stack: ["PostgreSQL", "pgvector", "Docker", "Python"]
published: true
date: 2026-08-02
summary: "Fourteen AI departments running as agents — intelligence, knowledge validation, quality gates, legal compliance, finance — all self-hosted on a single VPS."
tier: "A"
tags: ["ai-agents", "architecture", "self-hosted", "automation"]
---

## Problem

A solo entrepreneur needs the organizational intelligence of a large company — without the headcount. The question: can AI agents replace departments?

## Solution

Titan/OS: a multi-agent operating system where specialized agents mirror company departments:

- **Intelligence agent** — external monitoring, weekly briefings
- **Knowledge agent** — validation gates with evidence tiers
- **Quality agent** — multi-dimension checks and a debt register
- **Legal & Compliance** — obligations, deadlines, document generation
- **Finance, Tax, Insurance, HR, R&D, Education, Advisory** — specialized workflows with structured data and schedules

## Architecture

```
PostgreSQL 16 + pgvector (single source of truth)
    │
    ├── Intelligence agent (external sources → findings)
    ├── Knowledge agent (capture → validate → knowledge graph)
    ├── Quality agent (quality gate → debt register)
    ├── Memory (knowledge graph, semantic auto-linking)
    └── Specialized workflow agents (scripts + schedules + tables)
```

**Key decisions:**
- Everything self-hosted on own infrastructure
- No VC-funded tools — only MIT/Apache/AGPL
- Automated recurring workflows with a unified digest
- Knowledge graph with semantic auto-linking (pgvector)

## Live Evidence

| Metric | Result |
|--------|--------|
| Departments live | 14 |
| Database tables | 169 |
| Cost | €0 marginal |

## Learnings

1. **Scripts ≠ departments.** The org audit (61/100) showed several agents were too narrow — Education was a "German learning agent" instead of corporate L&D. The fix was charters, not code.
2. **Honeypots work.** The anti-poisoning system caught a real breach on day one.
3. **Governance triad matters:** one gate for knowledge (what enters), one for quality (what leaves), one for intelligence (what's outside).

## Self-Critique

- Some departments remain single-purpose scripts — the gap between "script" and "department" is real
- LLM synthesis for intelligence workflows not yet built (keyword matching only)
- Cross-department orchestration (unified digest) is new — needs months of real use

## Evidence References

- Architecture: design docs in the private second-brain repository
- Org audit: 61/100 → improving (private review process)
