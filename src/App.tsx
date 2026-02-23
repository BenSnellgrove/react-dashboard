import { useEffect, useRef, useState } from 'react';
import { defaultGearSpeeds } from './gearbox';

function VirtualCockpit({
  speed,
  rpm,
  gear,
  driveMode,
}: {
  speed: number;
  rpm: number;
  gear: string;
  driveMode: string;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="w-[1200px] h-[450px] bg-black text-white relative overflow-hidden">
        <TopBar />

        <div className="grid grid-cols-[320px_1fr_320px] h-full pt-10">
          <DriveSelectMenu active={driveMode} />
          <Tachometer speed={speed} rpm={rpm} gear={gear} driveMode={driveMode} />
          <RightInfoPanel />
        </div>

        <BottomStatusBar />
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <>
      <div className="absolute top-3 left-6 text-sm text-neutral-300">📻 94.3 MHz</div>
      <div className="absolute top-3 right-6 text-sm text-neutral-300">⛽ 360 km</div>
    </>
  );
}

const modes = ['comfort', 'auto', 'dynamic', 'individual'];

function DriveSelectMenu({ active }: { active: string }) {
  return (
    <div className="px-6">
      <h3 className="text-red-500 text-sm mb-3">Audi drive select</h3>

      {modes.map((mode) => (
        <div
          key={mode}
          className={`px-4 py-1 text-sm mb-1 ${
            active === mode ? 'border border-red-500 text-white' : 'text-neutral-400'
          }`}
        >
          {mode}
        </div>
      ))}
    </div>
  );
}

function Tachometer({
  speed,
  rpm,
  gear,
  driveMode,
}: {
  speed: number;
  rpm: number;
  gear: string;
  driveMode: string;
}) {
  return (
    <div className="flex items-center justify-center relative">
      <div className="relative w-[320px] h-[320px] rounded-full border-4 border-neutral-700 flex items-center justify-center">
        {/* Redline arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-red-600 border-t-red-600 rotate-45" />

        <Needle rpm={rpm} />

        <DialInner speed={speed} gear={gear} driveMode={driveMode} />

        <div className="absolute top-2 text-xs text-neutral-400 tracking-widest">
          1 2 3 4 5 6 7 8 9 10
        </div>
      </div>
    </div>
  );
}

function Needle({ rpm }: { rpm: number }) {
  const rpmMax = 10000;
  const rotation = (rpm / rpmMax) * 270 - 135;

  return (
    <div
      className="absolute w-1 h-[140px] bg-red-600 origin-bottom transition-transform duration-300"
      style={{
        transform: `rotate(${rotation}deg) translateY(-10px)`,
      }}
    />
  );
}

function DialInner({ speed, gear, driveMode }: { speed: number; gear: string; driveMode: string }) {
  return (
    <div className="w-[200px] h-[200px] rounded-full bg-black flex flex-col items-center justify-center text-center">
      <span className="text-xs text-neutral-400 tracking-widest">R8</span>

      <span className="text-6xl font-bold">{speed}</span>

      <span className="text-xs text-neutral-400">km/h</span>

      <span className="text-lg mt-1">{gear}</span>

      <span className="text-xs text-neutral-400 mt-1">{driveMode.toUpperCase()}</span>
    </div>
  );
}

function RightInfoPanel() {
  return (
    <div className="px-6 text-sm text-neutral-300 space-y-4">
      <Info label="Range" value="18 km" />
      <Info label="Trip" value="98 km" />
      <Info label="Arrival" value="7:05 p.m." />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-neutral-400">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function BottomStatusBar() {
  return (
    <div className="absolute bottom-2 left-6 right-6 flex justify-between text-xs text-neutral-400">
      <div>98°C</div>
      <div className="text-red-500">⚠</div>
      <div>5:43</div>
      <div>+31.5°C</div>
      <div>99°C</div>
    </div>
  );
}

export default function App() {
  const [speed, setSpeed] = useState(0);
  const [fps, setFps] = useState(0);
  const [frameTime, setFrameTime] = useState(0);
  const [gear, setGear] = useState(1);
  const [time, setTime] = useState(new Date());
  const [rpm, setRpm] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((s) => (s + 1) % 320);
      setRpm((r) => (r + 2) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentGear = `M${gear}`;

  // const gear = `M${(time.getMinutes() % 6) + 1} ${defaultGearSpeeds[(time.getMinutes() % 6) + 1]}`;

  // return (
  //   <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-white">
  //     <div className="w-[1600px] h-[600px] rounded-3xl bg-gradient-to-b from-[#1b1b1b] to-[#0d0d0d] shadow-[0_40px_160px_rgba(0,0,0,0.9)] p-12 flex items-center justify-between">
  //       <Tachometer gear={gear} />

  //       <CenterDisplay gear={currentGear} speed={speed} fps={fps} frameTime={frameTime} />
  //       <Speedometer setSpeed={setSpeed} setFps={setFps} setFrameTime={setFrameTime} />
  //     </div>
  //   </div>
  // );

  return (
    <div>
      <VirtualCockpit speed={speed} rpm={rpm} gear={currentGear} driveMode="D" />
    </div>
  );
}
