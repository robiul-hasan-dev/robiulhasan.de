export const metadata = { title: 'Impressum' };

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <article className="prose max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-strong)]">
        <h1>Impressum</h1>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          Robiul Hasan<br />
          [Adresse wird ergänzt]<br />
          München, Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: hello@robiulhasan.de
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>Nach Erhalt der Steuernummer einzutragen (gemäß § 27a UStG).</p>

        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>Robiul Hasan, [Adresse], München</p>

        <h2>Haftungsausschluss (Disclaimer)</h2>
        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach
          den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
          jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
          oder Betreiber der Seiten verantwortlich.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>

        <h2>EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/">https://ec.europa.eu/consumers/odr/</a>
        </p>

        <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <p className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-[var(--warning)]">
          ⚠️ Vor Veröffentlichung von einem Steuerberater oder Rechtsanwalt prüfen lassen.
        </p>
      </article>
    </div>
  );
}
