import { X, Gamepad2, Trophy, Flame, Star, Layers2, Calendar } from 'lucide-react';

function StatItem({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="stat-item">
      <span className="stat-icon" style={{ color: iconColor }}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}

export default function StatsScreen({ onClose }) {
  const raw = localStorage.getItem('bb_stats');
  const stats = raw ? JSON.parse(raw) : {};
  const {
    gamesPlayed   = 0,
    totalScore    = 0,
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
          <StatItem icon={Gamepad2}  iconColor="#a78bfa" label="Ván đã chơi"    value={gamesPlayed.toLocaleString()} />
          <StatItem icon={Trophy}    iconColor="#f59e0b" label="Tổng điểm"      value={totalScore.toLocaleString()} />
          <StatItem icon={Flame}     iconColor="#f43f5e" label="Combo cao nhất" value={`×${bestComboEver}`} />
          <StatItem icon={Star}      iconColor="#eab308" label="Level cao nhất" value={bestLevelEver} />
          <StatItem icon={Layers2}   iconColor="#ec4899" label="Hàng đã xóa"    value={linesCleared.toLocaleString()} />
          <StatItem icon={Calendar}  iconColor="#0891b2" label="Daily đã chơi"  value={dailyPlays} />
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 18 }} onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
