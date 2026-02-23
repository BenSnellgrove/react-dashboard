import { useEffect, useRef, useState } from 'react';
import { defaultGearSpeeds } from './gearbox';

function WireframeCockpit() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      {/* OUTER SCREEN */}
      <div className="relative w-[1800px] h-[675px] border-4 border-white text-white">
        {/* TOP BAR */}
        <div className="absolute top-0 left-0 right-0 h-[60px] border-2 border-cyan-400 flex items-center justify-between px-6 text-sm">
          <div>TOP BAR (60px)</div>
          <div>STATUS</div>
        </div>

        {/* BOTTOM BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] border-2 border-yellow-400 flex items-center justify-center text-sm">
          BOTTOM STATUS BAR (60px)
        </div>

        {/* MAIN CONTENT */}
        <div className="absolute top-[60px] bottom-[60px] left-0 right-0 flex">
          {/* LEFT PANEL */}
          <div className="w-[480px] border-2 border-red-500 p-4 text-sm">
            LEFT PANEL (480px)
            <div className="mt-4 border border-red-400 h-[180px] flex items-center justify-center">
              Drive Select Menu
            </div>
          </div>

          {/* CENTER PANEL */}
          <div className="flex-1 border-2 border-green-500 flex items-center justify-center">
            {/* TACH CONTAINER */}
            <div className="relative w-[480px] h-[480px] border-2 border-green-400 rounded-full flex items-center justify-center text-sm">
              TACH OUTER (480×480)
              {/* INNER DIAL */}
              <div className="absolute w-[300px] h-[300px] border-2 border-green-300 rounded-full flex items-center justify-center">
                INNER DIAL (300×300)
              </div>
              {/* NEEDLE */}
              <div className="absolute bottom-1/2 w-[4px] h-[210px] bg-red-500 origin-bottom">
                {/* needle */}
              </div>
              {/* REDLINE ARC ZONE (BOXED) */}
              <div className="absolute top-0 right-0 w-[240px] h-[240px] border-2 border-pink-500 rounded-tr-full">
                RED ARC ZONE
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-[480px] border-2 border-blue-500 p-4 text-sm">
            RIGHT PANEL (480px)
            <div className="mt-4 border border-blue-400 h-[72px] flex items-center justify-center">
              Info Row 1
            </div>
            <div className="mt-4 border border-blue-400 h-[72px] flex items-center justify-center">
              Info Row 2
            </div>
            <div className="mt-4 border border-blue-400 h-[72px] flex items-center justify-center">
              Info Row 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* CENTER PANEL */}
      <div className="flex-1 border-2 border-green-500 flex items-center justify-center">
        {/* TACH CONTAINER */}
        <div className="relative w-[550px] h-[550px] border-2 border-green-400 rounded-full flex items-center justify-center text-sm">
          TACH OUTER (480×480)
          {/* INNER DIAL */}
          <div className="absolute w-[330px] h-[330px] bg-gray-800 border-2 border-green-300 rounded-full flex items-center justify-center">
            INNER DIAL (300×300)
          </div>
          {/* NEEDLE */}
          {(() => {
            function Needle() {
              const ref = useRef<HTMLDivElement | null>(null);
              useEffect(() => {
                let raf = 0;
                const update = () => {
                  const now = new Date();
                  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
                  const angle = (seconds / 60) * 230 - 122;
                  if (ref.current) ref.current.style.transform = `rotate(${angle}deg)`;
                  raf = requestAnimationFrame(update);
                };
                raf = requestAnimationFrame(update);
                return () => cancelAnimationFrame(raf);
              }, []);
              return (
                <div
                  ref={ref}
                  className="absolute bottom-1/2 w-[4px] h-[210px] bg-red-500 origin-bottom transition-transform"
                  style={{ transform: 'rotate(-120deg)' }}
                />
              );
            }
            return <Needle />;
          })()}
          {/* REDLINE ARC ZONE (BOXED) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 480 480"
            xmlns="http://www.w3.org/2000/svg"
          >
            {(() => {
              const cx = 200,
                cy = 200,
                r = 200;
              const start = 100,
                end = 200;
              const toPoint = (angle: number) => {
                const a = ((angle - 90) * Math.PI) / 180;
                return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
              };
              const s = toPoint(start),
                e = toPoint(end);
              const largeArc = Math.abs(end - start) > 180 ? 1 : 0;
              const d = `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
              return (
                <path d={d} stroke="#ec4899" strokeWidth={1} strokeLinecap="square" fill="none" />
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
}
