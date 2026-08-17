# CLAUDE BUILD BRIEF — Portfolio v2 (slice-gated)

**Authoritative sources (READ FIRST, in order):**
1. `/root/.hermes/cache/documents/doc_9240ed2b00dc_ROBIUL_PORTFOLIO_MASTER_IMPLEMENTATION_DIRECTIVE_v1.0.md` — the MASTER DIRECTIVE (governance, IA, design §6, phases §13, DoD §14)
2. `/root/site/docs/PHASE0_REPORT.md` — the Phase 0 audit (truth registry draft, owner-input list, risk backlog)
3. `/root/site` — the existing codebase (Next.js 16.3, React 19.2.8, TS, Tailwind, src/app)

## Your role
You are the IMPLEMENTATION AGENT. Execute the directive in TINY SLICES. Build one slice, report in the directive's required format (§15: Outcome/Evidence/Truth changes/Security/Remaining gaps/Risk/Next/Approval), STOP, and wait. Never chain slices without the gate.

## Design direction (from directive §6 — overrides earlier model suggestions)
- **Retain:** editorial dark/light foundation, **warm neutral surfaces**, **lime accent** (the directive says the lime accent is to be retained — do NOT replace with teal/orange/violet), generous whitespace, strong typographic hierarchy.
- **Max 2 font families** (Space Grotesk display + DM Sans body are already wired; JetBrains Mono for metadata/status — already loaded).
- **Motion:** state/hierarchy/continuity only. `prefers-reduced-motion` respected. No typewriter gimmicks, no autoplay video, no cursor hijacking, no scroll-jacking, no background particle system.
- **3D:** only if it demonstrates actual project information — otherwise a static annotated SVG architecture diagram. (Current Hero3D is abstract; evaluate honestly.)
- **Every graphic needs a content purpose.** Real photography only for Robiul (none yet — placeholder).
- **"Advanced/dynamic" = useful personalization, NOT visual noise.**

## Truth protocol (directive §1.2 — non-negotiable)
- Create `content/facts.yaml` (or equivalent typed truth registry). Every public claim: claim / status (`verified|owner-confirmed|needs-verification|private`) / evidence / public wording / last-verified date.
- **NEVER publish:** unsupported metrics, "100% DSGVO", "AI intelligence", "production" without verification, awards, logos, testimonials, employer endorsements, revenue, user counts.
- Use lifecycle labels: Concept / Prototype / In progress / Field experience / Production (only when verified).
- Missing data → `OWNER INPUT REQUIRED` placeholder. NEVER invent values.

## Architecture rules (directive §7)
- **Server Components by default.** Client Components ONLY for: filters, theme toggle, mobile nav, forms, and genuinely interactive demos. (Current site has ALL 9 components client-side — fix this as part of the shell/nav slice.)
- Static rendering for stable content. MDX or typed local content files. Zod schema validation — **build must fail** on missing alt text, invalid locale linkage, missing status.
- No database, CMS, auth, AI chat, vector store, or real-time layer in P0.
- Locale-prefixed routes from the start: `/en/*` + `/de/*` (English = source language; German human-reviewed before release; NO raw machine translation).

## Slice plan (smallest shippable units — implement ONLY slice 1 now)
1. **Design tokens + site shell + navigation** — palette/type/spacing/radius tokens per directive §6, Server-Component shell (header/nav/mobile drawer/locale switcher/theme switcher/skip link/footer), fix the "all client components" violation. Include `content/facts.yaml` skeleton + `lib/schema.ts` (Zod) skeleton.
2. Hero + positioning (static, honest, mono metadata eyebrow)
3. Work index + case-study template (status badges, evidence blocks)
4. Experience timeline + About
5. CV (HTML/print) + Contact (delivery + privacy notice)
6. Legal pages + metadata/OG/sitemap/robots/hreflang/JSON-LD
7. i18n EN/DE wiring + German human-review gate
8. A11y + performance pass

## Sandbox contract (you are executing inside a write-only sandbox)
- You MAY: read any file under /root/site, write/edit files under /root/site.
- You may NOT: run bash/commands, install packages, access network, touch credentials, modify anything outside /root/site, or change DNS/deployment.
- Output the diff of every change you make.

## Report format for THIS slice (§15)
Outcome / Evidence (files changed) / Truth changes / Security-privacy / Remaining gaps / Risk / Next action / Approval required.
