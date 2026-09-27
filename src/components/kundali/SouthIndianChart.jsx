/*
 * SouthIndianChart.jsx
 *
 * Renders a traditional South Indian style Kundali chart.
 *
 * South Indian layout — fixed zodiac positions (Rashis never move):
 *
 *  ┌────────┬────────┬────────┬────────┐
 *  │ Pisces │ Aries  │ Taurus │ Gemini │
 *  ├────────┼────────┴────────┼────────┤
 *  │ Aquar. │   (center 2x2) │ Cancer │
 *  ├────────┤                 ├────────┤
 *  │ Capric.│                 │  Leo   │
 *  ├────────┼────────┬────────┼────────┤
 *  │ Sagitt.│Scorpio │ Libra  │  Virgo │
 *  └────────┴────────┴────────┴────────┘
 *
 * Props:
 *   chartData — normalized chart object:
 *     { chart_type, ascendant: { rashi, degree }, planets: [...] }
 *   size     — optional px size for the chart (default: fits container)
 *   title    — optional chart title (e.g. "D1 · Rasi Chart")
 */

import { useState } from 'react';
import RashiCell from './RashiCell';
import PlanetDetails from './PlanetDetails';

// Fixed South Indian grid positions (0-indexed row, col in 4×4 grid).
// Center 2×2 area (rows 1-2, cols 1-2) is always empty/decorative.
const RASHI_GRID = [
  // row, col, rashi name (0-based)
  [0, 0, 'Pisces'],
  [0, 1, 'Aries'],
  [0, 2, 'Taurus'],
  [0, 3, 'Gemini'],
  [1, 3, 'Cancer'],
  [2, 3, 'Leo'],
  [3, 3, 'Virgo'],
  [3, 2, 'Libra'],
  [3, 1, 'Scorpio'],
  [3, 0, 'Sagittarius'],
  [2, 0, 'Capricorn'],
  [1, 0, 'Aquarius'],
];

export default function SouthIndianChart({ chartData, title }) {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  if (!chartData) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
        Kundali chart data not available.
      </div>
    );
  }

  const { ascendant, planets = [] } = chartData;

  // Build a lookup: rashi name → [planets in that rashi]
  const rashiPlanets = {};
  for (const p of planets) {
    const r = p.rashi;
    if (!rashiPlanets[r]) rashiPlanets[r] = [];
    rashiPlanets[r].push(p);
  }

  // Build a 4×4 grid array (null = center/unused cell)
  const grid = Array.from({ length: 4 }, () => Array(4).fill(null));
  for (const [row, col, rashi] of RASHI_GRID) {
    grid[row][col] = rashi;
  }

  const ascRashi = ascendant?.rashi;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {title && (
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          color: 'var(--color-primary)',
          textAlign: 'center',
          margin: 0,
        }}>
          {title}
        </h3>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        border: '2px solid var(--color-primary)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        background: 'var(--color-surface)',
      }}>
        {grid.map((row, r) =>
          row.map((rashi, c) => {
            // Center 2×2 cells — decorative
            const isCenter = r >= 1 && r <= 2 && c >= 1 && c <= 2;
            if (isCenter) {
              // Only render the center once (top-left of the 2×2 block)
              if (r === 1 && c === 1) {
                return (
                  <div
                    key={`center-${r}-${c}`}
                    style={{
                      gridRow: '2 / 4',
                      gridColumn: '2 / 4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--color-gold-faint)',
                      borderLeft: '1px solid var(--color-border)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 28, lineHeight: 1 }}>🪐</div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-gold)',
                        marginTop: 4,
                        fontStyle: 'italic',
                        letterSpacing: '0.05em',
                      }}>
                        Rasi Chart
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // Other center cells are covered by the 2×2 span
            }

            return (
              <RashiCell
                key={`${r}-${c}`}
                rashi={rashi}
                planets={rashiPlanets[rashi] || []}
                isAscendant={rashi === ascRashi}
                row={r}
                col={c}
                selectedPlanet={selectedPlanet}
                onPlanetClick={(planet) =>
                  setSelectedPlanet((prev) =>
                    prev?.name === planet.name ? null : planet
                  )
                }
              />
            );
          })
        )}
      </div>

      {/* Planet detail panel */}
      {selectedPlanet && (
        <PlanetDetails
          planet={selectedPlanet}
          ascendant={ascendant}
          onClose={() => setSelectedPlanet(null)}
        />
      )}
    </div>
  );
}
