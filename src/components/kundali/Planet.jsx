/*
 * Planet.jsx
 *
 * A single planet chip inside a Rashi cell.
 * Shows abbreviated name; full details on click.
 */

// Standard Vedic abbreviations
const ABBREV = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

// Per-planet accent colors for quick visual identification
const PLANET_COLORS = {
  Sun:     { bg: '#FFF3CD', color: '#B45309', border: '#F59E0B' },
  Moon:    { bg: '#EFF6FF', color: '#1D4ED8', border: '#93C5FD' },
  Mars:    { bg: '#FEF2F2', color: '#B91C1C', border: '#FCA5A5' },
  Mercury: { bg: '#F0FDF4', color: '#15803D', border: '#86EFAC' },
  Jupiter: { bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74' },
  Venus:   { bg: '#FDF4FF', color: '#7E22CE', border: '#D8B4FE' },
  Saturn:  { bg: '#F8FAFC', color: '#475569', border: '#94A3B8' },
  Rahu:    { bg: '#1E293B', color: '#E2E8F0', border: '#475569' },
  Ketu:    { bg: '#292524', color: '#D6D3D1', border: '#57534E' },
};

export default function Planet({ planet, isSelected, onClick }) {
  const abbrev = ABBREV[planet.name] ?? planet.name.slice(0, 2);
  const theme = PLANET_COLORS[planet.name] ?? { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };

  return (
    <button
      title={`${planet.name} in ${planet.rashi} (${planet.degree?.toFixed(2)}°)`}
      onClick={() => onClick(planet)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 3,
        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : theme.border}`,
        background: isSelected ? 'var(--color-primary)' : theme.bg,
        color: isSelected ? 'white' : theme.color,
        fontSize: '0.6rem',
        fontWeight: 700,
        cursor: 'pointer',
        outline: 'none',
        padding: 0,
        lineHeight: 1,
        transition: 'all 0.15s',
        boxShadow: isSelected ? '0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'none',
        userSelect: 'none',
        letterSpacing: '0.02em',
      }}
    >
      {abbrev}
    </button>
  );
}
