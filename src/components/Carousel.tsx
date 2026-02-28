import React, { useEffect, useRef, useState } from 'react';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  showDots?: boolean;
  initialIndex?: number;
  keyboard?: boolean;
  wheel?: boolean;
  throttle?: number;
}

export default function Carousel({
  children,
  className = '',
  showDots = true,
  initialIndex = 0,
  keyboard = true,
  wheel = true,
  throttle = 280,
}: CarouselProps) {
  const slides = React.Children.toArray(children);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, slides.length - 1)));

  const clamp = (v: number) => Math.max(0, Math.min(slides.length - 1, v));
  const prev = () => setIndex((i) => clamp(i - 1));
  const next = () => setIndex((i) => clamp(i + 1));

  const prevRef = useRef(prev);
  const nextRef = useRef(next);
  useEffect(() => {
    prevRef.current = prev;
    nextRef.current = next;
  }, [prev, next]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // keyboard
  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevRef.current();
      else if (e.key === 'ArrowRight') nextRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keyboard]);

  // wheel scrolljacking on the menu element
  useEffect(() => {
    if (!wheel) return;
    const el = menuRef.current;
    if (!el) return;

    let last = 0;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const now = Date.now();
      if (now - last < throttle) return;
      last = now;
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
        if (ev.deltaY > 0) nextRef.current();
        else prevRef.current();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as EventListener);
  }, [wheel, throttle]);

  const onHit = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.4) prev();
    else if (x > rect.width * 0.6) next();
  };

  return (
    <div className={`mfd-menu w-full h-full relative ${className}`} ref={menuRef} onClick={onHit}>
      <div className="mfd-slider" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} className="mfd-slide">
            {s}
          </div>
        ))}
      </div>

      {showDots && (
        <div className="mfd-dots">
          {slides.map((_, i) => (
            <div key={i} className={`mfd-dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>
      )}

      <div className="mfd-hit-left" aria-hidden />
      <div className="mfd-hit-right" aria-hidden />
    </div>
  );
}
