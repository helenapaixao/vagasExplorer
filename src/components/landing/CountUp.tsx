import React, { useEffect, useState } from 'react';

interface CountUpProps {
  value: number;
  durationMs?: number;
}

/** Ease-out: fast at the start, settling on the final number. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CountUp: React.FC<CountUpProps> = ({ value, durationMs = 900 }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(easeOut(progress) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return <>{display.toLocaleString('pt-BR')}</>;
};

export default CountUp;
