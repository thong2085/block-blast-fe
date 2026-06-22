export default function ScorePanel({ score, bestScore, combo, lastGained, mode, level, levelTarget }) {
  const isLevel = mode === 'level';
  const progress = isLevel ? Math.min(score / levelTarget, 1) : 0;

  return (
    <div className="score-panel">
      {isLevel ? (
        <>
          {/* Level mode: level badge + score/target + progress bar */}
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
              {score.toLocaleString()}
              {lastGained && lastGained.gained > 0 && (
                <span className="score-gained">+{lastGained.gained}</span>
              )}
            </span>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Classic mode: score + best score */}
          <div className="score-item">
            <span className="score-label">SCORE</span>
            <span className="score-value">{score.toLocaleString()}</span>
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
