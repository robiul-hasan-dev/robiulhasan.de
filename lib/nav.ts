// Primary navigation data — shared between the Server Component header
// (SiteHeader) and the Client Component mobile drawer (MobileNav) so the link
// set has a single source of truth.
//
// NOTE: routes are root-relative for now. Locale-prefixed routing (/en, /de)
// arrives in the i18n slice; until then the site is German at the root.

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Start', href: '/' },
  { label: 'Projekte', href: '/projects/' },
  { label: 'Lab', href: '/lab/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Wissen', href: '/knowledge/' },
  { label: 'Über mich', href: '/about/' },
];
