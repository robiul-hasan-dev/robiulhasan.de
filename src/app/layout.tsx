import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import ShieldStrip from '@/components/ShieldStrip';

export const metadata: Metadata = {
  title: {
    default: 'Robiul Hasan — Software & AI Engineer',
    template: '%s · Robiul Hasan',
  },
  description:
    'Selbst-gehostete KI-Systeme, private Suchinfrastruktur und automatisierte Intelligence — dokumentiert, getestet, sicher.',
  robots: { index: true, follow: true },
  metadataBase: new URL('https://robiulhasan.de'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'robiulhasan.de',
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Robiul Hasan',
  jobTitle: 'Software & AI Engineer',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'München',
    addressCountry: 'Deutschland',
  },
  url: 'https://robiulhasan.de',
  sameAs: [
    'https://www.linkedin.com/in/robiulhasan',
    'https://github.com/robiulhasan',
  ],
  knowsAbout: [
    'Software Engineering',
    'AI Systems',
    'Self-hosted Infrastructure',
    'Privacy',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'robiulhasan.de',
  url: 'https://robiulhasan.de',
  inLanguage: 'de-DE',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* No-FOUC theme: apply before paint (ADR-014) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var t=s||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(_e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        {/* JSON-LD structured data (docs: app/guides/json-ld) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <header className="relative z-40 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-sm">
          <nav
            aria-label="Hauptnavigation"
            className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4"
          >
            <a
              href="/"
              className="nav-link text-lg font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-strong)]"
            >
              robiulhasan.de
            </a>
            <div className="flex items-center gap-5">
              <ul className="flex list-none gap-5 p-0">
                {[
                  ['Start', '/'],
                  ['Projekte', '/projects/'],
                  ['Lab', '/lab/'],
                  ['Blog', '/blog/'],
                  ['Wissen', '/knowledge/'],
                  ['Über mich', '/about/'],
                ].map(([label, href]) => (
                  <li key={href} className="m-0">
                    <a
                      href={href}
                      className="nav-link text-sm text-[var(--text-secondary)] no-underline hover:text-[var(--accent-strong)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="border-t border-[var(--border)]">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[var(--text-tertiary)]">
                © 2026 Robiul Hasan · München
              </p>
              <ShieldStrip />
            </div>
            <nav aria-label="Fußnavigation">
              <ul className="flex list-none gap-4 p-0">
                <li>
                  <a href="/impressum/" className="nav-link text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent-strong)]">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="/datenschutz/" className="nav-link text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent-strong)]">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="/docs/adr/" className="nav-link text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent-strong)]">
                    Architektur
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
