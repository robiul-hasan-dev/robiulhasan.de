// DEPRECATED. Navigation was split for the Server-Component shell refactor:
//   - SiteHeader (Server Component) renders the brand + desktop links, no JS.
//   - MobileNav  (Client Component) renders the hamburger + drawer only.
// This file previously shipped the entire nav as a Client Component, which
// forced client JS for the desktop layout too. It is kept solely as a
// compatibility re-export; prefer importing SiteHeader / MobileNav directly.
export { default } from './MobileNav';
