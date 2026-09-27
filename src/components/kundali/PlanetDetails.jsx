/*
 * PlanetDetails.jsx
 *
 * Detail panel shown when a planet chip is clicked.
 * Displays full planet info from the normalized kundali data.
 */

import { X } from 'lucide-react';

const PLANET_EMOJI = {
  Sun: '☀️', Moon: '🌙', Mars: '♂️', Mercury: '☿',
  Jupiter: '♃', Venus: '♀️', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

function Row({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '6px 0',
      borderBottom: '1px solid var(--color-border)',
      fontSize: 'var(--text-sm)',
    }}>
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--color-text)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function PlanetDetails({ planet, ascendant, onClose }) {
  const emoji = PLANET_EMOJI[planet.name] ?? '⭐';

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      boxShadow: '0 4px 24px rgba(139,26,74,0.10)',
      position: 'relative',
      animation: 'fadeIn 0.15s ease',
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close planet details"
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--color-text-muted)', display: 'flex', padding: 4,
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <X size={16} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-faint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {emoji}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {planet.name}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Planet Details
          </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <Row label="Rashi (Sign)"    value={planet.rashi} />
        <Row label="Degree in Sign"  value={planet.degree != null ? `${Number(planet.degree).toFixed(2)}°` : null} />
        <Row label="House"           value={planet.house ? `${planet.house}${ordinal(planet.house)} House` : null} />
        <Row label="Nakshatra"       value={planet.nakshatra} />
        <Row label="Pada"            value={planet.nakshatra_pada ? `${planet.nakshatra_pada} of 4` : null} />
        {planet.rashi === ascendant?.rashi && (
          <Row label="Note" value="This planet shares the Ascendant sign" />
        )}
      </div>
    </div>
  );
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
