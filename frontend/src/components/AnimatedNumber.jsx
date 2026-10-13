import { useEffect, useRef, useState } from 'react';
export default function AnimatedNumber({ value, formatFn }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, t0 = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min((now - t0) / 500, 1);
      setDisplay(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick); else prev.current = end;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{formatFn(display)}</>;
}
