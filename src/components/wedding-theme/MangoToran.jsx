/**
 * MangoToran.jsx
 *
 * A traditional Indian mango-leaf toran (thoranam) rendered in SVG.
 * Used as a decorative header element across key pages and sections.
 *
 * Props:
 *   width       — total width of the toran (default: '100%')
 *   color       — leaf color (default: '#2D6A3F' — deep mango green)
 *   goldColor   — stem / cord color (default: '#C4932A')
 *   density     — 'light' | 'medium' | 'full' (default: 'medium')
 *   style       — additional inline styles
 */

export default function MangoToran({
  width = '100%',
  color = '#2D6A3F',
  goldColor = '#C4932A',
  density = 'medium',
  style = {},
}) {
  const leafCounts = { light: 5, medium: 7, full: 9 };
  const count = leafCounts[density] ?? 7;

  function MangoLeaf({ x, y, angle, size = 1, flip = false }) {
    const scaleX = flip ? -size : size;
    const transform = `translate(${x},${y}) rotate(${angle}) scale(${scaleX},${size})`;
    return (
      <g transform={transform}>
        <path
          d="M0,0 C-8,-18 -14,-34 -6,-52 C0,-62 6,-62 12,-52 C20,-34 8,-18 0,0 Z"
          fill={color}
          opacity={0.9}
        />
        <line x1="0" y1="0" x2="3" y2="-48" stroke="#1A4A2A" strokeWidth="0.8" opacity={0.6} />
        <line x1="3" y1="-15" x2="-5" y2="-22" stroke="#1A4A2A" strokeWidth="0.4" opacity={0.4} />
        <line x1="3" y1="-25" x2="-6" y2="-33" stroke="#1A4A2A" strokeWidth="0.4" opacity={0.4} />
        <line x1="3" y1="-15" x2="10" y2="-22" stroke="#1A4A2A" strokeWidth="0.4" opacity={0.4} />
        <line x1="3" y1="-25" x2="11" y2="-33" stroke="#1A4A2A" strokeWidth="0.4" opacity={0.4} />
        <line x1="0" y1="0" x2="0" y2="10" stroke="#8B6914" strokeWidth="1.2" />
      </g>
    );
  }

  function Marigold({ x, y, size = 1 }) {
    return (
      <g transform={`translate(${x},${y}) scale(${size})`}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <ellipse key={i} cx={0} cy={-7} rx={3} ry={5} fill="#E8830A" transform={`rotate(${a})`} opacity={0.85} />
        ))}
        <circle cx={0} cy={0} r={4} fill="#FFD700" />
        <circle cx={0} cy={0} r={2} fill="#E8480A" />
      </g>
    );
  }

  const svgWidth = 800;
  const svgHeight = 80;
  const cordY = 12;
  const spacing = svgWidth / (count * 2);

  const leaves = [];
  for (let i = 0; i < count * 2 + 1; i++) {
    const xPos = i * spacing;
    const normX = (xPos / svgWidth) * 2 - 1;
    const droop = normX * normX * 20;
    const yPos = cordY + droop;
    const isLeft = i % 2 === 0;
    const angle = isLeft ? -25 : 25;
    if (i % 4 === 2) {
      leaves.push({ type: 'flower', x: xPos, y: yPos + 12, key: `f${i}` });
    } else {
      leaves.push({ type: 'leaf', x: xPos, y: yPos + 12, angle, flip: !isLeft, key: `l${i}` });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width={width}
      height="auto"
      aria-hidden="true"
      role="presentation"
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      <path
        d={`M0,${cordY} Q${svgWidth / 2},${cordY + 18} ${svgWidth},${cordY}`}
        fill="none"
        stroke={goldColor}
        strokeWidth="1.5"
        opacity={0.75}
      />
      {leaves.map((item) =>
        item.type === 'flower' ? (
          <Marigold key={item.key} x={item.x} y={item.y} size={0.85} />
        ) : (
          <MangoLeaf key={item.key} x={item.x} y={item.y} angle={item.angle} flip={item.flip} size={0.88} />
        )
      )}
      <circle cx={0} cy={cordY} r={4} fill={goldColor} opacity={0.8} />
      <circle cx={svgWidth} cy={cordY} r={4} fill={goldColor} opacity={0.8} />
    </svg>
  );
}
