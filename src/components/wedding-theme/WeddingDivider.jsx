/**
 * WeddingDivider.jsx
 *
 * A decorative section divider with traditional Indian ornamental motifs.
 * Renders a horizontal rule with a central medallion and flanking lotus/leaf elements.
 *
 * Props:
 *   color    — line color (default: uses CSS var for gold)
 *   label    — optional center text label (e.g. section name)
 *   size     — 'sm' | 'md' | 'lg' (default: 'md')
 *   style    — extra inline styles on wrapper div
 */

export default function WeddingDivider({ color, label, size = 'md', style = {} }) {
  const lineColor = color || 'var(--color-gold)';

  const heights = { sm: '24px', md: '32px', lg: '42px' };
  const h = heights[size] || '32px';

  return (
    <div
      aria-hidden={!label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        margin: '8px 0',
        ...style,
      }}
    >
      {/* Left line + ornament */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, height: '1px', background: lineColor, opacity: 0.4 }} />
        <svg width={h} height={h} viewBox="0 0 40 40" aria-hidden="true">
          {/* Left lotus */}
          {[-45, -20, 0, 20, 45].map((a, i) => (
            <ellipse
              key={i}
              cx={20} cy={10}
              rx={4} ry={9}
              fill="var(--color-gold)"
              transform={`rotate(${a}, 20, 20)`}
              opacity={0.7}
            />
          ))}
          <circle cx={20} cy={20} r={5} fill="var(--color-gold)" opacity={0.9} />
          <circle cx={20} cy={20} r={2.5} fill="white" opacity={0.8} />
        </svg>
      </div>

      {/* Center medallion */}
      <svg width={label ? '0' : h} height={h} viewBox="0 0 40 40"
        style={{ display: label ? 'none' : 'block' }} aria-hidden="true">
        {/* Star of David / Shatkona motif */}
        <polygon
          points="20,4 24,14 35,14 26,21 30,31 20,25 10,31 14,21 5,14 16,14"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          opacity={0.65}
        />
        <circle cx={20} cy={20} r={4} fill="var(--color-gold)" opacity={0.8} />
        <circle cx={20} cy={20} r={2} fill="var(--color-primary-faint)" opacity={0.9} />
      </svg>

      {label && (
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xs)',
          color: lineColor,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          opacity: 0.85,
        }}>
          {label}
        </span>
      )}

      {/* Right line + ornament */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width={h} height={h} viewBox="0 0 40 40" aria-hidden="true">
          {[-45, -20, 0, 20, 45].map((a, i) => (
            <ellipse
              key={i}
              cx={20} cy={10}
              rx={4} ry={9}
              fill="var(--color-gold)"
              transform={`rotate(${a}, 20, 20)`}
              opacity={0.7}
            />
          ))}
          <circle cx={20} cy={20} r={5} fill="var(--color-gold)" opacity={0.9} />
          <circle cx={20} cy={20} r={2.5} fill="white" opacity={0.8} />
        </svg>
        <div style={{ flex: 1, height: '1px', background: lineColor, opacity: 0.4 }} />
      </div>
    </div>
  );
}
