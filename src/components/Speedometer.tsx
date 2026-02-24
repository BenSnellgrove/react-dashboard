import { useEffect, useRef, useState } from 'react';
import { Gauge } from './Gauge';

interface SpeedometerProps {
  setSpeed: (v: number) => void;
  setFps: (v: number) => void;
  setFrameTime: (v: number) => void;
}

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

export { SpeedometerProps, Speedometer };
