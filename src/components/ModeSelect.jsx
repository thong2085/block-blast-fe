import { Trophy, Infinity } from 'lucide-react';

export default function ModeSelect({ onSelect }) {
  return (
    <div className="mode-select">
      <div className="mode-title-wrap">
        <h1 className="mode-game-title">Block Blast</h1>
        <p className="mode-subtitle">Chọn chế độ chơi</p>
      </div>

      <div className="mode-cards">
        <button className="mode-card mode-card--level" onClick={() => onSelect('level', 1)}>
          <Trophy size={44} strokeWidth={1.8} className="mode-card-icon mode-card-icon--level" />
          <span className="mode-card-name">Level</span>
          <span className="mode-card-desc">Vượt qua từng màn liên tiếp</span>
          <span className="mode-card-hint">Thua thì chơi lại từ Level 1</span>
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
