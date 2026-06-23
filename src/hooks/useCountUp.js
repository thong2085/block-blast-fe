import { useState, useEffect, useRef } from 'react';

export function useCountUp(target) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const animRef    = useRef(null);

  useEffect(() => {
    if (animRef.current) clearInterval(animRef.current);
    const prev = displayRef.current;
    if (target <= prev) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }
    const diff  = target - prev;
    const steps = Math.min(20, Math.max(4, Math.ceil(diff / 30)));
    let step = 0;
    animRef.current = setInterval(() => {
      step++;
      if (step >= steps) {
        clearInterval(animRef.current);
        displayRef.current = target;
        setDisplay(target);
      } else {
        const val = Math.round(prev + diff * (step / steps));
        displayRef.current = val;
        setDisplay(val);
      }
    }, Math.min(30, 500 / steps));
    return () => clearInterval(animRef.current);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}
