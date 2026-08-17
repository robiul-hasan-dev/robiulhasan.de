import Link from 'next/link';
import { NAV_ITEMS } from '@lib/nav';
import ThemeToggle from '@/components/ThemeToggle';
import MobileNav from '@/components/MobileNav';
import LocaleSwitcher from '@/components/LocaleSwitcher';

/**
 * SiteHeader — Server Component. Renders the brand link and the desktop
 * navigation with zero client JS. Only the genuinely interactive controls are
 * Client Components: ThemeToggle (theme state) and MobileNav (drawer state).
 * LocaleSwitcher is a static placeholder until the i18n slice.
 */
export default function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-sm">
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10"
      >
        <Link
          href="/"
          className="nav-link text-lg font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-strong)]"
        >
          robiulhasan.de
        </Link>

        {/* Desktop links — server-rendered, hidden on mobile */}
        <ul className="hidden list-none items-center gap-5 p-0 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="m-0">
              <Link
                href={item.href}
                className="nav-link text-sm text-[var(--text-secondary)] no-underline hover:text-[var(--accent-strong)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
