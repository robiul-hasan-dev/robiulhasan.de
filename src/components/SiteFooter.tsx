import Link from 'next/link';
import ShieldStrip from '@/components/ShieldStrip';

/**
 * SiteFooter — Server Component. Static legal/identity links; the only client
 * piece is ShieldStrip (fetches a live status file and degrades honestly to
 * "unavailable"). Professional-identity links (GitHub/LinkedIn) are withheld
 * until verified owner inputs land — see content/facts.yaml.
 */
const FOOTER_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
  { label: 'Architektur', href: '/docs/adr/' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[var(--text-tertiary)]">
            © 2026 Robiul Hasan · München
          </p>
          <ShieldStrip />
        </div>
        <nav aria-label="Fußnavigation">
          <ul className="flex list-none flex-wrap gap-4 p-0">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="nav-link text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--accent-strong)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
