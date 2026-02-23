import { useEffect, useRef, useState } from 'react';
import { defaultGearSpeeds } from './gearbox';

// Types
type Point = { x: number; y: number };

interface CenterDisplayProps {
  gear: string;
  speed: number;
  fps: number;
  frameTime: number;
}

interface TachometerProps {
  gear: number | string;
}

interface SpeedometerProps {
  setSpeed: (v: number) => void;
  setFps: (v: number) => void;
  setFrameTime: (v: number) => void;
}

interface GaugeProps {
  label?: string;
  value: number;
  max: number;
  redZoneStart: number;
  indicatorsCount?: number;
}

/* ===========================
   SVG MATH HELPERS
=========================== */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): Point {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

const START_ANGLE = -130;
const END_ANGLE = 130;

/* ===========================
   APP LAYOUT
=========================== */

export default function App() {
  const [speed, setSpeed] = useState(0);
  const [fps, setFps] = useState(0);
  const [frameTime, setFrameTime] = useState(0);
  const [gear, setGear] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentGear = `M${gear}`;

  // const gear = `M${(time.getMinutes() % 6) + 1} ${defaultGearSpeeds[(time.getMinutes() % 6) + 1]}`;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-white">
      <div className="w-[1600px] h-[600px] rounded-3xl bg-gradient-to-b from-[#1b1b1b] to-[#0d0d0d] shadow-[0_40px_160px_rgba(0,0,0,0.9)] p-12 flex items-center justify-between">
        <Tachometer gear={gear} />

        <CenterDisplay gear={currentGear} speed={speed} fps={fps} frameTime={frameTime} />

        <Speedometer setSpeed={setSpeed} setFps={setFps} setFrameTime={setFrameTime} />
      </div>
    </div>
  );
}

/* ===========================
   CENTER DISPLAY
=========================== */

function CenterDisplay({ gear, speed, fps, frameTime }: CenterDisplayProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[400px] text-center flex flex-col items-center justify-center mfd-outline">
      {/* Digital Speed */}
      <div className="text-8xl font-audi tracking-tight">{Math.round(speed)}</div>
      <div className="text-gray-400 text-xl tracking-widest mb-8">km/h</div>
      {/* Performance Stats */}
      <div className="flex gap-10 text-gray-400 text-lg">
        <div>{fps.toFixed(0)} FPS</div>
        <div>{frameTime.toFixed(1)} ms</div>
      </div>
      {/* Gear Indicator */}
      <div className="text-6xl font-semibold mt-10 tracking-widest">{gear}</div>
      {/* Clock + Temp */}
      <div className="mt-6 text-gray-500 tracking-wider">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &nbsp; • &nbsp; 21°C
      </div>
    </div>
  );
}

/* ===========================
   RPM TACHOMETER
=========================== */

function Tachometer({ gear }: TachometerProps) {
  const [value, setValue] = useState(0);
  const targetRef = useRef(0);

  useEffect(() => {
    let frame: number;

    const animate = () => {
      // Gear-dependent easing: lower gear = faster rev
      // const gearNum = parseInt(gear.replace('M', ''), 10) || 1;
      // const easeFactor = 1 / gearNum; // M1:0.12, M6:0.02

      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // Calculate continuous fractional seconds (e.g. 12.345)
      const fractionalSeconds = seconds + milliseconds / 1000;

      // Map fractional seconds (0 to 59.999) to RPM (0 to 8000)
      const baseRpm = (fractionalSeconds / 60) * 7000 + 1000;

      const flicker = 7;
      const noise =
        // 50 * Math.sin((fractionalSeconds * 2 * Math.PI) / 3) + // slow wave
        (Math.random() - 0.5) * flicker; // tiny random flicker

      targetRef.current = baseRpm + noise;

      // Smoothly approach target RPM
      setValue((prev) => prev + (targetRef.current - prev) * 0.05);

      // Keep first two digits same
      setValue(3500 + flicker + noise);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [gear]);

  return <Gauge value={value} max={8000} redZoneStart={6000} />;
}

/* ===========================
   PERFORMANCE SPEEDOMETER
=========================== */

function Speedometer({ setSpeed, setFps, setFrameTime }: SpeedometerProps) {
  const [value, setValue] = useState(0);
  const frameTimes = useRef<number[]>([]);
  const lastTime = useRef<number>(performance.now());

  useEffect(() => {
    let frame: number;

    const measure = (now: number) => {
      const delta: number = now - lastTime.current;
      lastTime.current = now;

      frameTimes.current.push(delta);
      if (frameTimes.current.length > 60) {
        frameTimes.current.shift();
      }

      const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;

      const fps = 1000 / avg;

      setFps(fps);
      setFrameTime(avg);

      const mappedSpeed = Math.min((fps / 60) * 320, 320);

      setValue((prev) => prev + (mappedSpeed - prev) * 0.1);
      setSpeed(mappedSpeed);

      frame = requestAnimationFrame(measure);
    };

    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <Gauge value={value} max={320} redZoneStart={260} label={undefined} />;
}

/* ===========================
   GENERIC GAUGE COMPONENT
=========================== */

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
