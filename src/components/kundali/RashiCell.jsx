/*
 * RashiCell.jsx
 *
 * One cell of the South Indian Kundali grid.
 * Shows the Rashi name, an Ascendant marker if applicable,
 * and all planets placed in that Rashi.
 */

import Planet from './Planet';

// Border logic: each cell needs borders on sides it shares with neighbours.
// All cells have right + bottom borders; the grid container handles outer borders.
function cellBorderStyle(row, col) {
  return {
    borderRight: col < 3 ? '1px solid var(--color-border)' : 'none',
    borderBottom: row < 3 ? '1px solid var(--color-border)' : 'none',
  };
}

export default function RashiCell({
  rashi, planets, isAscendant, row, col, onPlanetClick, selectedPlanet,
}) {
  return (
    <div
      style={{
        padding: '4px 5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 0,
        position: 'relative',
        background: isAscendant ? 'color-mix(in srgb, var(--color-primary) 5%, white)' : 'var(--color-surface)',
        transition: 'background 0.15s',
        ...cellBorderStyle(row, col),
      }}
    >
      {/* Rashi name */}
      <div style={{
        fontSize: '0.6rem',
        fontWeight: 600,
        color: isAscendant ? 'var(--color-primary)' : 'var(--color-text-muted)',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        lineHeight: 1.2,
        textAlign: 'center',
        marginBottom: 2,
        userSelect: 'none',
      }}>
        {rashi}
      </div>

      {/* Ascendant marker */}
      {isAscendant && (
        <div style={{
          fontSize: '0.55rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          background: 'color-mix(in srgb, var(--color-primary) 12%, white)',
          borderRadius: 2,
          padding: '1px 4px',
          marginBottom: 3,
          letterSpacing: '0.05em',
        }}>
          Asc
        </div>
      )}

      {/* Planets */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
        {planets.map((p) => (
          <Planet
            key={p.name}
            planet={p}
            isSelected={selectedPlanet?.name === p.name}
            onClick={onPlanetClick}
          />
        ))}
      </div>
    </div>
  );
}
