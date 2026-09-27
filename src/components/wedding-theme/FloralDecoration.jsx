/**
 * FloralDecoration.jsx
 *
 * Corner/edge floral SVG decoration using marigold, jasmine, and rose motifs.
 * Used to subtly decorate cards, headers, and sections.
 *
 * Props:
 *   position — 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
 *   size     — px size (default: 80)
 *   opacity  — 0–1 (default: 0.65)
 *   style    — extra inline styles
 */

export default function FloralDecoration({
  position = 'top-right',
  size = 80,
  opacity = 0.65,
  style = {},
}) {
  const rotations = {
    'top-left':     0,
    'top-right':    90,
    'bottom-right': 180,
    'bottom-left':  270,
  };
  const rotation = rotations[position] ?? 0;

  // Positioning: absolute corners
  const posStyle = {
    position: 'absolute',
    top:    position.startsWith('top')    ? 0 : undefined,
    bottom: position.startsWith('bottom') ? 0 : undefined,
    left:   position.endsWith('left')     ? 0 : undefined,
    right:  position.endsWith('right')    ? 0 : undefined,
    pointerEvents: 'none',
    opacity,
    zIndex: 0,
    ...style,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      role="presentation"
      style={posStyle}
    >
      <g transform={`rotate(${rotation}, 50, 50)`}>
        {/* Main marigold */}
        <g transform="translate(20,20)">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
            <ellipse
              key={i}
              cx={0} cy={-10}
              rx={4} ry={8}
              fill="#E8830A"
              transform={`rotate(${a})`}
              opacity={0.88}
            />
          ))}
          <circle cx={0} cy={0} r={6} fill="#FFD700" />
          <circle cx={0} cy={0} r={3} fill="#E8480A" />
        </g>

        {/* Small jasmine bud top-right */}
        <g transform="translate(45,12)">
          {[0,72,144,216,288].map((a, i) => (
            <ellipse
              key={i}
              cx={0} cy={-5}
              rx={2.5} ry={4.5}
              fill="#FFF8E7"
              transform={`rotate(${a})`}
              opacity={0.85}
            />
          ))}
          <circle cx={0} cy={0} r={3} fill="#FFD700" opacity={0.9} />
        </g>

        {/* Small jasmine bud bottom-left */}
        <g transform="translate(12,45)">
          {[0,72,144,216,288].map((a, i) => (
            <ellipse
              key={i}
              cx={0} cy={-5}
              rx={2.5} ry={4.5}
              fill="#FFF8E7"
              transform={`rotate(${a})`}
              opacity={0.85}
            />
          ))}
          <circle cx={0} cy={0} r={3} fill="#FFD700" opacity={0.9} />
        </g>

        {/* Curling vines */}
        <path
          d="M5,5 Q20,2 35,15 Q50,28 38,42 Q30,52 18,48 Q8,44 10,32"
          fill="none"
          stroke="#2D6A3F"
          strokeWidth="1.2"
          opacity={0.6}
          strokeLinecap="round"
        />

        {/* Small leaves on vine */}
        <ellipse cx={22} cy={10} rx={5} ry={3} fill="#2D6A3F" opacity={0.7}
          transform="rotate(-30, 22, 10)" />
        <ellipse cx={38} cy={28} rx={5} ry={3} fill="#3A7A4A" opacity={0.65}
          transform="rotate(20, 38, 28)" />
        <ellipse cx={22} cy={42} rx={4} ry={2.5} fill="#2D6A3F" opacity={0.6}
          transform="rotate(-50, 22, 42)" />

        {/* Rose petal cluster */}
        <g transform="translate(50,50)">
          {[0,60,120,180,240,300].map((a, i) => (
            <ellipse
              key={i}
              cx={0} cy={-6}
              rx={3} ry={5.5}
              fill="#C0392B"
              transform={`rotate(${a})`}
              opacity={0.75}
            />
          ))}
          <circle cx={0} cy={0} r={3.5} fill="#E74C3C" opacity={0.9} />
        </g>
      </g>
    </svg>
  );
}
