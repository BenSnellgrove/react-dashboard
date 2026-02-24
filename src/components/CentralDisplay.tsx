import { useEffect, useRef, useState } from 'react';

interface CentralDisplayProps {
  gear: string;
  speed: number;
  fps: number;
  frameTime: number;
}

function CentralDisplay({ gear, speed, fps, frameTime }: CentralDisplayProps) {
  const [time, setTime] = useState(new Date());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      id: 'speed',
      title: 'Speed',
      content: (
        <>
          <div className="text-7xl font-audi tracking-tight">{Math.round(speed)}</div>
          <div className="text-gray-400 text-lg tracking-widest">km/h</div>
          <div className="text-gray-300 text-lg">
            <div>{fps.toFixed(0)} FPS</div>
            <div>{frameTime.toFixed(1)} ms</div>
          </div>
          <div className="text-5xl font-semibold tracking-widest">{gear}</div>
          <div className="mt-3 text-gray-500 tracking-wider">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &nbsp; • &nbsp;
            21°C
          </div>
        </>
      ),
    },
    {
      id: 'perf',
      title: 'Performance',
      content: (
        <div className="text-gray-300 text-lg">
          <div>{fps.toFixed(0)} FPS</div>
          <div>{frameTime.toFixed(1)} ms</div>
        </div>
      ),
    },
    {
      id: 'info',
      title: 'Info',
      content: (
        <>
          <div className="text-5xl font-semibold tracking-widest">{gear}</div>
          <div className="mt-3 text-gray-500 tracking-wider">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &nbsp; • &nbsp;
            21°C
          </div>
        </>
      ),
    },
  ];

  const clamp = (v: number) => Math.max(0, Math.min(items.length - 1, v));

  const prev = () => setIndex((i) => clamp(i - 1));
  const next = () => setIndex((i) => clamp(i + 1));

  // stable refs for handlers (used by event listeners)
  const prevRef = useRef(prev);
  const nextRef = useRef(next);
  useEffect(() => {
    prevRef.current = prev;
    nextRef.current = next;
  }, [prev, next]);

  // click halves: left prev, right next
  const onHit = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.4) prev();
    else if (x > rect.width * 0.6) next();
  };

  // keyboard navigation (left/right arrows)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevRef.current();
      else if (e.key === 'ArrowRight') nextRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // wheel scrolljacking: attach to entire window to capture all scroll events
  useEffect(() => {
    let last = 0;
    const THROTTLE_MS = 280;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const now = Date.now();
      if (now - last < THROTTLE_MS) return;
      last = now;

      // vertical scroll -> navigate
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
        if (ev.deltaY > 0) nextRef.current();
        else prevRef.current();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel as EventListener);
  }, []);

  return (
    <div className="w-[400px] text-center flex flex-col items-center justify-center mfd-outline">
      <div className="mfd-menu w-full h-full relative" onClick={onHit}>
        <div className="mfd-slider" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((it) => (
            <div key={it.id} className="mfd-slide">
              {it.content}
            </div>
          ))}
        </div>

        <div className="mfd-dots">
          {items.map((_, i) => (
            <div key={i} className={`mfd-dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>

        {/* invisible hit areas for accessibility + easier clicks */}
        <div className="mfd-hit-left" aria-hidden />
        <div className="mfd-hit-right" aria-hidden />
      </div>
    </div>
  );
}

export { CentralDisplayProps, CentralDisplay };
