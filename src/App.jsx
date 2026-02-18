import { useEffect, useState } from 'react';

export default function App() {
  const [seconds, setSeconds] = useState(new Date().getSeconds());

  useEffect(() => {
    const i = setInterval(() => {
      setSeconds(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const progress = seconds / 59;
  const angle = -130 + progress * 260; // realistic tachometer sweep

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-white">
      <div className="w-[1100px] h-[450px] rounded-3xl bg-gradient-to-b from-[#1b1b1b] to-[#0d0d0d] shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-10 flex items-center justify-between">
        {/* LEFT PANEL */}
        <div className="w-1/4 space-y-4">
          <div className="text-gray-400 text-sm tracking-wider">Rundenzeiten</div>

          <div className="text-4xl font-mono">1:32.6</div>

          <div className="text-gray-400 text-sm leading-6">
            Beste Runde&nbsp;&nbsp;1:26.8 <br />
            Runde 6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1:29.1
          </div>

          <button className="mt-4 border border-red-600 text-red-500 px-5 py-2 rounded-md hover:bg-red-600/10 transition">
            Neue Runde
          </button>
        </div>

        {/* CENTER TACHOMETER */}
        <div className="relative w-[420px] h-[420px] flex items-center justify-center">
          {/* Outer metallic ring */}
          <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-[#2b2b2b] to-[#111] shadow-inner"></div>

          {/* Inner dark circle */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-black shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]"></div>

          {/* Tick marks */}
          {Array.from({ length: 10 }).map((_, i) => {
            const deg = -130 + (i / 9) * 260;
            return (
              <div
                key={i}
                className="absolute w-1 h-6 bg-gray-400"
                style={{
                  transform: `rotate(${deg}deg) translateY(-180px)`,
                }}
              />
            );
          })}

          {/* Redline zone */}
          <div className="absolute w-[360px] h-[360px] rounded-full border-[12px] border-transparent border-t-red-600 border-r-yellow-400 rotate-[35deg] opacity-80"></div>

          {/* Needle */}
          <div
            className="absolute w-[4px] h-[160px] bg-red-600 rounded-full shadow-[0_0_20px_red] origin-bottom"
            style={{
              transform: `rotate(${angle}deg) translateY(-50%)`,
              bottom: '50%',
            }}
          />

          {/* Center Hub */}
          <div className="absolute w-[140px] h-[140px] rounded-full bg-gradient-to-b from-[#1f1f1f] to-black flex flex-col items-center justify-center shadow-lg border border-gray-700">
            <div className="text-red-500 font-bold text-2xl tracking-wider">R8</div>

            <div className="text-5xl font-mono mt-2">{Math.floor(progress * 200)}</div>

            <div className="text-gray-400 text-xs">km/h</div>

            <div className="mt-2 text-lg tracking-widest text-gray-300">M3</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/4 flex flex-col gap-8">
          <SideGauge label="Leistung" value={Math.floor(progress * 100)} />
          <SideGauge label="Drehmoment" value={Math.floor(progress * 120)} />
        </div>
      </div>
    </div>
  );
}

function SideGauge({ label, value }) {
  return (
    <div>
      <div className="text-gray-400 text-sm mb-3">{label}</div>

      <div className="relative w-28 h-28">
        {/* background ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>

        {/* active arc */}
        <div
          className="absolute inset-0 rounded-full border-4 border-red-600"
          style={{
            clipPath: `inset(${100 - value}% 0 0 0)`,
          }}
        />

        {/* center value */}
        <div className="absolute inset-0 flex items-center justify-center text-xl font-mono">
          {value}
        </div>
      </div>
    </div>
  );
}
