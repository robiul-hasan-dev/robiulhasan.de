import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

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
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased">
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <header className="border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-sm">
          <nav
            aria-label="Hauptnavigation"
            className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4"
          >
            <a
              href="/"
              className="text-lg font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent)]"
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
                      className="text-sm text-[var(--text-secondary)] no-underline hover:text-[var(--accent)]"
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
            <p className="text-sm text-[var(--text-tertiary)]">
              © 2026 Robiul Hasan · München
            </p>
            <nav aria-label="Fußnavigation">
              <ul className="flex list-none gap-4 p-0">
                <li>
                  <a href="/impressum/" className="text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent)]">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="/datenschutz/" className="text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent)]">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="/docs/adr/" className="text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent)]">
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
