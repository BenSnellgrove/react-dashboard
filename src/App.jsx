import { useEffect, useRef, useState } from 'react';

const TAU = Math.PI * 2;

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

export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-white">
      <div className="w-[1200px] h-[500px] rounded-3xl bg-gradient-to-b from-[#1b1b1b] to-[#0d0d0d] shadow-[0_30px_120px_rgba(0,0,0,0.9)] p-12 flex items-center justify-between">
        <div className="w-1/4">
          <LeftPanel />
        </div>

        <Tachometer />

        <div className="w-1/4 flex flex-col gap-10">
          <SideGauge label="Leistung" max={100} />
          <SideGauge label="Drehmoment" max={120} />
        </div>
      </div>
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="space-y-5">
      <div className="text-gray-400 tracking-widest text-sm">RUNDENZEITEN</div>

      <div className="text-5xl font-mono">1:32.6</div>

      <div className="text-gray-400 text-sm leading-7">
        Beste Runde&nbsp;&nbsp;1:26.8 <br />
        Runde 6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1:29.1
      </div>

      <button className="mt-6 border border-red-600 text-red-500 px-6 py-2 rounded-md hover:bg-red-600/10 transition">
        Neue Runde
      </button>
    </div>
  );
}

function Tachometer() {
  const [value, setValue] = useState(0);
  const targetRef = useRef(0);

  // target changes every second (0-8000 rpm)
  useEffect(() => {
    const interval = setInterval(() => {
      const sec = new Date().getSeconds();
      targetRef.current = (sec / 59) * 8000;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // smooth animation
  useEffect(() => {
    let frame;
    const animate = () => {
      setValue((prev) => {
        const diff = targetRef.current - prev;
        return prev + diff * 0.08;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const startAngle = -130;
  const endAngle = 130;
  const rpmAngle = startAngle + (value / 8000) * (endAngle - startAngle);

  return (
    <div className="relative w-[500px] h-[500px]">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        <defs>
          <linearGradient id="redZone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* outer arc */}
        <path
          d={describeArc(250, 250, 200, startAngle, endAngle)}
          stroke="#333"
          strokeWidth="20"
          fill="none"
        />

        {/* redline arc */}
        <path
          d={describeArc(250, 250, 200, 60, 130)}
          stroke="url(#redZone)"
          strokeWidth="20"
          fill="none"
        />

        {/* ticks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = startAngle + (i / 8) * (endAngle - startAngle);
          const outer = polarToCartesian(250, 250, 210, angle);
          const inner = polarToCartesian(250, 250, 180, angle);

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

        {/* needle */}
        <line
          x1="250"
          y1="250"
          x2={polarToCartesian(250, 250, 170, rpmAngle).x}
          y2={polarToCartesian(250, 250, 170, rpmAngle).y}
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 12px red)' }}
        />

        {/* center hub */}
        <circle cx="250" cy="250" r="20" fill="#111" />
      </svg>

      {/* center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-red-500 text-2xl font-bold tracking-widest">R8</div>
        <div className="text-6xl font-mono mt-3">{Math.round(value)}</div>
        <div className="text-gray-400 text-sm">rpm</div>
      </div>
    </div>
  );
}

function SideGauge({ label, max }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      const sec = new Date().getSeconds();
      setVal((sec / 59) * max);
    }, 1000);
    return () => clearInterval(i);
  }, [max]);

  const angle = (val / max) * 270 - 135;

  return (
    <div>
      <div className="text-gray-400 mb-3">{label}</div>

      <div className="relative w-36 h-36">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" stroke="#333" strokeWidth="15" fill="none" />
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-2xl font-mono">
          {Math.round(val)}
        </div>
      </div>
    </div>
  );
}
