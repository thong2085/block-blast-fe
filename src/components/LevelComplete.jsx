import { ChevronRight, RotateCcw, Home, Star } from 'lucide-react';
import { getStars, getLevelTarget } from '../game/levels';

function Stars({ count }) {
  return (
    <div className="stars-row">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          size={40}
          strokeWidth={1.5}
          className={`star ${i <= count ? 'star--lit' : 'star--dim'}`}
          fill={i <= count ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function LevelComplete({ level, score, onNext, onRetry, onMenu }) {
  const target     = getLevelTarget(level);
  const stars      = getStars(score, target);
  const nextTarget = getLevelTarget(level + 1).toLocaleString();

  return (
    <div className="modal-overlay">
      <div className="modal modal--level-complete">
        <p className="level-badge">LEVEL {level}</p>
        <h2 className="modal-title modal-title--complete">Hoàn thành!</h2>
        <Stars count={stars} />

        <div className="lc-score-row">
          <span className="lc-label">Điểm đạt được</span>
          <strong className="lc-value">{score.toLocaleString()}</strong>
        </div>
        <div className="lc-score-row lc-score-row--target">
          <span className="lc-label">Mục tiêu Level {level + 1}</span>
          <strong className="lc-value lc-value--muted">{nextTarget}</strong>
        </div>

        <div className="lc-actions">
          <button className="btn btn-primary" onClick={onNext}>
            Level {level + 1}
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
          <button className="btn btn-secondary" onClick={onRetry}>
            <RotateCcw size={14} strokeWidth={2.2} />
            Thử lại
          </button>
          <button className="btn btn-ghost-sm" onClick={onMenu}>
            <Home size={14} strokeWidth={2.2} />
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
