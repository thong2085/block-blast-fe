import { useRef, useState, useCallback } from 'react';

export function useSound() {
  const ctxRef        = useRef(null);
  const masterGainRef = useRef(null);
  const mutedRef      = useRef(false);
  const sfxVolumeRef  = useRef(() => {
    const v = parseFloat(localStorage.getItem('bb_sfx_vol') ?? '1');
    return isNaN(v) ? 1 : Math.max(0, Math.min(1, v));
  }); // will be initialized below

  // Initialize ref value immediately (can't call inside useRef initializer)
  if (typeof sfxVolumeRef.current === 'function') {
    sfxVolumeRef.current = sfxVolumeRef.current();
  }

  const [muted, setMuted] = useState(false);
  const [sfxVolume, setSfxVolumeState] = useState(sfxVolumeRef.current);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const getMasterGain = useCallback(() => {
    const ctx = getCtx();
    if (!masterGainRef.current) {
      const g = ctx.createGain();
      g.gain.value = sfxVolumeRef.current;
      g.connect(ctx.destination);
      masterGainRef.current = g;
    }
    return masterGainRef.current;
  }, [getCtx]);

  const setSfxVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    sfxVolumeRef.current = clamped;
    if (masterGainRef.current) masterGainRef.current.gain.value = clamped;
    localStorage.setItem('bb_sfx_vol', String(clamped));
    setSfxVolumeState(clamped);
  }, []);

  const play = useCallback((type, level = 1) => {
    if (mutedRef.current) return;
    try {
      const ctx  = getCtx();
      const dest = getMasterGain();
      const t    = ctx.currentTime;

      const tone = (freq, startAt, dur, vol = 0.22, shape = 'sine') => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = shape;
        osc.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(vol, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(startAt);
        osc.stop(startAt + dur + 0.01);
      };

      const burst = (startAt, dur, vol, bandFreq, q = 0.8) => {
        const n   = ~~(ctx.sampleRate * (dur + 0.02));
        const buf = ctx.createBuffer(1, n, ctx.sampleRate);
        const d   = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const flt = ctx.createBiquadFilter();
        flt.type = 'bandpass';
        flt.frequency.value = bandFreq;
        flt.Q.value = q;
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, startAt);
        g.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
        src.connect(flt);
        flt.connect(g);
        g.connect(dest);
        src.start(startAt);
        src.stop(startAt + dur + 0.05);
      };

      switch (type) {

        case 'place':
          burst(t,  0.025, 0.30, 900, 2.0);
          tone(110, t,     0.14, 0.38, 'triangle');
          tone(65,  t,     0.08, 0.22, 'sine');
          break;

        case 'clear':
          burst(t,        0.028, 0.55, 2800, 0.6);
          burst(t + 0.01, 0.022, 0.20, 5200, 1.8);
          burst(t,        0.22,  0.30, 480,  0.45);
          [2100, 1700, 2500, 1350, 2000, 1550].forEach((f, i) => {
            const delay = i * 0.038;
            const osc = ctx.createOscillator();
            const g   = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t + delay);
            osc.frequency.exponentialRampToValueAtTime(f * 0.28, t + delay + 0.55);
            g.gain.setValueAtTime(0.09, t + delay);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.55);
            osc.connect(g);
            g.connect(dest);
            osc.start(t + delay);
            osc.stop(t + delay + 0.62);
          });
          break;

        case 'combo': {
          const count = Math.min(level, 4);
          burst(t, 0.05, 0.18, 2200, 2.5);
          const freqs = [880, 1046, 1244, 1480];
          for (let i = 0; i < count; i++) {
            tone(freqs[i], t + i * 0.07, 0.24, 0.18, 'triangle');
          }
          break;
        }

        case 'gameover':
          [320, 270, 220, 170].forEach((f, i) => tone(f, t + i * 0.18, 0.28, 0.28));
          break;

        case 'powerup':
          tone(550, t,        0.12, 0.22, 'triangle');
          tone(880, t + 0.06, 0.10, 0.18, 'sine');
          burst(t + 0.03, 0.03, 0.12, 3200, 3.5);
          break;

        case 'shuffle':
          tone(660, t,        0.08, 0.18, 'triangle');
          tone(880, t + 0.06, 0.08, 0.15, 'triangle');
          tone(1100, t + 0.12, 0.08, 0.12, 'sine');
          burst(t, 0.04, 0.10, 2400, 2.0);
          break;
      }
    } catch {
      // AudioContext blocked or unavailable — silent fail
    }
  }, [getCtx, getMasterGain]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
  }, []);

  return { play, muted, toggleMute, sfxVolume, setSfxVolume };
}
