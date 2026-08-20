# PHASE 0 — EVIDENCE & BASELINE AUDIT

**Directive:** ROBIUL PORTFOLIO — MASTER IMPLEMENTATION DIRECTIVE v1.0 (§13, Phase 0)
**Audit date:** 2026-08-20
**Repository:** `robiul-hasan-dev/robiulhasan.de`
**Audited commit:** `d5bc827d1199de0b51e4f5da6f7e0f7befe3911c`
**Production changes made:** none. No DNS, TLS, hosting, analytics, external service,
deletion, or public content was touched. The working tree was clean before and after.

> **Supersedes, does not replace,** `docs/PHASE0_REPORT.md` (2026-08-17). That report was
> written before slices 1–3 landed and its deployment figures could not be re-verified from
> this environment (see §1.4). It is left in place per directive §1.1 (preserve prior work).

---

## 1. REPOSITORY AND RUNTIME EVIDENCE

### 1.1 Repository

| Item | Value | How verified |
|---|---|---|
| Working path | `/home/user/robiulhasan.de` | `pwd` |
| Remote | `https://github.com/robiul-hasan-dev/robiulhasan.de` | `git remote -v` |
| Branch | `claude/portfolio-phase-0-audit-exofwh` | `git branch` |
| HEAD | `d5bc827` — "slice3 … work index + case-study template" | `git log` |
| Branch vs `main` | **identical** (0 ahead / 0 behind) | `git rev-list --left-right --count main...HEAD` |
| Remote branches | `main` only — **no other branch, no tags** | `git ls-remote`, GitHub API |
| Branch protection | **none** on `main` | GitHub API (`protected: false`) |
| CI workflows | **zero** | GitHub Actions API (`total_count: 0`) |
| Working tree | clean, 0 uncommitted files | `git status --porcelain` |
| Commit history | 21 commits, all authored by "Hermes Agent", first = `c7d3087` *"Initial commit from Create Next App"* (2026-08-04) | `git log --reverse` |
| Tracked files | 81 | `git ls-files \| wc -l` |
| Secrets in tracked files | none found | pattern scan over tracked files + history blobs |
| `.env` files | none tracked, none on disk | `git ls-files`, `ls` |

**This is the authoritative portfolio repository.** No competing project was created.

### 1.2 Runtime / stack

| Item | Value |
|---|---|
| Framework | Next.js **16.3.0** (App Router, Turbopack) |
| React | 19.2.8 · TypeScript ^5 · Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Node (image) | `node:22-alpine`; local audit used Node 22.22.2 |
| Output mode | `output: 'standalone'`, `trailingSlash: true`, `poweredByHeader: false` |
| Content | 3 projects · 4 posts · 5 knowledge nodes (local markdown + `gray-matter`) |
| Truth registry | `content/facts.yaml` (26 entries) validated by Zod (`lib/schema.ts`, `lib/facts.ts`) |
| Container | Multi-stage Dockerfile, non-root `nextjs` user, standalone runtime |
| Headers set by app | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| CSP / HSTS | **not set by the app** — delegated to Caddy outside this repo |

### 1.3 Build / quality gates (run locally on the audited commit)

| Gate | Result |
|---|---|
| `npm ci` | ✅ 501 packages, lockfile intact |
| `npx tsc --noEmit` | ✅ pass, 0 errors |
| `npx next build` | ✅ pass — 29 static pages generated |
| `npx eslint .` | ❌ **FAIL — 4 errors** (`Hero3D.tsx` ×3, `ThemeToggle.tsx` ×1) |
| `npm audit` | ✅ 0 vulnerabilities (info/low/moderate/high/critical all 0) |
| Secret scan | ✅ clean |

### 1.4 Deployment — WHAT COULD NOT BE VERIFIED

**This environment's network policy blocks `robiulhasan.de`.** The agent proxy answered
`403` to `CONNECT robiulhasan.de:443` (confirmed in `$HTTPS_PROXY/__agentproxy/status` →
`recentRelayFailures: connect_rejected`). Therefore **no claim in this report about the live
production site is first-hand.** The following remain **unverified** and must be re-checked
on the VPS before any Phase 5 release:

- live HTTP status, TTFB, TLS/HSTS, the enforced CSP, `www` → apex canonical behaviour;
- container health, restart policy, log rotation, backups, rollback images;
- whether `/lab/api/search` and `/lab/api/ask` are reachable, rate-limited and what they log;
- whether contact messages in `contact_messages` are read, retained or deleted;
- whether `public/data/shield.json` is regenerated on the server.

All measurements in §5–§6 below come from a **local production build of `d5bc827`**
(`next build` → standalone server on `127.0.0.1:3111`), which is representative of the
application but not of the network path, proxy, or host.

**Documentation-vs-reality conflict:** `MIGRATION-NOTES.md` states the GitHub repo holds
"18 Astro commits (untouched)" and that the Astro site is preserved as the rollback target.
The remote has **one branch, no tags, and no Astro history** — the first commit is a fresh
`create-next-app`. The documented rollback path cannot be confirmed from Git and may exist
only on the VPS (`/srv/site`, `/root/robiulhasan.de`), which is outside this session.

---

## 2. CURRENT ARCHITECTURE MAP

### 2.1 Routes (15 pages + 3 generated files, all German, no locale prefix)

```
/                     home (hero, proof counters, AI demo, work, posts, contact)
/about/               Über mich — biography, skills, languages
/projects/            work index (status badges)
/projects/[slug]/     case study — titan-os, titan-search, titan-shield
/blog/                article index
/blog/[slug]/         4 articles
/knowledge/           knowledge index
/knowledge/[slug]/    5 knowledge nodes
/lab/                 lab index
/lab/titan-search/    live search demo  → calls /lab/api/search
/lab/ask-titan/       live RAG demo     → calls /lab/api/ask
/impressum/           legal
/datenschutz/         privacy
/docs/adr/            17 architecture decision records
+ /robots.txt  /sitemap.xml  /rss.xml  /favicon.ico  /not-found (custom 404)
```

