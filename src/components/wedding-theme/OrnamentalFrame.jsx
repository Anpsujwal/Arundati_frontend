/**
 * OrnamentalFrame.jsx
 *
 * A decorative frame wrapping an important section (e.g. the Kundali chart).
 * Renders SVG corner ornaments and optional top/bottom torans.
 * Does NOT overlap children — it uses padding and absolute corner decorations.
 *
 * Props:
 *   children   — content to frame
 *   title      — optional title displayed at top-center within an ornamental banner
 *   showToran  — if true, renders a mini mango toran above the title (default: true)
 *   borderColor — border color (default: var(--color-gold))
 *   style       — extra wrapper styles
 */

import FloralDecoration from './FloralDecoration.jsx';

export default function OrnamentalFrame({
  children,
  title,
  showToran = true,
  borderColor,
  style = {},
}) {
  const bc = borderColor || 'var(--color-gold)';

  return (
    <div style={{
      position: 'relative',
      border: `1.5px solid ${bc}`,
      borderRadius: 'var(--radius-lg)',
      padding: title ? 'var(--space-8) var(--space-6) var(--space-6)' : 'var(--space-6)',
      background: 'var(--color-surface)',
      boxShadow: '0 4px 24px rgba(196,147,42,0.08)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Corner ornaments */}
      <FloralDecoration position="top-left"     size={60} opacity={0.45} />
      <FloralDecoration position="top-right"    size={60} opacity={0.45} />
      <FloralDecoration position="bottom-left"  size={50} opacity={0.35} />
      <FloralDecoration position="bottom-right" size={50} opacity={0.35} />

      {/* Title banner */}
      {title && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          marginBottom: 'var(--space-5)',
        }}>
          {showToran && (
            <div style={{ marginBottom: 'var(--space-2)', opacity: 0.75 }}>
              {/* Mini inline toran using CSS */}
              <svg viewBox="0 0 400 36" width="min(100%, 360px)" height="auto"
                aria-hidden="true" style={{ display: 'inline-block', overflow: 'visible' }}>
                {/* Cord */}
                <path d="M0,8 Q200,22 400,8" fill="none" stroke="var(--color-gold)"
                  strokeWidth="1.2" opacity={0.7} />
                {/* Leaves */}
                {Array.from({ length: 11 }, (_, i) => {
                  const x = (i / 10) * 400;
                  const normX = (x / 400) * 2 - 1;
                  const y = 8 + normX * normX * 14;
                  const angle = i % 2 === 0 ? -22 : 22;
                  const flip = i % 2 !== 0;
                  const sx = flip ? -0.7 : 0.7;
                  return (
                    <g key={i} transform={`translate(${x},${y + 10}) rotate(${angle}) scale(${sx},0.7)`}>
                      <path
                        d="M0,0 C-8,-18 -14,-34 -6,-52 C0,-62 6,-62 12,-52 C20,-34 8,-18 0,0 Z"
                        fill="#2D6A3F"
                        opacity={0.8}
                      />
                    </g>
                  );
                })}
                <circle cx={0} cy={8} r={3} fill="var(--color-gold)" opacity={0.8} />
                <circle cx={400} cy={8} r={3} fill="var(--color-gold)" opacity={0.8} />
              </svg>
            </div>
          )}

          {/* Ornamental title */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, var(--color-gold-faint), var(--color-primary-faint))',
            border: `1px solid ${bc}`,
            borderRadius: 'var(--radius-full)',
            padding: '6px 20px',
          }}>
            <span style={{ color: bc, fontSize: '12px' }}>✦</span>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              letterSpacing: '0.5px',
            }}>
              {title}
            </span>
            <span style={{ color: bc, fontSize: '12px' }}>✦</span>
          </div>
        </div>
      )}

      {/* Content — sits above the decorations */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Bottom ornamental strip */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${bc}, transparent)`,
        opacity: 0.4,
      }} />

      {/* Top ornamental strip */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${bc}, transparent)`,
        opacity: 0.4,
      }} />
    </div>
  );
}
