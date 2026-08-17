import Link from 'next/link';
import { getWording } from '@lib/facts';

/**
 * Hero — the "3-second decision" section (Server Component, fully static).
 *
 * Every word of the positioning and the support line is rendered from the
 * truth registry (content/facts.yaml) via lib/facts — nothing is invented here
 * (Master Directive §1.2). No typewriter, no gradient-text gimmick: the accent
 * is a solid lime colour on a verbatim substring. Motion is not used, so
 * prefers-reduced-motion is respected by construction.
 */

// The lime highlight lands on this verbatim substring of the confirmed
// positioning — it is typographic emphasis only, it changes no wording.
const ACCENT_PHRASE = 'human-controlled';
// Clause boundary used to split the single confirmed positioning sentence into
// a mono identity eyebrow and the headline. Purely typographic: the eyebrow and
// headline concatenate back to the exact registry wording (no edits).
const CLAUSE_SPLIT = ' building ';

// Verified content counts (directive §1.2) — the honest "support line". Each is
// rendered verbatim; a withheld fact is simply dropped, never back-filled.
const SUPPORT_FACT_IDS = [
  'projects-documented',
  'posts-published',
  'knowledge-pages',
] as const;

function renderWithAccent(text: string) {
  const i = text.indexOf(ACCENT_PHRASE);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: 'var(--accent-strong)' }}>{ACCENT_PHRASE}</span>
      {text.slice(i + ACCENT_PHRASE.length)}
    </>
  );
}

export default function Hero() {
  const positioning = getWording('core-positioning') ?? '';
  const splitAt = positioning.indexOf(CLAUSE_SPLIT);
  const eyebrow = splitAt > -1 ? positioning.slice(0, splitAt) : '';
  const headline =
    splitAt > -1 ? positioning.slice(splitAt + 1) : positioning;

  const support = SUPPORT_FACT_IDS.map((id) => getWording(id)).filter(
    (w): w is string => w !== null,
  );

  return (
    <section aria-labelledby="hero-heading" className="py-16 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left — positioning (verbatim from the truth registry) */}
        <div>
          <h1 id="hero-heading" className="text-[var(--text-primary)]">
            {eyebrow && (
              <span
                className="block text-sm uppercase tracking-[0.14em] text-[var(--text-tertiary)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {eyebrow}
              </span>
            )}
            <span className="mt-3 block text-3xl font-bold md:text-4xl">
              {renderWithAccent(headline)}
            </span>
          </h1>

          {support.length > 0 && (
            <p className="mt-6 text-base text-[var(--text-secondary)] md:text-lg">
              {support.join(' · ')}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            {/* Secondary CTA */}
            <Link
              href="/about/"
              className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--accent)]"
            >
              Über mich
            </Link>
            {/* Primary CTA — solid lime, not a gradient */}
            <Link
              href="/projects/"
              className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--on-accent)] no-underline transition-colors hover:bg-[var(--accent-strong)]"
            >
              Projekte ansehen
            </Link>
          </div>
        </div>

        {/* Right — static, annotated architecture diagram */}
        <HeroDiagram />
      </div>
    </section>
  );
}

/**
 * A static SVG that visualises the confirmed positioning as a flow — every
 * label is a verbatim fragment of the positioning statement, so it asserts no
 * claim the registry does not already carry. Accessible: role="img" with a
 * titled label and an aria-describedby description.
 */
function HeroDiagram() {
  const nodes = [
    { y: 8, label: 'Real-world problem', highlight: false },
    { y: 78, label: 'Digital & AI system', highlight: false },
    { y: 148, label: 'Human control', highlight: true },
    { y: 218, label: 'Practical outcome', highlight: false },
  ];
  const RECT_H = 48;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
      <svg
        viewBox="0 0 300 274"
        width="100%"
        role="img"
        aria-labelledby="hero-diagram-title"
        aria-describedby="hero-diagram-desc"
        style={{ maxWidth: 360, margin: '0 auto', display: 'block' }}
      >
        <title id="hero-diagram-title">
          Approach: human-controlled systems
        </title>
        <desc id="hero-diagram-desc">
          A top-to-bottom flow illustrating the positioning: a real-world
          problem feeds a digital and AI system, which passes through a
          human-control checkpoint before producing a practical outcome.
        </desc>

        <defs>
          <marker
            id="hero-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path
              d="M1,1 L7,4 L1,7 Z"
              style={{ fill: 'var(--text-tertiary)' }}
            />
          </marker>
        </defs>

        {/* Connectors between the four stages */}
        {nodes.slice(0, -1).map((node, i) => {
          const from = node.y + RECT_H;
          const to = nodes[i + 1].y;
          return (
            <line
              key={`edge-${i}`}
              x1="150"
              y1={from}
              x2="150"
              y2={to - 2}
              style={{ stroke: 'var(--text-tertiary)' }}
              strokeWidth="1.5"
              markerEnd="url(#hero-arrow)"
            />
          );
        })}

        {/* Stage nodes */}
        {nodes.map((node) => (
          <g key={node.label}>
            <rect
              x="20"
              y={node.y}
              width="260"
              height={RECT_H}
              rx="10"
              style={{
                fill: 'var(--bg-inset)',
                stroke: node.highlight ? 'var(--accent)' : 'var(--border)',
              }}
              strokeWidth={node.highlight ? 2 : 1}
            />
            <text
              x="150"
              y={node.y + RECT_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="15"
              style={{
                fill: node.highlight
                  ? 'var(--accent-strong)'
                  : 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
