import { Trophy, Infinity, Calendar, BarChart2, Cog } from 'lucide-react';

export default function ModeSelect({ onSelect, bestLevel, dailyBest, onStats, onSettings }) {
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
          {bestLevel > 1
            ? <span className="mode-card-record">🏆 Level cao nhất: {bestLevel}</span>
            : <span className="mode-card-hint">Thua thì chơi lại từ Level 1</span>
          }
        </button>

        <button className="mode-card mode-card--classic" onClick={() => onSelect('classic')}>
          <Infinity size={44} strokeWidth={1.8} className="mode-card-icon mode-card-icon--classic" />
          <span className="mode-card-name">Classic</span>
          <span className="mode-card-desc">Chơi không giới hạn</span>
          <span className="mode-card-hint">Cố gắng đạt điểm cao nhất</span>
        </button>

        <button className="mode-card mode-card--daily" onClick={() => onSelect('daily')}>
          <Calendar size={44} strokeWidth={1.8} className="mode-card-icon mode-card-icon--daily" />
          <span className="mode-card-name">Hôm nay</span>
          <span className="mode-card-desc">Thử thách mỗi ngày</span>
          {dailyBest > 0
            ? <span className="mode-card-record mode-card-record--played">✓ {dailyBest.toLocaleString()} điểm</span>
            : <span className="mode-card-hint">Chưa chơi hôm nay</span>
          }
        </button>
      </div>

      <div className="mode-footer">
        <button className="btn btn-ghost-sm" onClick={onStats}>
          <BarChart2 size={14} strokeWidth={2.2} />
          Thống kê
        </button>
        <button className="btn btn-ghost-sm" onClick={onSettings}>
          <Cog size={14} strokeWidth={2.2} />
          Cài đặt
        </button>
      </div>
    </div>
  );
}
