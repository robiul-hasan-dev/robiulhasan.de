# Migration Notes — Astro → Next.js (ADR-017)

## What happened
The main site migrated from Astro SSG to Next.js 16 + React 19 + TypeScript
(2026-08-04), per operator preference (ADR-017) after cross-model evaluation
(Claude Code + Gemini, unanimous MIGRATE-LATER-feature-driven verdict).

## RETENTION DECISION (user, 2026-08-04)
"Always keep old things until we get established with our newly changed things.
Later check and when everything is going well according to our philosophy,
strategies, goal, with our journey then use common sense to decide what to do
with the old stuff — ask the user: keep, remove, or what else."

→ **Astro is KEPT for now.** No force-push to GitHub. Revisit when the Next.js
site is established (see REVISIT TRIGGERS below).

## Where the old Astro site lives (KEPT)
- Source + full git history: `/root/robiulhasan.de/` (local, preserved as rollback)
- GitHub repo `robiul-hasan-dev/robiulhasan.de`: 18 Astro commits (untouched)
- Deployed static build: `/srv/site` (Caddy rollback target)
- Rollback: revert Caddyfile `reverse_proxy titan-site:3000` → `root * /srv/site` + `file_server`

## Where the new Next.js site lives
- Source: `/root/site/` (local; not yet pushed to GitHub — decision pending)
- App layer: `/root/app-portal/` (pushed: robiul-hasan-dev/app-portal)
- Running container: titan-site (robiulhasan.de) + titan-portal (app.robiulhasan.de)

## REVISIT TRIGGERS (when to decide keep/remove/archive old Astro)
1. Next.js site stable 2+ weeks without regression (per user's "established" rule)
2. Search Console indexed (proves the new site works for the journey goal)
3. All 17 pages + lab demos verified working over time
4. No rollback needed in that window
→ THEN ask user: keep / remove / archive the old Astro repo + /srv/site