**Missing vs directive §4:** `/en/*` and `/de/*` locale routes, `/experience`, `/cv`,
`/contact` (contact is only a homepage section), breadcrumbs.

### 2.2 Server / client boundary

| Layer | Server Components | Client Components |
|---|---|---|
| Pages | 12 of 14 | `lab/titan-search`, `lab/ask-titan` |
| Components | `Hero`, `SiteHeader`, `SiteFooter`, `LocaleSwitcher`, `StatusBadge`, `SiteNav`(dead) | `AIDemo`, `ContactForm`, `CountUp`, `MobileNav`, `Reveal`, `ShieldStrip`, `ThemeToggle`, `Hero3D`(dead) |

The "everything is a Client Component" violation from the 2026-08-17 report **has been
largely fixed**. Remaining discretionary client JS on the homepage: `Reveal`, `CountUp`,
`AIDemo`.

### 2.3 Content and truth pipeline

```
content/facts.yaml ──▶ lib/facts.ts ──▶ lib/schema.ts (Zod)
                            │              needs-verification/private ⇒ publicWording MUST be null
                            ▼
          Hero (positioning + counts) · /projects (descriptions, lifecycle) · /projects/[slug]

content/projects/*.md ──▶ lib/content.getProjects() ──▶ parseProject() ✅ build fails on bad front matter
content/posts/*.md     ──▶ loadCollection()          ──▶ ❌ NO schema, NO truth gate
content/knowledge/*.md ──▶ loadCollection()          ──▶ ❌ NO schema, NO truth gate
```

**The truth gate covers 3 project records. It does not cover the 4 posts and 5 knowledge
nodes — which is where the disallowed metrics still live (F7).**

### 2.4 Data flows leaving the browser

| Flow | Destination | In this repo? |
|---|---|---|
| Contact form (name, email, message) | Server Action → PostgreSQL `titan_public.contact_messages` + SHA-256 IP hash | Yes (`src/app/actions/contact.ts`) |
| Lab search query | `GET /lab/api/search?q=…` → Caddy → FastAPI → SearXNG | **No** — service outside repo |
| Lab RAG question | `GET /lab/api/ask?q=…` → Caddy → RAG service | **No** — service outside repo |
| Status heartbeat | `GET /data/shield.json` (same origin) | Yes |
| Fonts | self-hosted (11 × woff2 in `_next/static/media`) | Yes |

**Verified privacy positives (local build):** zero third-party requests across
`/ /about/ /projects/ /lab/ /blog/`; zero cookies; `localStorage` empty until the visitor
toggles the theme; no analytics, no embeds, no tracker.

---

## 3. TRUTH REGISTRY — DRAFT DELTA

`content/facts.yaml` already exists and is well-formed. **It was NOT edited in Phase 0.**
Below is the proposed delta for Phase 1, plus registry defects found in the registry itself.

### 3.1 Claims currently published that the registry says must NOT be published

| # | Public wording (live) | Where | Registry entry | Required action |
|---|---|---|---|---|
| T1 | "…dokumentiert, getestet und **DSGVO-konform**" | `AIDemo.tsx` answer 1 (ships in homepage JS) | `dsgvo-100-percent` / `datenschutz-konform-badge` = needs-verification | Remove the compliance claim |
| T2 | "Stationen bei **IOM, DRC und MSF**, heute in München" | `AIDemo.tsx` answer 4 | `humanitarian-background` = needs-verification | Withhold until CV-verified |
| T3 | "humanitäre Arbeit bei **IOM**, **DRC** und **MSF**" | `/about/` | same | Withhold until CV-verified |
| T4 | "**Informatik-Abschluss** (Bangladesch)" | `/about/` | `degree-status` = needs-verification | Withhold / confirm wording |
| T5 | "Deutsch — **B1 (DTZ-Prüfung Juli 2026)**" | `/about/` | `german-b1` = needs-verification | Withhold / confirm wording |
| T6 | `sameAs: linkedin.com/in/robiulhasan`, `github.com/robiulhasan` | `layout.tsx` JSON-LD | `github-url`, `linkedin-url` = needs-verification (note already says "remove in the SEO slice") | Remove until owner confirms |
| T7 | `jobTitle: "Software & AI Engineer"`, `<title>Robiul Hasan — Software & AI Engineer` | `layout.tsx` | contradicts `core-positioning` (§2.3 forbids this framing) | Re-title per positioning |
| T8 | "**42 Ergebnisse pro Anfrage**", "**0 CAPTCHAs**", "**24/7 unbegrenzt**" | `content/knowledge/self-hosted-beats-workarounds.md`, `content/posts/warum-ich-meine-eigene-suchmaschine-gebaut-habe.md` | `uncheckable-metrics`, `project-titan-search` = needs-verification | Remove or date-stamp with reproducible evidence |
| T9 | "Die Behauptung wurde **in Produktion getestet**" | `content/knowledge/self-hosted-beats-workarounds.md` | `project-titan-search` lifecycle = **prototype** | Reclassify — "Produktion" is reserved for verified deployment |
| T10 | "Ich melde mich in der Regel **innerhalb von 48 Stunden**" | `page.tsx` + contact success message | no registry entry | Add as `owner-confirmed` or remove the commitment |
| T11 | "Keine Daten bei Dritten … vs. **DB-Formular**" (ADR-008) | `/docs/adr/` | contradicts the implemented DB form | Correct the ADR |
| T12 | "**WCAG-Kontrast in beiden Themes**" (ADR-014) | `/docs/adr/` | contradicted by measured failures (§6.1) | Correct or remove |
| T13 | Skill self-ratings "**4/5**" presented under the heading "Fähigkeiten mit **Evidenz**" | `/about/` | no registry entry; the "evidence" strings are descriptions, not evidence | Reframe: drop numeric levels or link real artifacts |
| T14 | "Site-Suche: **Pagefind** ✅ Adopted" (ADR-006) | `/docs/adr/` | no Pagefind in the codebase | Correct the ADR |
| T15 | "Static Site Generator: **Astro** ✅ Adopted" (ADR-001) vs ADR-017 "Next.js ersetzt Astro" | `/docs/adr/` | self-contradictory on a public page | Mark ADR-001 superseded |

