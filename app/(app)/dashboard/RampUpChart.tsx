type Point = { month: number; actual: number | null; projected: number };

const WIDTH = 640;
const HEIGHT = 220;
const PAD_LEFT = 36;
const PAD_BOTTOM = 24;
const PAD_TOP = 12;
const PAD_RIGHT = 12;

function x(month: number) {
  const usable = WIDTH - PAD_LEFT - PAD_RIGHT;
  return PAD_LEFT + ((month - 1) / 11) * usable;
}

function y(pct: number) {
  const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + usable - (pct / 100) * usable;
}

function linePath(points: { month: number; value: number }[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.month)},${y(p.value)}`).join(" ");
}

export function RampUpChart({ data }: { data: Point[] }) {
  const projectedPath = linePath(data.map((d) => ({ month: d.month, value: d.projected })));
  const actualPoints = data.filter((d): d is Point & { actual: number } => d.actual !== null);
  const actualPath = linePath(actualPoints.map((d) => ({ month: d.month, value: d.actual })));
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Grafik ramp-up utilisasi aktual vs proyeksi 15% ke 65% selama 12 bulan">
      {gridLines.map((g) => (
        <g key={g}>
          <line
            x1={PAD_LEFT}
            x2={WIDTH - PAD_RIGHT}
            y1={y(g)}
            y2={y(g)}
            stroke="#f1e6d6"
            strokeWidth={1}
          />
          <text x={PAD_LEFT - 8} y={y(g) + 3} textAnchor="end" fontSize={10} fill="#8a8171">
            {g}%
          </text>
        </g>
      ))}

      {data.map((d) => (
        <text
          key={d.month}
          x={x(d.month)}
          y={HEIGHT - 6}
          textAnchor="middle"
          fontSize={10}
          fill="#8a8171"
        >
          {d.month}
        </text>
      ))}

      <path d={projectedPath} fill="none" stroke="#c9b89c" strokeWidth={2} strokeDasharray="4 4" />
      {actualPath && <path d={actualPath} fill="none" stroke="#96754a" strokeWidth={2} />}
      {actualPoints.map((d) => (
        <circle key={d.month} cx={x(d.month)} cy={y(d.actual)} r={3} fill="#96754a" />
      ))}
    </svg>
  );
}
