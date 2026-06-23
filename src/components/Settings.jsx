import { useState, useRef } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

export default function Settings({ sfxVolume, setSfxVolume, muted, onToggleMute, onClose }) {
  const [vibration, setVibration]     = useState(() => localStorage.getItem('bb_vibration') !== 'false');
  const [confirmReset, setConfirmReset] = useState(false);
  const resetTimerRef = useRef(null);

  const handleVibration = () => {
    const next = !vibration;
    setVibration(next);
    localStorage.setItem('bb_vibration', String(next));
  };

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      resetTimerRef.current = setTimeout(() => setConfirmReset(false), 3000);
    } else {
      clearTimeout(resetTimerRef.current);
      Object.keys(localStorage)
        .filter(k => k.startsWith('bb_'))
        .forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="modal-title" style={{ margin: 0 }}>Cài đặt</h2>
          <button className="music-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="settings-section">
          <div className="settings-row">
            <span className="settings-label">Âm thanh hiệu ứng</span>
            <button className="settings-mute-btn" onClick={onToggleMute} title={muted ? 'Bật âm' : 'Tắt âm'}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
          {!muted && (
            <div className="settings-vol-row">
              <span className="settings-vol-label">{Math.round(sfxVolume * 100)}%</span>
              <input
                type="range"
                className="music-slider"
                min="0" max="1" step="0.05"
                value={sfxVolume}
                style={{ '--vol': `${sfxVolume * 100}%` }}
                onChange={e => setSfxVolume(parseFloat(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="settings-row">
            <span className="settings-label">Rung (haptic)</span>
            <button
              className={`settings-toggle${vibration ? ' settings-toggle--on' : ''}`}
              onClick={handleVibration}
            >
              {vibration ? 'Bật' : 'Tắt'}
            </button>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 6 }} onClick={onClose}>
          Xong
        </button>

        <button
          className={`settings-reset-btn${confirmReset ? ' settings-reset-btn--confirm' : ''}`}
          onClick={handleResetClick}
        >
          {confirmReset ? '⚠️ Xác nhận xóa tất cả?' : 'Xóa toàn bộ dữ liệu'}
        </button>
      </div>
    </div>
  );
}
