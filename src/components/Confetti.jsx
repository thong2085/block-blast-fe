import { useMemo } from 'react';

const COLORS = ['#f43f5e','#f472b6','#fb923c','#fbbf24','#a78bfa','#60a5fa','#4ade80','#fb7185'];

export default function Confetti({ count = 80 }) {
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => {
    const φ = 1.6180339887;
    return {
      id: i,
      left:     ((i * φ) % 1) * 100,
      delay:    (i * 0.045) % 2.5,
      duration: 2.2 + (i % 7) * 0.36,
      w:        7 + (i % 5) * 2,
      h:        i % 3 === 2 ? 4 : 7 + (i % 5) * 2,
      color:    COLORS[i % COLORS.length],
      rot:      (i * 137.5) % 360,
      br:       i % 3 === 0 ? '50%' : '3px',
    };
  }), [count]);

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left:             `${p.left.toFixed(1)}%`,
            width:            p.w,
            height:           p.h,
            background:       p.color,
            borderRadius:     p.br,
            animationDelay:   `${p.delay}s`,
            animationDuration:`${p.duration}s`,
            '--rot':          `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
