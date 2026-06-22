import { useRef, useState, useCallback } from 'react';

export function useSound() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback((type, level = 1) => {
    if (mutedRef.current) return;
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const tone = (freq, startAt, dur, vol = 0.22, shape = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = shape;
        osc.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(vol, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + dur);
      };

      switch (type) {
        case 'place':
          tone(280, t, 0.07, 0.18);
          tone(200, t + 0.05, 0.05, 0.08);
          break;

        case 'clear':
          // Ascending trio
          tone(370, t,        0.18, 0.22);
          tone(490, t + 0.07, 0.18, 0.22);
          tone(620, t + 0.14, 0.22, 0.22);
          break;

        case 'combo': {
          // More tones the higher the combo, capped at 4
          const count = Math.min(level, 4);
          const freqs = [660, 780, 920, 1080];
          for (let i = 0; i < count; i++) {
            tone(freqs[i], t + i * 0.065, 0.2, 0.2);
          }
          break;
        }

        case 'gameover':
          // Sad descending
          [320, 270, 220, 170].forEach((f, i) => tone(f, t + i * 0.18, 0.28, 0.28));
          break;
      }
    } catch {
      // AudioContext blocked or unavailable — silent fail
    }
  }, [getCtx]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
  }, []);

  return { play, muted, toggleMute };
}
