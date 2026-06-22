import { Trophy, Infinity } from 'lucide-react';
import { getMaxUnlockedLevel, getLevelTarget } from '../game/levels';

export default function ModeSelect({ onSelect }) {
  const maxLevel = getMaxUnlockedLevel();
  const nextTarget = getLevelTarget(maxLevel).toLocaleString();

  return (
    <div className="mode-select">
      <div className="mode-title-wrap">
        <h1 className="mode-game-title">Block Blast</h1>
        <p className="mode-subtitle">Chọn chế độ chơi</p>
      </div>

      <div className="mode-cards">
        <button className="mode-card mode-card--level" onClick={() => onSelect('level', maxLevel)}>
          <Trophy size={44} strokeWidth={1.8} className="mode-card-icon mode-card-icon--level" />
          <span className="mode-card-name">Level</span>
          <span className="mode-card-desc">
            {maxLevel > 1 ? `Tiếp tục từ Level ${maxLevel}` : 'Bắt đầu từ Level 1'}
          </span>
          <span className="mode-card-hint">Mục tiêu: {nextTarget} điểm</span>
        </button>

        <button className="mode-card mode-card--classic" onClick={() => onSelect('classic')}>
          <Infinity size={44} strokeWidth={1.8} className="mode-card-icon mode-card-icon--classic" />
          <span className="mode-card-name">Classic</span>
          <span className="mode-card-desc">Chơi không giới hạn</span>
          <span className="mode-card-hint">Cố gắng đạt điểm cao nhất</span>
        </button>
      </div>
    </div>
  );
}
