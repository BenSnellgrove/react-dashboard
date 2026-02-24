import { useEffect, useRef, useState } from 'react';
import { Gauge } from './Gauge';

interface TachometerProps {
  gear: number | string;
}

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

export { TachometerProps, Tachometer };
