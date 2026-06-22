const POWERUPS = [
  { key: 'bomb',      icon: '💣', label: 'BOM',   desc: 'Nổ vùng 3×3' },
  { key: 'line',      icon: '⚡', label: 'SÉT',   desc: 'Xóa hàng + cột' },
  { key: 'colorBomb', icon: '🎨', label: 'MÀU',   desc: 'Xóa màu chính' },
];

export default function PowerUpBar({ powerups, activePowerup, onSelect }) {
  return (
    <div className="powerup-bar">
      {POWERUPS.map(({ key, icon, label, desc }) => {
        const count = powerups?.[key] ?? 0;
        const active = activePowerup === key;
        return (
          <button
            key={key}
            className={`powerup-btn${active ? ' powerup-btn--active' : ''}`}
            onClick={() => onSelect(key)}
            disabled={count <= 0}
            title={desc}
          >
            <span className="powerup-icon">{icon}</span>
            <span className="powerup-label">{label}</span>
            <span className="powerup-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
