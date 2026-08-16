'use client';

import { useState, useEffect } from 'react';

/**
 * SiteNav — responsive navigation.
 * Desktop: horizontal links (md+). Mobile: hamburger → dropdown panel.
 * Accessible: aria-expanded, aria-label, Escape to close, close on link click.
 */
const NAV_ITEMS: Array<[string, string]> = [
  ['Start', '/'],
  ['Projekte', '/projects/'],
  ['Lab', '/lab/'],
  ['Blog', '/blog/'],
  ['Wissen', '/knowledge/'],
  ['Über mich', '/about/'],
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  // Close menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Desktop nav — hidden on mobile */}
      <ul className="hidden list-none gap-5 p-0 md:flex">
        {NAV_ITEMS.map(([label, href]) => (
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

      {/* Hamburger — visible on mobile only */}
      <button
        type="button"
        aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] md:hidden"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M5 5l10 10M15 5L5 15" />
            </>
          ) : (
            <>
              <path d="M3 5.5h14M3 10h14M3 14.5h14" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown panel */}
      {open && (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-full z-50 border-b border-[var(--border)] bg-[var(--header-bg)] px-6 py-4 backdrop-blur-sm md:hidden"
        >
          <ul className="flex list-none flex-col gap-1 p-0">
            {NAV_ITEMS.map(([label, href]) => (
              <li key={href} className="m-0">
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="nav-link block rounded-md px-3 py-2.5 text-base text-[var(--text-secondary)] no-underline hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-strong)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
