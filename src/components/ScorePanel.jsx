import { useCountUp } from '../hooks/useCountUp';

export default function ScorePanel({ score, bestScore, combo, lastGained, mode, level, levelTarget, dailyBest }) {
  const isLevel   = mode === 'level';
  const isDaily   = mode === 'daily';
  const progress  = isLevel ? Math.min(score / levelTarget, 1) : 0;
  const displayScore = useCountUp(score);
  const isNewBest = !isLevel && !isDaily && score > 0 && score >= bestScore;

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
            <span className="score-label">{isDaily ? 'HÔM NAY' : 'BEST'}</span>
            <span className="score-value">
              {isDaily
                ? Math.max(score, dailyBest ?? 0).toLocaleString()
                : bestScore.toLocaleString()
              }
            </span>
          </div>
        </>
      )}

      {combo > 1 && (
        <div className="combo-badge">COMBO x{combo}</div>
      )}
    </div>
  );
}
