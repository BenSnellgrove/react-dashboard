import { useEffect, useRef, useState } from 'react';
import { Tachometer } from './components/Tachometer';
import { CentralDisplay } from './components/CentralDisplay';
import { Speedometer } from './components/Speedometer';

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

        <CentralDisplay gear={currentGear} speed={speed} fps={fps} frameTime={frameTime} />

        <Speedometer setSpeed={setSpeed} setFps={setFps} setFrameTime={setFrameTime} />
      </div>
    </div>
  );
}
