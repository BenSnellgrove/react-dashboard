import { describeArc, polarToCartesian } from '../utils/maths';

// Universal to gauges
const START_ANGLE = -130;
const END_ANGLE = 130;

interface GaugeProps {
  label?: string;
  value: number;
  max: number;
  redZoneStart: number;
  indicatorsCount?: number;
}

function Gauge({ label, value, max, redZoneStart, indicatorsCount = 0 }: GaugeProps) {
  const angle = START_ANGLE + (value / max) * (END_ANGLE - START_ANGLE);

  // Helper to decide state for an indicator: 'off' | 'yellow' | 'red'
  const getLightState = (thresholdFraction: number) => {
    if (value >= redZoneStart) return 'red';
    if (value >= redZoneStart * thresholdFraction) return 'yellow';
    return 'off';
  };

  // Compute symmetric offsets around center so indicators cluster around the middle
  // and spread rate scales with the number of indicators.
  const INDICATOR_RADIUS = 230; // px from center (500x500 viewBox)
  const SPREAD_PER_STEP = 8; // degrees between adjacent indicators

  const middle = (indicatorsCount - 1) / 2;

  const indicatorItems = Array.from({ length: indicatorsCount }).map((_, i) => {
    // offset is centered: e.g. for 5 -> [-2,-1,0,1,2]; for 4 -> [-1.5,-0.5,0.5,1.5]
    const offset = i - middle;

    // angle in degrees relative to vertical (0 = top)
    const angleDeg = indicatorsCount === 1 ? 0 : offset * SPREAD_PER_STEP;

    // thresholds increase with distance from center: center lights illuminate first
    const maxExtra = indicatorsCount === 1 ? 0 : (indicatorsCount - 1) / 2;
    const distanceFactor = maxExtra === 0 ? 0 : Math.abs(offset) / maxExtra; // 0..1
    const thresholdFraction = 0.5 + distanceFactor * 0.45; // 0.5 -> 0.95 from center -> edge

    const state = getLightState(thresholdFraction);
    const pos = polarToCartesian(250, 250, INDICATOR_RADIUS, angleDeg);
    const size = 16;

    return (
      <div
        key={`ind-${i}`}
        className={`indicator indicator-abs ${state}`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: size, height: size }}
        aria-hidden
      />
    );
  });

  return (
    <div className="relative w-[500px] h-[500px] gauge-outline">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Base arc */}
        <path
          d={describeArc(250, 250, 200, START_ANGLE, END_ANGLE)}
          stroke="#333"
          strokeWidth="20"
          fill="none"
        />

        {/* Red zone */}
        <path
          d={describeArc(
            250,
            250,
            200,
            START_ANGLE + (redZoneStart / max) * (END_ANGLE - START_ANGLE),
            END_ANGLE,
          )}
          stroke={`url(#grad-${label})`}
          strokeWidth="20"
          fill="none"
        />

        {/* Ticks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const a = START_ANGLE + (i / 8) * (END_ANGLE - START_ANGLE);

          const outer = polarToCartesian(250, 250, 210, a);
          const inner = polarToCartesian(250, 250, 180, a);

          return (
            <line
              key={i}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="#aaa"
              strokeWidth="3"
            />
          );
        })}

        {/* Tick numbers */}
        {Array.from({ length: 9 }).map((_, i) => {
          const a = START_ANGLE + (i / 8) * (END_ANGLE - START_ANGLE);
          const textPos = polarToCartesian(250, 250, 150, a);
          const labelValue = max === 8000 ? i : Math.round((i / 8) * max);
          return (
            <text
              key={`num-${i}`}
              x={textPos.x}
              y={textPos.y}
              fill="#ddd"
              fontSize="20"
              fontFamily="AudiFont"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {labelValue}
            </text>
          );
        })}

        {/* Needle */}
        <line
          x1="250"
          y1="250"
          x2={polarToCartesian(250, 250, 170, angle).x}
          y2={polarToCartesian(250, 250, 170, angle).y}
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 12px red)' }}
        />

        {/* Hub */}
        <circle cx="250" cy="250" r="18" fill="#111" />
      </svg>

      {/* Curved indicator lights positioned along the top arc */}
      {indicatorItems}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-mono">{Math.round(value)}</div>
        <div className="text-gray-400 tracking-widest mt-2">{label}</div>
      </div>
    </div>
  );
}

export { GaugeProps, Gauge };