### 3.2 Defects inside the truth registry itself

| # | Entry | Problem |
|---|---|---|
| T16 | `core-positioning` | `status: owner-confirmed` but `evidence: "Directive §2.3 recommended position; **confirm with Robiul**"`. A directive recommendation is not owner confirmation — this is status inflation, and it is what the H1 renders today. |
| T17 | `open-for-work` | `status: owner-confirmed` but `evidence: "OWNER INPUT REQUIRED"`. Same problem; it is published in the homepage availability strip. |
| T18 | `projects-documented` / `posts-published` / `knowledge-pages` | Verified counts, but the homepage hardcodes `<CountUp end={3|4|5}>` instead of deriving them from the loaded content — the numbers will silently become false the moment a file is added. |
| T19 | `shield-status-online` | Marked `verified`, but the committed `shield.json` is dated 2026-08-04 and the freshness window is 90 minutes, so any build from this repo renders the **warning** state (§6.1 F22). |

### 3.3 Registry entries correctly withheld (no action needed)

`impressum-address`, `contact-email`, `headshot`, `cv-download`, `project-uni-brew-os`,
`project-governed-ai-workspace`, `project-german-learning-companion`, `project-titan-*`
— all `needs-verification` with `publicWording: null`. The `/projects/` index correctly
renders "Öffentliche Beschreibung in Prüfung" rather than falling back to raw markdown.

---

## 4. MISSING-OWNER-INPUT CHECKLIST

Nothing below may be invented. Every item is a hard blocker for the content it gates.

**Identity and evidence**
- [ ] Professional headshot + alternate crop (real photography only) — gates: about, hero
- [ ] Latest verified CV (source document) — gates: `/cv`, print view, PDF
- [ ] Verified GitHub profile URL — gates: JSON-LD `sameAs`, footer, case studies
- [ ] Verified LinkedIn profile URL — gates: JSON-LD `sameAs`, footer
- [ ] Preferred professional contact email (confirm `hello@robiulhasan.de` is correct and intended for publication)
- [ ] Public-safe role history: organisations, exact titles, start/end dates, verifiable against CV/contracts/certificates — gates: T2, T3, experience timeline
- [ ] Degree: exact wording, institution, status, year — gates: T4
- [ ] German level: approved wording and certificate status — gates: T5
- [ ] Publishable screenshots / demo recordings Robiul owns — gates: every "Prototyp & Demo" section (all three currently say "kein veröffentlichungsreifer Prototyp verfügbar")
- [ ] Public-safe repository URLs for the three projects — gates: `repositoryUrl`

**Legal and contact**
- [ ] Lawful Impressum address solution (DDG §5) — **never the home address without informed approval**
- [ ] Confirmation of the hosting provider's real legal name for the privacy policy (the current text names "Hosting-Provider Online GmbH, Nürnberg", which does not match the Hetzner VPS described elsewhere — see F1c)
- [ ] Retention period for contact messages, and who deletes them
- [ ] Whether contact messages should also be delivered by email, and to which address
- [ ] Response-time commitment: keep "48 Stunden" or remove (T10)

