export const metadata = { title: 'Über mich' };

const skills = [
  { name: 'Docker', level: 4, evidence: 'Container-Orchestrierung für Web, Datenbank und Dienste' },
  { name: 'PostgreSQL + pgvector', level: 4, evidence: 'Relationale Daten + semantische Einbettungen, Wissensgraph' },
  { name: 'Linux / SSH-Sicherheit', level: 4, evidence: 'Server-Härtung, Fail2ban, private Netzwerk-Mesh, Security-Scans' },
  { name: 'Python-Automatisierung', level: 4, evidence: 'Automatisierte Workflows für Intelligence, Sicherheit und Backup' },
  { name: 'KI-Agenten-Systeme', level: 4, evidence: 'Multi-Agenten-Architekturen mit Qualitäts- und Wissens-Gates' },
  { name: 'Systemarchitektur', level: 3, evidence: 'Modulare System-Designs, Engineering-Dokumentation, ADRs' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold">Über mich</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Software- & KI-Ingenieur mit humanitärem Fundament — gebaut in München, beweisbar überall.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Der Weg</h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          Informatik-Abschluss (Bangladesch), dann humanitäre Arbeit bei <strong className="text-[var(--text-primary)]">IOM</strong>,{' '}
          <strong className="text-[var(--text-primary)]">DRC</strong> und{' '}
          <strong className="text-[var(--text-primary)]">MSF</strong> — Organisationen, in denen Technologie
 Menschenleben erleichtert, nicht nur Quartalszahlen. Heute lebe ich in München und baue
 ein vollständig selbst-gehostetes KI-System mit mehreren spezialisierten Agenten.
        </p>
        <p className="mt-3 text-[var(--text-secondary)]">
          Meine Überzeugung: <strong className="text-[var(--text-primary)]">Arbeit spricht lauter als Worte.</strong>{' '}
          Deshalb ist jede Fähigkeit auf dieser Seite mit nachweisbarer Evidenz belegt — kein Behaupten,
          nur Zeigen.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Fähigkeiten mit Evidenz</h2>
        <div className="mt-4 space-y-4">
          {skills.map((s) => (
            <div key={s.name} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-[var(--text-primary)]">{s.name}</h3>
                <span className="font-mono text-xs text-[var(--text-tertiary)]" aria-label={`Level ${s.level} von 5`}>
                  {s.level}/5
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.evidence}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-inset)]" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${(s.level / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Sprachen</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--text-secondary)]">
          <li><strong className="text-[var(--text-primary)]">Bengalisch</strong> — Muttersprache</li>
          <li><strong className="text-[var(--text-primary)]">Englisch</strong> — Fließend (berufliche Arbeitssprache)</li>
          <li>
            <strong className="text-[var(--text-primary)]">Deutsch</strong> — B1 (DTZ-Prüfung Juli 2026) · lerne
            weiter für B2
          </li>
        </ul>
      </section>
    </div>
  );
}
