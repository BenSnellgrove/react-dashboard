import { useEffect, useRef, useState } from 'react';

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

const START_ANGLE = -130;
const END_ANGLE = 130;

export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-white">
      <div className="w-[1400px] h-[550px] rounded-3xl bg-gradient-to-b from-[#1b1b1b] to-[#0d0d0d] shadow-[0_30px_120px_rgba(0,0,0,0.9)] p-12 flex items-center justify-between">
        <Tachometer />

        <Speedometer />
      </div>
    </div>
  );
}

/* ===========================
   RPM TACHOMETER
=========================== */

function Tachometer() {
  const [value, setValue] = useState(0);
  const targetRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const sec = new Date().getSeconds();
      targetRef.current = (sec / 59) * 8000;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let frame;
    const animate = () => {
      setValue((prev) => prev + (targetRef.current - prev) * 0.08);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <Gauge label="RPM" value={value} max={8000} redZoneStart={6000} />;
}

/* ===========================
   PERFORMANCE SPEEDOMETER
=========================== */

function Speedometer() {
  const [speed, setSpeed] = useState(0);
  const frameTimes = useRef([]);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let frame;

    const measure = (now) => {
      const delta = now - lastTime.current;
      lastTime.current = now;

      frameTimes.current.push(delta);
      if (frameTimes.current.length > 60) {
        frameTimes.current.shift();
      }

      const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;

      const fps = 1000 / avg;

      // Map FPS (0–60) to speed (0–320 km/h)
      const mappedSpeed = Math.min((fps / 60) * 320, 320);

      setSpeed((prev) => prev + (mappedSpeed - prev) * 0.1);

      frame = requestAnimationFrame(measure);
    };

    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <Gauge label="km/h" value={speed} max={320} redZoneStart={260} />;
}

/* ===========================
   GENERIC GAUGE COMPONENT
=========================== */

function Gauge({ label, value, max, redZoneStart }) {
  const angle = START_ANGLE + (value / max) * (END_ANGLE - START_ANGLE);

  return (
    <div className="relative w-[500px] h-[500px]">
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

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-mono">{Math.round(value)}</div>
        <div className="text-gray-400 tracking-widest mt-2">{label}</div>
      </div>
    </div>
  );
}