**Decisions**
- [ ] Root-locale decision: `/` → `/de` redirect, or keep `/` German and add `/en`
- [ ] Confirm EN as source language with human-reviewed DE (directive default)
- [ ] Confirm the `core-positioning` sentence verbatim (T16) — it is the site's H1
- [ ] Confirm availability wording (T17)
- [ ] Keep or retire the `/lab/*` live demos (they are the site's only third-party-facing data flow)
- [ ] Keep or retire the public `/docs/adr/` page (infrastructure disclosure — F21)
- [ ] Uni Brew OS / Governed AI Workspace / German Learning Companion: are these to replace or join the three Titan projects? The directive names them; the site does not contain them.

---

## 5. CURRENT SCREENSHOT / DEVICE MATRIX

60 screenshots captured from the local production build of `d5bc827` (Chromium 1194 via
Playwright), both themes, full-page. Stored in the session scratchpad at
`…/scratchpad/shots/` as `{theme}__{viewport}__{page}.png`.

| Viewport | Pages captured | Dark | Light | Horizontal-scroll at that width |
|---|---|---|---|---|
| 320 × 568 (smallest supported) | home, about, projects, project-detail | ✅ | ✅ | ❌ **all pages overflow** (324 px; project detail 387 px) |
| 375 × 812 (mobile) | + lab, impressum, datenschutz, 404 | ✅ | ✅ | ❌ project detail 387 px |
| 768 × 1024 (tablet) | home, about, projects, project-detail | ✅ | ✅ | ✅ none |
| 1280 × 800 (laptop) | all 8 | ✅ | ✅ | ✅ none |
| 1440 × 900 (desktop) | home, about, projects, project-detail | ✅ | ✅ | ✅ none |

Additional targeted captures: `HERO-dark.png`, `HERO-light.png`, `CTA-dark.png`,
`CTA-light.png` (evidence for F8).

**What the screenshots show, in both themes:**
1. The primary CTA "Projekte ansehen" is lime text on a lime fill — effectively unreadable.
2. Every link that should be un-underlined (nav, card titles, card body, footer) is underlined.
3. The proof counters read **0 / 0 / 0** until client JS runs and the section is scrolled into view.
4. The footer shows "Status derzeit nicht verfügbar" in the warning colour on every page.
5. The hero mixes an English headline with a German support line and German buttons.

---

## 6. BASELINE — ACCESSIBILITY, PERFORMANCE, SEO, SECURITY

### 6.1 Accessibility (target: WCAG 2.2 AA)

**Automated — axe-core 4.x, 13 routes × 2 themes = 26 scans, tags wcag2a/aa, wcag21a/aa, wcag22aa, best-practice:**

- **4 violations, all `color-contrast` (serious). 0 critical. 0 other rule failures.**

| Route / theme | Element | Measured | Required |
|---|---|---|---|
| `/` dark | primary CTA "Projekte ansehen" | **1.16 : 1** (`#c7f24e` on `#a3e635`) | 4.5 : 1 |
| `/` light | primary CTA | **1.41 : 1** (`#3f6212` on `#4d7c0f`) | 4.5 : 1 |
| `/impressum/` light | legal warning box | 4.37 : 1 (`#b45309` on `#f2efe7`) | 4.5 : 1 |
| `/datenschutz/` light | legal warning box | 4.37 : 1 | 4.5 : 1 |

**Root cause of the CTA failure:** `src/app/globals.css` declares `a { color: var(--accent-strong); text-decoration: underline }` **outside any cascade layer**. Tailwind v4 emits utilities inside `@layer utilities`, and unlayered rules win over layered ones — so `text-[var(--on-accent)]` and `no-underline` are defeated on every `<a>`. This single bug produces both F8 (invisible CTA) and F9 (site-wide underlines).

**Manual checks performed:**

| Check | Result |
|---|---|
| Skip link | ✅ present, first in tab order, visible on focus ("Zum Inhalt springen") |
| Landmarks | ✅ `header` / `nav[aria-label]` / `main#main` / `footer` |
| Heading order | ✅ no skipped levels on any audited page |
| Tab order | ✅ logical: skip → brand → 6 nav links → theme → hero CTAs → content |
| Focus visibility | ✅ `:focus-visible { outline: 2px solid var(--accent) }`, not obscured by the header |
| Mobile menu | ✅ `aria-expanded`, `aria-controls`, Escape closes, closes on navigation |
| Form labels/errors | ✅ every field labelled; errors `role="alert"`; status `role="status"` |
| Reduced motion | ✅ honoured in CSS and in `Reveal`, `CountUp`, `AIDemo` |
| Reflow at 320 px (1.4.10) | ❌ **FAIL** — header controls overflow by 4 px on **every page**; `/projects/[slug]` reaches 387 px (long compound heading "Multi-Agent-Automationssystem" does not wrap) — also fails at 375 px |
| Language of parts (3.1.2) | ❌ **FAIL** — the English hero sits inside `<html lang="de">` with no `lang="en"`; only one `lang` attribute exists in the whole document |
| Content without JS | ❌ **FAIL** — 6 `.titan-reveal` wrappers stay at `opacity: 0`; everything below the hero is invisible if JS is blocked or fails |
| Target size (2.5.8) | ⚠️ nav links are 16 px tall; likely saved by the spacing exception (≈60 px between centres) — **needs manual confirmation**, not automatically passed |
| Screen-reader smoke test | ⛔ **not performed** — no screen reader available in this environment. Required before any AA claim. |

### 6.2 Performance (local lab baseline — not field data)

Local standalone build, Chromium, `PerformanceObserver`. Two profiles: mobile 375 px with
4× CPU throttling + Slow-4G network emulation, and desktop 1280 px unthrottled.

| Route | LCP (mobile) | LCP (desktop) | CLS | TBT (mobile) | Transfer |
|---|---|---|---|---|---|
| `/` | 816 ms | 168 ms | 0 | 351 ms | ≈89 KB |
| `/about/` | 784 ms | 148 ms | 0 | 249 ms | ≈89 KB |
| `/projects/` | 768 ms | 148 ms | 0 | 261 ms | ≈89 KB |
| `/projects/titan-os/` | 772 ms | 140 ms | 0 | 277 ms | ≈89 KB |

- **Lab INP proxy** (worst event duration, mobile 4× CPU, exercising theme toggle, mobile menu and the AI-demo buttons): **104 ms**.
- HTML weight: home 46.5 KB, about 32.7 KB, projects 26.3 KB, 404 19.2 KB (uncompressed).
- Client JS built: 591.8 KB uncompressed across all routes; 3 chunks dominate (223.7 / 160.5 / 110.0 KB).
- Fonts: 11 × woff2 **self-hosted** via `next/font` — no Google Fonts request at runtime.
- Server TTFB on localhost: 6–22 ms (says nothing about production).

**Verdict:** LCP and CLS are comfortably inside the "good" thresholds in the lab; INP proxy
is inside 200 ms. TBT ≈350 ms on throttled mobile is the one number worth reducing, and it
comes from hydrating `Reveal` + `CountUp` + `AIDemo` on the homepage. **These are lab
numbers on localhost — they are not a Core Web Vitals pass.** A production lab run and, later,
field data are still required.

### 6.3 SEO / discoverability

| Item | Status |
|---|---|
| Unique `<title>` per route | ✅ via template `%s · Robiul Hasan` |
| Meta description | ⚠️ site-wide only; per-route descriptions only on project/blog/knowledge detail |
| **Canonical URL** | ❌ **absent on every page** |
| **hreflang / x-default** | ❌ absent (no EN routes exist) |
| **og:image** | ❌ absent — `twitter:card: summary` with no image |
| Open Graph basics | ✅ `og:title`, `og:description`, `og:site_name`, `og:locale: de_DE`, `og:type` |
| Icon | ✅ `/favicon.ico` (256×256) |
| Web manifest | ❌ absent |
| `robots.txt` | ✅ allows `/`, disallows `/api/` (route does not exist) and `/lab/api/` |
| `sitemap.xml` | ⚠️ 18 URLs, but no `lastModified`, no alternate-language links, and the homepage is listed as `https://robiulhasan.de` without the trailing slash while `trailingSlash: true` is configured |
| JSON-LD | ⚠️ `Person` + `WebSite` present and well-formed, but `sameAs` contains **unverified** profile URLs and `jobTitle` contradicts the approved positioning (T6, T7) |
| Breadcrumbs / `BreadcrumbList` | ❌ absent on case studies |
| RSS | ✅ `/rss.xml`, 4 items, XML-escaped |
| Custom 404 | ✅ German, links home |

### 6.4 Security and privacy

**Verified in code / local runtime:**

| Control | Status |
|---|---|
| Server-side validation | ✅ Zod on every contact field, with length caps (name 120, email 254, message 4000) |
| SQL injection | ✅ parameterised queries only |
| Rate limiting | ✅ 3 submissions / 10 min per IP hash, DB-backed (survives restart) |
| Honeypot | ✅ `website` field, silently accepted |
| Markdown XSS | ✅ `rehype-sanitize` allowlist; raw HTML, `javascript:` URLs and handlers stripped |
| Error handling | ✅ generic client errors; log line carries only a 120-char error message, never the message body or IP |
| Non-root container | ✅ `USER nextjs` (uid 1001) |
| Secrets | ✅ none in source, bundles, images or history; DB password from `TITAN_PUBLIC_PASS` env |
| Dependency audit | ✅ 0 known vulnerabilities |
| Docker build context | ✅ `.dockerignore` excludes `.git`, `.env*`, keys |
| Third-party requests | ✅ none |
| Cookies | ✅ none set |
| Response headers (app) | ✅ nosniff, XFO DENY, Referrer-Policy, Permissions-Policy |
| CSP / HSTS | ⚠️ delegated to Caddy — **not verifiable here** |
| CSRF | ⚠️ relies on Next.js Server Action origin checks — not independently assessed |

**Gaps found:**

- **No privacy notice at the point of collection.** The contact form asks for name, email and
  a free-text message with no purpose, legal basis, retention, recipient or rights
  information and no link to `/datenschutz/` before submission.
- **The privacy policy does not describe the contact form at all.** It covers server logs,
  hosting, cookies, "Suchfunktion" and a conditional "KI-Dienste" paragraph — the actual
  processing (name + email + message + hashed IP, stored indefinitely in PostgreSQL) is absent.
- **The privacy policy contains a statement that is false for the site as built:** §5 says
  the search runs "vollständig im Browser" and that "keine Suchanfragen an einen Server
  gesendet" werden. `/lab/titan-search/` and `/lab/ask-titan/` send the visitor's query
  string to `/lab/api/*`, which reaches SearXNG and a RAG service, and onward to external
  search engines. Recipients are not disclosed.
- **No retention or deletion mechanism** for `contact_messages` exists anywhere in the repo.
- **Unsalted IP hash.** `sha256(ip)` over the IPv4 space is trivially reversible by brute
  force, so "no raw IP, GDPR-friendly" overstates the protection. Use a keyed hash (HMAC with
  a server secret) plus a short retention window.
- **No timing check and no duplicate-submission prevention** (directive P0 asks for honeypot
  **plus** timing **plus** rate limiting; only two of three exist).
- **No CI gate.** Zero workflows; `.github/` is listed in `.gitignore`, which would silently
  prevent a workflow from ever being committed. `main` is unprotected. `npm run lint` fails today.
- **CSP is generated outside this repository.** `scripts/generate-csp-hashes.mjs` is orphaned
  (nothing in `package.json` calls it, and `next.config.ts` no longer reads its output);
  `scripts/update-csp-live.py` edits `/opt/portfolio-site/Caddyfile` on the host. A hash
  mismatch after a deploy would block the inline theme script and Next's hydration scripts —
  and because of the JS-dependent reveal (F11), that failure mode blanks the homepage.
- **Public infrastructure disclosure.** `/docs/adr/` publicly states: DNS-only with no CDN in
  front of the origin, a single self-hosted server for everything, Caddy as the proxy,
  SearXNG bound internally, and a planned GitHub-Actions deploy with a pending CI token.

---

## 7. SEVERITY-RANKED FINDINGS

Severity = (legal/truth exposure) × (certainty it is live) × (blast radius).
Every finding below was reproduced on commit `d5bc827`.

### S1 — Critical (legal / truth protocol; live)

| ID | Finding | Evidence |
|---|---|---|
| **F1a** | Privacy policy omits the contact form entirely — name, email, message and a hashed IP are stored in PostgreSQL with no stated purpose, legal basis, recipients, retention or rights. No notice at the point of collection either. | `src/app/datenschutz/page.tsx`, `src/app/actions/contact.ts:132` |
| **F1b** | Privacy policy §5 asserts no search query ever leaves the browser. Two live pages send visitor queries to server APIs and onward to external engines. | `datenschutz/page.tsx:47-51` vs `lab/titan-search/page.tsx:32`, `lab/ask-titan/page.tsx:36` |
| **F1c** | Privacy policy names "Hosting-Provider Online GmbH, Nürnberg" as the host. This does not match the Hetzner VPS described in `MIGRATION-NOTES.md`/`docs/PHASE0_REPORT.md` and reads as unreplaced template text — an inaccurate processor statement in a legal document. | `datenschutz/page.tsx:33-38` |
| **F2** | Impressum ships with `[Adresse wird ergänzt]` / `[Adresse]` placeholders on the live legal page (DDG §5). | `impressum/page.tsx:12,25` |
| **F3** | Forbidden absolute compliance claim still shipping: "dokumentiert, getestet und **DSGVO-konform**" is bundled into the homepage JS and rendered on click. | `AIDemo.tsx:20`; string confirmed in `.next/static/chunks/3qur5251a6kvt.js` |
| **F4** | Unverified employer/organisation claims published: IOM, DRC, MSF on `/about/` (server-rendered) and in the homepage AI demo — the registry classifies these `needs-verification` with `publicWording: null`. Degree and B1/DTZ have the same problem. | `about/page.tsx:25-27,67`; `AIDemo.tsx:32`; `content/facts.yaml` |
| **F5** | JSON-LD publishes unverified identity URLs (`linkedin.com/in/robiulhasan`, `github.com/robiulhasan`) and a `jobTitle` the positioning correction forbids. Structured data must be accurate. The registry itself flags these for removal. | `layout.tsx:50,57-60` |

### S2 — High (truth / accessibility / core UX; live)

| ID | Finding | Evidence |
|---|---|---|
| **F6** | The knowledge and blog collections bypass the truth gate entirely — no schema, no registry link — so the disallowed metrics are still published there while the project pages say the same numbers are unevidenced. | `lib/content.ts` `loadCollection()` vs `getProjects()` |
| **F7** | "42 Ergebnisse pro Anfrage", "0 CAPTCHAs", "24/7 unbegrenzt", "in Produktion getestet" published as Tier-A verified evidence. | `content/knowledge/self-hosted-beats-workarounds.md:6,7,22`; `content/posts/warum-ich-meine-eigene-suchmaschine-gebaut-habe.md:38,47` |
| **F8** | Primary CTA is invisible: 1.16 : 1 (dark) / 1.41 : 1 (light). The site's main conversion control cannot be read. | axe `color-contrast`; `HERO-dark.png`, `HERO-light.png` |
| **F9** | Site-wide underline defect — `no-underline` is defeated on every `<a>`, so nav links, card titles and whole card paragraphs render underlined. | computed styles; `light__1280x800-laptop__projects.png` |
| **F10** | Homepage proof numbers are served as **0** — "0 Projekte dokumentiert / 0 Artikel veröffentlicht / 0 Wissens-Seiten" is what crawlers, reader modes and no-JS visitors receive. | `curl` of `/` → three `titan-counter` blocks containing `0` |
| **F11** | Without JS, six homepage sections stay at `opacity: 0` — everything below the hero is invisible. No `<noscript>` fallback. | Playwright `javaScriptEnabled:false` → all 6 reveals opacity 0 |
| **F12** | WCAG 2.2 AA 1.4.10 reflow failure: horizontal scroll at 320 px on every page (324 px), and 387 px on project detail pages at both 320 px and 375 px. | measured `scrollWidth` vs `clientWidth`, both themes |
| **F13** | WCAG 2.2 AA 3.1.2 failure: English H1 and hero inside `<html lang="de">` with no `lang="en"`. Also a content-coherence problem — English headline, German support line and German buttons in one hero. | rendered markup; `HERO-*.png` |
| **F14** | The public ADR page contradicts the implementation and itself: ADR-008 claims the DB form was rejected ("vs. DB-Formular", "Keine Daten bei Dritten") while the form is a DB form; ADR-006 adopts Pagefind, which is not in the codebase; ADR-001 adopts Astro while ADR-017 replaces it; ADR-014 claims WCAG contrast in both themes, which is measurably false. | `docs/adr/page.tsx:3-19` |

### S3 — Medium

| ID | Finding |
|---|---|
| **F15** | Contact hardening gaps: no privacy notice before submission, no timing check, no duplicate-submission prevention, unsalted `sha256(ip)`, and a "48 Stunden" response promise with no registry entry. No notification path exists in the repo, so messages may be written and never read. |
| **F16** | The same project renders two different descriptions depending on route — `/projects/` honours the truth gate ("Öffentliche Beschreibung in Prüfung"), the homepage prints the raw markdown `summary`. The homepage bypasses the gate. |
| **F17** | SEO package incomplete: no canonical, no hreflang/x-default, no `og:image`, no manifest, no breadcrumbs; sitemap lacks `lastModified` and alternates and lists the homepage without its canonical trailing slash. |
| **F18** | No CI gate at all: zero workflows, `.github/` in `.gitignore`, `main` unprotected, and `npm run lint` currently fails with 4 errors. Nothing prevents a regression from reaching the deploy path. |
| **F19** | Dead and broken code: `Hero3D.tsx` is unreferenced, imports `three` — which is **not a declared dependency** (only `@types/three` is) — would fail the build if ever imported, and implements exactly the background particle system §6.1 forbids. `SiteNav.tsx` is a deprecated shim. Unused/misplaced deps: `nanoid`, `@react-three/fiber`, `@types/three`, `@types/pg` (types in `dependencies`). |
| **F20** | CSP correctness depends on a script outside the build (`generate-csp-hashes.mjs` is orphaned; `update-csp-live.py` rewrites the host Caddyfile). Hash drift silently breaks inline scripts, and combined with F11 that blanks the homepage. |
| **F21** | `/docs/adr/` publicly discloses the infrastructure posture (DNS-only/no CDN, one self-hosted server, Caddy, internal SearXNG, pending CI token) — against directive §1.2's rule on private infrastructure details. |
| **F22** | The footer status strip shows "Status derzeit nicht verfügbar" (warning colour) on every page for any build from this repo: the committed `shield.json` is from 2026-08-04 and the freshness window is 90 minutes. Regeneration depends on an out-of-repo cron. |
| **F23** | Truth-registry status inflation: `core-positioning` and `open-for-work` are marked `owner-confirmed` while their own evidence fields say "confirm with Robiul" / "OWNER INPUT REQUIRED". The H1 of the site rests on the first of these. |
| **F24** | `MIGRATION-NOTES.md` states 18 Astro commits are preserved untouched on GitHub; the remote has one branch, no tags, and no Astro history. The documented rollback path is unverifiable from Git. |
| **F25** | A PostgreSQL dependency in the public portfolio contradicts directive §7.1 (no database until a validated need). It exists solely to store contact messages, which a queue-free mail path could do without a database. |
| **F26** | Theme control has no "system" state — once toggled, `localStorage` pins the choice permanently. Directive P0 asks for dark/light/**system**. |

### S4 — Low

| ID | Finding |
|---|---|
| **F27** | Legal-page warning boxes measure 4.37 : 1 in the light theme (needs 4.5 : 1). |
| **F28** | Nav link hit areas are 16 px tall; the 2.5.8 spacing exception probably applies but has not been formally confirmed. |
| **F29** | No breadcrumb navigation or `BreadcrumbList` JSON-LD on case studies. |
| **F30** | Knowledge pages publish "Validierungsstufe Tier A" with no public definition of what a tier means. |
| **F31** | `README.md` is unmodified `create-next-app` boilerplate and tells a reader to deploy on Vercel. |
| **F32** | `robots.txt` disallows `/api/`, a path this application does not serve. |

---

## 8. REMEDIATION BACKLOG

Ordered for execution. "Gate" marks work that cannot start without an owner input or approval.

### Batch A — stop publishing what must not be published (Phase 1, no owner input needed)
1. Remove the "DSGVO-konform" sentence from `AIDemo` (F3).
2. Remove IOM/DRC/MSF, degree and B1 wording from `/about/` and `AIDemo`; replace with the honest withheld-state pattern already used on `/projects/` (F4). **Gate:** final wording needs owner input.
3. Delete the unverified `sameAs` URLs from JSON-LD; align `jobTitle`/`<title>` with `core-positioning` (F5, T7).
4. Remove or date-stamp "42 Ergebnisse", "0 CAPTCHAs", "24/7", "in Produktion getestet" in the knowledge/blog content (F7).
5. Correct ADR-001, ADR-006, ADR-008, ADR-014; decide whether `/docs/adr/` stays public at all (F14, F21). **Gate:** owner decision on publishing it.
6. Downgrade `core-positioning` and `open-for-work` to `needs-verification` until Robiul confirms them in writing — or get the confirmation first (F23, T16, T17).

### Batch B — fix what is measurably broken (Phase 2)
7. Move the base `a {}` rules into `@layer base` so Tailwind utilities win; re-test the CTA and every card (F8, F9). *One fix, two findings.*
8. Derive the proof counters from loaded content and render the real number server-side, with the count-up as progressive enhancement (F10, T18).
9. Make revealed sections visible by default and let JS only add the animation — no content behind `opacity: 0` (F11).
10. Fix reflow at 320 px: allow the header control cluster to shrink, and add `hyphens`/`overflow-wrap` to long compound headings (F12).
11. Add `lang="en"` to English passages; decide the hero language (F13). **Gate:** locale decision.
12. Raise the legal-page warning contrast (F27).
13. Delete `Hero3D.tsx` and `SiteNav.tsx`; drop `@react-three/fiber`, `@types/three`, `nanoid`; move `@types/pg` to `devDependencies`; make `npm run lint` pass (F19, F18).
14. Route the homepage project cards through the truth gate so both surfaces agree (F16).
15. Complete the SEO package: canonical, `og:image`, manifest, sitemap `lastModified`, breadcrumbs + `BreadcrumbList`, trailing-slash consistency; `hreflang` with the locale work (F17, F29).
16. Give the footer status strip an honest resting state that does not read as a warning when no heartbeat is present (F22).

### Batch C — contact, privacy and legal (Phase 3)
17. Rewrite `/datenschutz/` to describe the processing that actually happens: contact form (purpose, Art. 6 basis, recipients, retention, rights), lab search/RAG (query transmission, recipients, retention), server logs, hosting — with the real provider name (F1a, F1b, F1c). **Gate:** owner + qualified legal review.
18. Add an Art. 13 notice at the point of collection, linked to the policy (F1a, F15).
19. Implement retention: a scheduled deletion of `contact_messages` after the agreed window, and document it (F15). **Gate:** retention period.
20. Replace `sha256(ip)` with a keyed HMAC plus short retention; add a timing check and duplicate-submission prevention (F15).
21. Decide and implement message delivery/notification; confirm or drop the 48-hour promise (F15, T10). **Gate:** owner.
22. Fill the Impressum (F2). **Gate:** lawful address solution + legal review.
23. Bring CSP generation into the repository and into `npm run build`, with a documented, tested rollback (F20). **Gate:** touches the host — approval required.
24. Re-evaluate whether the PostgreSQL dependency is still needed once delivery is decided (F25).

### Batch D — gates and structure (parallel)
25. Add a CI workflow (build, typecheck, lint, axe, link check, Lighthouse budget) and remove `.github/` from `.gitignore`; protect `main` (F18).
26. Extend Zod validation to posts and knowledge nodes so every published claim passes the same gate as projects; make the build fail on an ungated claim (F6).
27. Reconcile `MIGRATION-NOTES.md` with the actual remote, and record where the Astro rollback really lives (F24).
28. Replace the `create-next-app` README with real operating instructions (F31).

---

## 9. RECOMMENDED PHASE 1 PLAN

**Objective (directive §13, Phase 1):** an EN/DE information architecture, typed content and
fact schemas, honest content drafts, and a lifecycle model — with every visible claim carrying
an evidence status. No visual redesign, no deployment.

**Sequence (each step is independently reviewable):**

| # | Step | Depends on |
|---|---|---|
| 1.1 | **Truth cleanup first.** Execute Batch A items 1, 3, 4 — the claims that need no owner input. Downgrade the two inflated registry entries. | none |
| 1.2 | **Extend the truth gate to all content.** Zod schemas for posts and knowledge nodes; every claim-bearing field linked to a `factId`; build fails on an unlinked claim. (Batch D #26 — this belongs in Phase 1 because it is what makes the rest enforceable.) | none |
| 1.3 | **Locale routing skeleton.** `/en/*` and `/de/*` with a real `LocaleSwitcher`, persistent locale, `hreflang` + `x-default`, and `/` redirecting per the owner's decision. German content moves to `/de/*` unchanged; English pages are created empty and are **not linked or indexed** until reviewed. | locale decision |
| 1.4 | **Case-study content model.** Extend the project schema to the full §4.2 template (discovery, decisions, validation, what failed, next step). The three Titan projects get honest drafts; the three directive projects (Uni Brew OS, Governed AI Workspace, German Learning Companion) get stub records marked `concept` with `OWNER INPUT REQUIRED`. | owner decision on project set |
| 1.5 | **Experience + CV content model.** Typed records, all `needs-verification` until the CV lands, so the routes exist but publish nothing invented. | CV, role history |
| 1.6 | **Content hierarchy / wireframes** for homepage, work index, case study, experience, about, CV, contact — as content outlines, not visual design. | 1.3–1.5 |
| 1.7 | **Owner review pass** — one document listing every string that would be publicly visible, with its evidence status, for line-by-line approval. | all |

**Explicitly out of scope for Phase 1:** the contrast/underline/reflow fixes (Phase 2), the
privacy rewrite and contact delivery (Phase 3), any host or DNS change (Phase 5).

**Recommended exception:** F8 (invisible CTA) and F9 (site-wide underlines) are a single
two-line CSS fix for a defect that makes the live site look broken. Fixing them during
Phase 1 rather than waiting for Phase 2 is defensible — but it is a change to the public
site and therefore needs approval (§10, A6).

**Phase 1 exit gate:** every visible claim has an evidence status; German wording is reviewed
or unpublished; no `needs-verification` claim renders anywhere.

---

## 10. APPROVALS REQUIRED FROM ROBIUL

Nothing below has been done. Each item is blocked pending an explicit decision.

| # | Approval | Why it is gated |
|---|---|---|
| **A1** | **Remove the live unverified claims** — IOM/DRC/MSF, degree, B1/DTZ, "DSGVO-konform", the GitHub/LinkedIn JSON-LD URLs, and the Titan metrics. | This changes public content. It is the directive's default, but it removes text you may want to restore with evidence. |
| **A2** | **Confirm or reject the positioning sentence** that is currently the site's H1: *"Operations-minded technologist building practical, human-controlled digital and AI systems from real-world problems."* | It is marked `owner-confirmed` in the registry but was never confirmed by you. Everything else hangs off it. |
| **A3** | **Confirm the availability wording** "Projektanfragen und Zusammenarbeit prüfen". | Same — marked confirmed, never confirmed. |
| **A4** | **Locale decision:** `/` redirects to `/de`, or `/` stays German and `/en` is added. And: English as source language with human-reviewed German? | Determines the route structure; expensive to change later. |
| **A5** | **Keep or retire `/lab/titan-search/` and `/lab/ask-titan/`.** | They are the only flow that sends visitor input off the page, and they are the reason the current privacy policy is inaccurate. |
| **A6** | **Permission to fix the invisible CTA and the underline defect now** (a CSS change to the live site) rather than waiting for Phase 2. | It is a public change, however small. |
| **A7** | **Keep or retire the public `/docs/adr/` page.** | It discloses your infrastructure posture and currently contains statements contradicted by the implementation. |
| **A8** | **Lawful Impressum address** and instruction to publish it. | Legal exposure either way. Never your home address without your informed approval, and this needs qualified German legal advice. |
| **A9** | **Contact processing decisions:** retention period, whether messages are emailed and to which address, whether the "48 hours" promise stands. | Determines the privacy rewrite and the deletion job. |
| **A10** | **Qualified legal/privacy review** of the rewritten `/datenschutz/` and `/impressum/` before publication. | Directive §9 — flagged as requiring legal review, not agent judgement. |
| **A11** | **Confirm the real hosting provider's legal name** for the privacy policy. | The current name appears to be unreplaced template text. |
| **A12** | **Publishing your photo, CV, personal email or phone number** — none is published today, and none will be without this. | Directive §1.3 hard gate. |
| **A13** | **Any host/DNS/TLS/CSP/`www` change**, including bringing CSP generation into the repo. | Directive §1.3 hard gate; needs a rollback plan. |
| **A14** | **Analytics, cookies, tracking or third-party embeds** — none exist today. | Directive §1.3 + §9.3; must not be enabled without legal review. |
| **A15** | **Project set decision:** do Uni Brew OS / Governed AI Workspace / German Learning Companion replace or join the three Titan projects? | The directive names three projects the site does not contain. |

---

## 11. RISK REGISTER

| Risk | Likelihood | Impact | Current mitigation | Residual |
|---|---|---|---|---|
| Legal complaint over Impressum placeholders / privacy inaccuracy | Medium | High (DDG §5, GDPR Art. 13) | none — live today | **High** until A8/A10 |
| A recruiter reads an unverifiable employer claim and checks it | Medium | High (credibility) | none — live today | **High** until A1 |
| Visitor cannot see or click the primary CTA | Certain | Medium (conversion) | none | **High** until A6 |
| CSP hash drift after deploy blanks the homepage | Low | High (site unusable) | none in repo | **Medium** until F11+F20 |
| Contact messages accumulate unread and undeleted | Medium | Medium (privacy + lost leads) | none | **Medium** until A9 |
| Regression reaches production unnoticed | Medium | Medium | none — no CI, no branch protection | **Medium** until Batch D |
| Infrastructure disclosure aids reconnaissance | Low | Medium | none — page is public | **Medium** until A7 |

---

## 12. PHASE 0 EXIT GATE

| Directive §13 requirement | Status |
|---|---|
| Repository / runtime inventory | ✅ §1 |
| Current-site screenshot matrix | ✅ §5 — 60 captures, local build (production unreachable, §1.4) |
| Route / component / content map | ✅ §2 |
| Truth registry | ✅ §3 — registry exists; delta drafted, **not applied** |
| List of missing owner inputs | ✅ §4 |
| Performance / accessibility / security baseline | ✅ §6 — with two stated gaps: no screen-reader test, no production measurement |
| Risk register | ✅ §7, §11 |
| No production changes | ✅ working tree clean; nothing deployed, published or deleted |

**Unresolved ambiguity that is not destructive but must be closed in Phase 1:** the
root-locale decision (A4) and the project-set decision (A15).

**Recommendation:** grant A1, A2, A3, A4 and A6 to unblock Phase 1; hold A8–A14 until the
legal review and the owner inputs in §4 are available.
