export const metadata = { title: 'Datenschutzerklärung' };

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <article className="prose max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-strong)]">
        <h1>Datenschutzerklärung</h1>

        <h2>1. Verantwortlicher</h2>
        <p>
          Robiul Hasan<br />
          [Adresse wird ergänzt]<br />
          München, Deutschland<br />
          E-Mail: hello@robiulhasan.de
        </p>

        <h2>2. Allgemeine Hinweise</h2>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten
          sind alle Daten, mit denen Sie persönlich identifiziert werden können.
        </p>

        <h2>3. Datenerfassung auf dieser Website</h2>

        <h3>Server-Log-Files</h3>
        <p>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten
          Server-Log-Files (z.B. IP-Adresse, Datum und Uhrzeit, Browsertyp). Diese Daten sind nicht
          bestimmten Personen zuordenbar und werden nicht mit anderen Datenquellen zusammengeführt.
        </p>

        <h3>Hosting</h3>
        <p>
          Diese Website wird bei einem deutschen Anbieter gehostet (Hosting-Provider Online GmbH,
          Nürnberg). Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an einer sicheren Bereitstellung).
        </p>

        <h2>4. Cookies</h2>
        <p>
          Diese Website verwendet <strong>keine Tracking-Cookies</strong>. Technisch notwendige
          Funktionen (Theme-Auswahl) werden lokal im Browser gespeichert (localStorage) — nicht auf
          dem Server. Es ist daher <strong>kein Cookie-Banner</strong> erforderlich.
        </p>

        <h2>5. Suchfunktion</h2>
        <p>
          Die Suche auf dieser Website läuft <strong>vollständig im Browser</strong>. Es werden
          keine Suchanfragen an einen Server gesendet.
        </p>

        <h2>6. KI-Dienste</h2>
        <p>
          Falls diese Website KI-basierte Dienste anbietet: Ihre Eingaben werden ausschließlich zur
          Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben. Daten werden nach
          Bearbeitung gelöscht (Grundsatz der Datenminimierung, Art. 5 Abs. 1 lit. c DSGVO).
        </p>

        <h2>7. Ihre Rechte</h2>
        <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf:</p>
        <ul>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch (Art. 21 DSGVO)</li>
        </ul>

        <h2>8. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren (z.B. Bayerisches
          Landesamt für Datenschutzaufsicht).
        </p>

        <p className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-[var(--warning)]">
          ⚠️ Vor Veröffentlichung von einem Datenschutzbeauftragten oder Rechtsanwalt prüfen lassen.
        </p>
      </article>
    </div>
  );
}
