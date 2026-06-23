import { X } from 'lucide-react';

function StatItem({ icon, label, value }) {
  return (
    <div className="stat-item">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}

export default function StatsScreen({ onClose }) {
  const raw = localStorage.getItem('bb_stats');
  const stats = raw ? JSON.parse(raw) : {};
  const {
    gamesPlayed  = 0,
    totalScore   = 0,
    bestComboEver = 0,
    bestLevelEver = 1,
    linesCleared  = 0,
    dailyPlays    = 0,
  } = stats;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal stats-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="modal-title" style={{ margin: 0 }}>Thống kê</h2>
          <button className="music-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="stats-grid">
          <StatItem icon="🎮" label="Ván đã chơi"     value={gamesPlayed.toLocaleString()} />
          <StatItem icon="🏆" label="Tổng điểm"       value={totalScore.toLocaleString()} />
          <StatItem icon="🔥" label="Combo cao nhất"  value={`×${bestComboEver}`} />
          <StatItem icon="⭐" label="Level cao nhất"  value={bestLevelEver} />
          <StatItem icon="💥" label="Hàng đã xóa"     value={linesCleared.toLocaleString()} />
          <StatItem icon="📅" label="Daily đã chơi"   value={dailyPlays} />
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 18 }} onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
