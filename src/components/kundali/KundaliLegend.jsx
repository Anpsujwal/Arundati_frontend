/*
 * KundaliLegend.jsx
 *
 * Planet abbreviation legend shown below the chart.
 */

const PLANETS = [
  { name: 'Sun',     abbrev: 'Su', color: '#B45309' },
  { name: 'Moon',    abbrev: 'Mo', color: '#1D4ED8' },
  { name: 'Mars',    abbrev: 'Ma', color: '#B91C1C' },
  { name: 'Mercury', abbrev: 'Me', color: '#15803D' },
  { name: 'Jupiter', abbrev: 'Ju', color: '#C2410C' },
  { name: 'Venus',   abbrev: 'Ve', color: '#7E22CE' },
  { name: 'Saturn',  abbrev: 'Sa', color: '#475569' },
  { name: 'Rahu',    abbrev: 'Ra', color: '#E2E8F0', bg: '#1E293B' },
  { name: 'Ketu',    abbrev: 'Ke', color: '#D6D3D1', bg: '#292524' },
];

export default function KundaliLegend() {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      justifyContent: 'center',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--color-surface-2)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}>
      {PLANETS.map(({ name, abbrev, color, bg = '#F9FAFB' }) => (
        <div
          key={name}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 18, height: 18, borderRadius: 3,
            background: bg, color, fontWeight: 700, fontSize: '0.55rem',
            border: '1px solid currentColor',
          }}>
            {abbrev}
          </span>
          <span>{name}</span>
        </div>
      ))}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600,
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 24, height: 14, borderRadius: 2,
          background: 'color-mix(in srgb, var(--color-primary) 12%, white)',
          color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.5rem',
          border: '1px solid var(--color-primary)',
        }}>
          Asc
        </span>
        Ascendant
      </div>
    </div>
  );
}
