import { useRef, useEffect } from 'react';

const COLORS = ['#f43f5e','#fb7185','#f472b6','#fb923c','#fbbf24','#a78bfa','#60a5fa','#4ade80','#34d399'];

export default function ParticlesCanvas({ clearEvent, boardRef }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ pts: [], raf: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    if (!clearEvent?.cells?.size || !boardRef?.current || !canvasRef.current) return;

    const board  = boardRef.current.getBoundingClientRect();
    const cw     = board.width  / 8;
    const ch     = board.height / 8;
    const state  = stateRef.current;
    const PER    = 6; // particles per cell

    clearEvent.cells.forEach(key => {
      const [r, c] = key.split(',').map(Number);
      const cx = board.left + (c + 0.5) * cw;
      const cy = board.top  + (r + 0.5) * ch;
      for (let i = 0; i < PER; i++) {
        const a = (i / PER) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
        const s = 2.5 + Math.random() * 7;
        state.pts.push({
          x: cx, y: cy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 2,
          r: 3 + Math.random() * 4,
          color: COLORS[~~(Math.random() * COLORS.length)],
          life: 1,
          decay: 0.019 + Math.random() * 0.022,
        });
      }
    });

    if (state.raf) return; // already ticking — new pts will be picked up by loop

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      state.pts = state.pts.filter(p => p.life > 0.04);
      for (const p of state.pts) {
        p.x += p.vx;  p.y += p.vy;
        p.vy += 0.28;  p.vx *= 0.984;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.r * p.life), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      state.raf = state.pts.length ? requestAnimationFrame(tick) : null;
    };
    state.raf = requestAnimationFrame(tick);
  }, [clearEvent, boardRef]);

  useEffect(() => () => {
    if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 500, width: '100%', height: '100%' }}
    />
  );
}
