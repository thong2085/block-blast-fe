import { Bomb, Zap, Palette, Shuffle } from 'lucide-react';

const POWERUPS = [
  { key: 'bomb',      Icon: Bomb,    iconColor: '#6d28d9', label: 'BOM',   desc: 'Nổ 3×3' },
  { key: 'line',      Icon: Zap,     iconColor: '#f59e0b', label: 'SÉT',   desc: 'Xóa hàng+cột' },
  { key: 'colorBomb', Icon: Palette, iconColor: '#ec4899', label: 'MÀU',   desc: 'Xóa cùng màu' },
  { key: 'shuffle',   Icon: Shuffle, iconColor: '#0891b2', label: 'XÁO',   desc: 'Đổi khối mới' },
];

export default function PowerUpBar({ powerups, activePowerup, onSelect }) {
  return (
    <div className="powerup-bar">
      {POWERUPS.map(({ key, Icon, iconColor, label, desc }) => {
        const count  = powerups?.[key] ?? 0;
        const active = activePowerup === key;
        return (
          <button
            key={key}
            className={`powerup-btn${active ? ' powerup-btn--active' : ''}`}
            onClick={() => onSelect(key)}
            disabled={count <= 0}
          >
            <span className="powerup-icon" style={{ color: iconColor }}>
              <Icon size={22} strokeWidth={2} />
            </span>
            <span className="powerup-label">{label}</span>
            <span className="powerup-desc">{desc}</span>
            <span className="powerup-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
