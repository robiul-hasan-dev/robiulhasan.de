export const metadata = { title: 'Architektur-Entscheidungen (ADR)' };

const adrs = [
  ['ADR-001', 'Static Site Generator: Astro', '✅ Adopted — vs. Hugo, Eleventy, Next.js, hand-rolled', 'Zero-JS default, type-safe Content Layer, built-in image optimization, SSR verfügbar falls nötig. Revisit-Trigger dokumentiert.'],
  ['ADR-002', 'Reverse Proxy: Caddy', '✅ Adopted — vs. nginx+certbot, Traefik', 'Auto-HTTPS (Let\'s Encrypt), HTTP/3, minimale Konfiguration, HSTS-preload-fähig.'],
  ['ADR-003', 'Hosting: Selbst-gehostet', '✅ Adopted — vs. GitHub Pages, Cloudflare Pages, Netlify', 'Volle Kontrolle, keine Vendor-Abhängigkeit, ein Server für alles.'],
  ['ADR-004', 'Content: Git + Markdown', '✅ Adopted — vs. Decap CMS, Strapi, Sanity', 'Single Source of Truth, versioniert, kein Datenbank-Lock-in für Inhalte.'],
  ['ADR-005', 'DNS: DNS-only', '✅ Adopted — vs. proxied CDN', 'Kein CDN-Mittelsmann für Ursprungs-Traffic; geringere Angriffsfläche.'],
  ['ADR-006', 'Site-Suche: Pagefind', '✅ Adopted — vs. Algolia, lunr', 'Lokal, datenschutzfreundlich, keine externen Anfragen.'],
  ['ADR-007', 'Analytics: log-basiert', '✅ Adopted — vs. Umami/Plausible, GA4', 'Keine Cookies, keine Tracking-Dienste.'],
  ['ADR-008', 'Kontakt: mailto + Formular-Handler', '✅ Adopted — vs. Formspree, DB-Formular', 'Keine Daten bei Dritten.'],
  ['ADR-009', 'Public RAG: kuratierter Korpus', '✅ Adopted — vs. voller privater Korpus', 'Öffentliche Wissensbasis enthält NUR veröffentlichte Inhalte; private Daten isoliert (getestet).'],
  ['ADR-010', 'Titan Search Demo: rate-limitierte API', '✅ Adopted — vs. öffentliches SearXNG', 'SearXNG bleibt intern; nur bereinigte API öffentlich.'],
  ['ADR-011', 'Sprache: DE primär + rechtliche Seiten', '✅ Adopted — vs. EN-only', 'Deutsch als Hauptsprache (Zielgruppe).'],
  ['ADR-012', 'Deployment: GitHub Actions → rsync (geplant)', '🔄 Planned — CI-Token ausstehend', 'Atomarer Swap; aktuell manuell, dokumentiert im Runbook.'],
  ['ADR-013', 'Fonts: selbst-gehostet', '✅ Adopted — vs. Google Fonts CDN', 'Keine externen Anfragen, kein Tracking.'],
  ['ADR-014', 'Theme: dark default + light toggle', '✅ Adopted — vs. dark-only', 'System-aware, keine FOUC, WCAG-Kontrast in beiden Themes.'],
  ['ADR-015', 'Repos: separates öffentliches Site-Repo', '✅ Adopted — vs. Publishing aus second-brain', 'Öffentlicher Code getrennt von privatem Wissen.'],
  ['ADR-016', 'App-Layer: Next.js auf app.robiulhasan.de', '✅ Adopted — scoped, cross-model validiert', 'React + TypeScript als Anwendungsschicht, isoliert vom statischen Shell.'],
  ['ADR-017', 'Hauptseite: Next.js (ersetzt Astro)', '✅ Adopted — Operator-Präferenz', 'React + TypeScript für das Haupt-Site; Astro als Rollback erhalten.'],
];

export default function AdrPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold">Architektur-Entscheidungen</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Jede bedeutende technische Entscheidung dokumentiert — mit Alternativen, Trade-offs und
          Begründung. Evidence-driven, nie nach Beliebtheit.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {adrs.map(([id, title, verdict, text]) => (
          <article key={id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            <h2 className="text-base font-medium text-[var(--text-primary)]">
              <span className="font-mono text-sm text-[var(--accent-strong)]">{id}</span>{' '}
              {title}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{verdict}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
