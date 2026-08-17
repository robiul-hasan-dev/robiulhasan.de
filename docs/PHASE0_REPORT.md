# PHASE 0 REPORT — Portfolio Master Implementation Directive v1.0

**Date:** 2026-08-17 · **Agent:** Hermes (Main Agent) · **Repo:** robiul-hasan-dev/robiulhasan.de
**Directive status:** Phase 0 COMPLETE — no production changes made.

---

## 1. OUTCOME — what is now genuinely usable

The authoritative project is identified and audited. No code, DNS, firewall, analytics, or
deployment was changed. The current site is a **live, secure, honest-but-proof-light German
draft** — production-ready in infrastructure, NOT production-ready in content/claims.

## 2. EVIDENCE — files, routes, measurements

### 2.1 Repository / runtime inventory
| Item | Value |
|---|---|
| Path | `/root/site` |
| Branch | `main` @ `e28d95b` (clean tree, 0 uncommitted) |
| Remote | `https://github.com/robiul-hasan-dev/robiulhasan.de.git` (credential-helper auth, no plaintext token) |
| Stack | Next.js 16.3.0 · React 19.2.8 · TypeScript ^5 · Tailwind |
| Content | 3 projects · 4 posts · 5 knowledge (markdown) |
| Recent commits | fonts (e28d95b) · markdown sanitize (5e487af) · mobile nav (36d7c05) |

### 2.2 Deployment inventory
| Item | Value |
|---|---|
| Container | `titan-site` — image `portfolio-site-titan-site`, restart=unless-stopped, mem 384MB, **user: nextjs (non-root)** |
| Proxy | Caddy (Hetzner VPS) — auto-HTTPS, HSTS preload, full CSP (hash-allowlist), nosniff, XFO DENY, Referrer-Policy, Permissions-Policy |
| Domain | `robiulhasan.de` → 178.105.140.243 · HTTPS 200 · **www NOT configured (000)** |
| Health | TTFB 94ms · total 96ms · 37.6KB HTML |
| Rollback | Docker image tagged; previous versions removable (rollback images not retained) |

### 2.3 Route / component / content map
**Routes (15):** `/` `/about` `/blog` `/blog/[slug]` `/knowledge` `/knowledge/[slug]` `/projects`
`/projects/[slug]` `/lab` `/lab/ask-titan` `/lab/titan-search` `/impressum` `/datenschutz`
`/docs/adr` `/rss.xml` — plus robots.ts + sitemap.ts

**Components (9, ALL client-side `'use client'`):** Hero, Hero3D, AIDemo, ContactForm, CountUp,
Reveal, ShieldStrip, SiteNav, ThemeToggle

**Directive §2.2 gap checks:**
| # | Requirement | Status |
|---|---|---|
| 1 | Proof-light homepage | ⚠️ TRUE — CountUp stats only, no case-study depth |
| 2 | Projects are cards not case studies | ⚠️ TRUE |
| 3 | Contact form demonstrates but does not deliver | ⚠️ TRUE — server action exists (Zod+rate-limit) but delivery target unconfirmed |
| 4 | No CV download/print | ⚠️ TRUE — ABSENT |
| 5 | No verified GitHub/LinkedIn links | ⚠️ TRUE — ABSENT |
| 6 | German only, EN missing | ⚠️ TRUE — no i18n, no hreflang |
| 7 | Legal pages exist but Impressum has placeholders | ⚠️ TRUE — placeholders confirmed |
| 8 | SEO partial: robots+sitemap exist; og:image, icon, hreflang ABSENT | ⚠️ TRUE |
| 9 | ALL components client-side | ⚠️ TRUE — directive flag confirmed |
| 10 | No automated a11y/perf/security gate | ⚠️ TRUE |
| 11 | WCAG untested | ⚠️ TRUE |
| 12 | No publishing workflow | ⚠️ TRUE (markdown content is the workflow) |

### 2.4 Live security header baseline (all present)
HSTS preload · CSP hash-allowlist · nosniff · XFO DENY · Referrer-Policy strict-origin ·
Permissions-Policy minimal · frame-ancestors none

## 3. TRUTH CHANGES — claims registry (draft)

