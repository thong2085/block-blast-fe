import { useState, useEffect, useRef } from 'react';

function useCountUp(target) {
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

export default function ScorePanel({ score, bestScore, combo, lastGained, mode, level, levelTarget }) {
  const isLevel    = mode === 'level';
  const progress   = isLevel ? Math.min(score / levelTarget, 1) : 0;
  const displayScore = useCountUp(score);
  const isNewBest  = !isLevel && score > 0 && score >= bestScore;

  return (
    <div className="score-panel">
      {isLevel ? (
        <>
          <div className="score-item score-item--level">
            <span className="score-label">LEVEL</span>
            <span className="score-value score-value--level">{level}</span>
          </div>

          <div className="score-item score-item--progress">
            <div className="progress-header">
              <span className="score-label">ĐIỂM</span>
              <span className="progress-target">{levelTarget.toLocaleString()}</span>
            </div>
            <span className="score-value score-value--sm">
              {displayScore.toLocaleString()}
              {lastGained && lastGained.gained > 0 && (
                <span className="score-gained">+{lastGained.gained}</span>
              )}
            </span>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="score-item">
            <span className="score-label">SCORE</span>
            <span className="score-value">
              {displayScore.toLocaleString()}
              {isNewBest && <span className="new-best-badge">NEW BEST!</span>}
            </span>
            {lastGained && lastGained.gained > 0 && (
              <span className="score-gained">+{lastGained.gained}</span>
            )}
          </div>
          <div className="score-item">
            <span className="score-label">BEST</span>
            <span className="score-value">{bestScore.toLocaleString()}</span>
          </div>
        </>
      )}

      {combo > 1 && (
        <div className="combo-badge">COMBO x{combo}</div>
      )}
    </div>
  );
}
