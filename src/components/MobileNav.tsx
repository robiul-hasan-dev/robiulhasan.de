'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_ITEMS } from '@lib/nav';

/**
 * MobileNav — the ONLY interactive part of the header: a hamburger button and
 * dropdown drawer for narrow viewports. Desktop links are server-rendered in
 * SiteHeader, so this ships no JS for the md+ layout.
 *
 * Accessible: aria-expanded / aria-controls, Escape to close, close on link
 * click. Hidden entirely at md+ (both button and drawer are `md:hidden`).
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
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
            <path d="M5 5l10 10M15 5L5 15" />
          ) : (
            <path d="M3 5.5h14M3 10h14M3 14.5h14" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-full z-50 border-b border-[var(--border)] bg-[var(--header-bg)] px-6 py-4 backdrop-blur-sm"
        >
          <ul className="flex list-none flex-col gap-1 p-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="m-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="nav-link block rounded-md px-3 py-2.5 text-base text-[var(--text-secondary)] no-underline hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-strong)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
