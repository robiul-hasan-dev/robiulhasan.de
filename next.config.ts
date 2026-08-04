/** @type {import('next').NextConfig} */
// Main site — Next.js (ADR-017)
// Security-first per Engineering Charter §3.
// CSP is served by Caddy (deploy-site extracts hashes from the exact build output)
// — deterministic, no drift. Next serves the other security headers.

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  // Match the previous site's canonical URLs (SEO consistency — sitemap uses trailing slashes)
  trailingSlash: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // CSP is served by Caddy (deploy-site extracts hashes from the exact build).
          // Next must NOT set CSP here — two CSP headers are both enforced.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