| Claim (current public wording) | Status | Evidence | Verdict |
|---|---|---|---|
| "3 Projekte dokumentiert" | verified | 3 markdown files | ✅ keep |
| "4 Artikel veröffentlicht" | verified | 4 posts | ✅ keep |
| "5 Wissens-Seiten" | verified | 5 knowledge | ✅ keep |
| **"100% Datenschutz-konform (DSGVO)"** | **needs-verification** | no legal review | ⚠️ **REMOVE/reword** — absolute legal claim, directive §10 forbids |
| "Dokumentiert · Getestet · Datenschutz-konform" | needs-verification | partially true | ⚠️ soften |
| "Offen für neue Projekte" | owner-confirmed | — | ⚠️ reword to "Projektanfragen / Zusammenarbeit prüfen" (pre-registration precision, per Codex) |
| Project statuses (titan-os/search/shield) | needs-verification | private systems | ⚠️ add lifecycle labels (concept/prototype/in-progress) |
| ShieldStrip "online" | verified | live status file | ✅ keep (honest operational signal) |
| IOM/DRC/MSF background | **needs-verification** | no dates/roles/links on site | ⚠️ verify against CV before publishing |
| "42 results/query" type metrics | **needs-verification** | uncheckable | ⚠️ remove or date-stamp with evidence |

## 4. SECURITY / PRIVACY CHANGES
- **None made** (Phase 0 = read-only).
- Assessment: current posture is strong (CSP, HSTS, non-root container, rate-limited
  contact, hashed IPs, no analytics, no cookies). Gaps vs directive: www→apex canonical
  missing; contact delivery target unconfirmed (message routing); no retention/deletion
  mechanism documented; log redaction of form content unverified.

## 5. REMAINING GAPS — owner inputs required (placeholders marked OWNER INPUT REQUIRED)
1. [ ] Professional headshot — **OWNER INPUT REQUIRED**
2. [ ] Latest verified CV (HTML/print/PDF source) — **OWNER INPUT REQUIRED**
3. [ ] Verified GitHub URL (personal account) — **OWNER INPUT REQUIRED**
4. [ ] Verified LinkedIn URL — **OWNER INPUT REQUIRED**
5. [ ] Preferred professional contact email — **OWNER INPUT REQUIRED**
6. [ ] Public-safe role history + dates (IOM/DRC/MSF, degrees) — **OWNER INPUT REQUIRED**
7. [ ] Approved B1 wording/certificate status — **OWNER INPUT REQUIRED**
8. [ ] Legal address solution for Impressum (qualified advice; never home address without approval) — **OWNER INPUT REQUIRED**
9. [ ] Screenshots/demos owned by Robiul, publishable — **OWNER INPUT REQUIRED**
10. [ ] Public-safe repo(s) for case studies — **OWNER INPUT REQUIRED**
11. [ ] EN/DE: English as source language, German human-reviewed — **OWNER DECISION**

## 6. RISK — severity-ranked remediation backlog
| Sev | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| HIGH | Impressum placeholders live = legal exposure (DDG §5) | certain | legal | Fill after owner address decision (Phase 1/2) |
| HIGH | "100% DSGVO-konform" absolute claim | certain | credibility/legal | Reword immediately (Phase 1 slice) |
| MED | Contact form delivery target unconfirmed | likely | lost inquiries | Confirm delivery + retention (Phase 3) |
| MED | www canonical missing | likely | SEO split | Add www→apex redirect (Phase 2) |
| MED | No CV/verified links = recruiters can't act | likely | conversion loss | Owner inputs → Phase 2 |
| MED | All components client-side | certain | perf | Server-component refactor (Phase 2) |
| LOW | No og:image/icon | certain | sharing | Add metadata files (Phase 2) |
| LOW | Lab demos public (AI ask) | certain | trust risk | **Defer/remove per user directive** |

## 7. NEXT ACTION — smallest useful next phase
**Phase 1 (IA + content system)** — but gated on: (a) truth-registry rework of homepage
claims (remove "100% DSGVO", soften "Datenschutz-konform", reword CTA), (b) EN/DE route
scaffold with hreflang, (c) typed Project/Fact schemas with build-time validation. Phase 1
can start with the claims fix + schema scaffolding WITHOUT waiting for owner inputs (those
block content, not structure).

## 8. APPROVAL REQUIRED — exact irreversible/public/external actions
1. **Approve the truth-registry rewording** (remove "100% DSGVO", soften claims, reword
   "Offen für neue Projekte" → "Projektanfragen") — public wording change.
2. **Approve EN as source language** with German human-reviewed (directive default, confirm).
3. **Approve www→apex canonical** (DNS/Caddy change — only with rollback plan).
4. **Do NOT** yet: publish photo, CV, address, connect contact email, analytics, DNS,
   replace live site — all pending owner inputs + explicit approval.
5. **Directive conflict noted:** §4.1 says EN first with `/en` routes; current site is
   German-only at root. Phase 1 must decide: root = `/de` redirect or keep `/` German with
   `/en` added (owner decision — see item 11 above).

---

**Phase 0 exit gate:** ✅ authoritative project + facts known; no destructive ambiguity;
no production changes made. Ready for Phase 1 on approval.
