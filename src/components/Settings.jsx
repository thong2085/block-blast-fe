import { useState, useRef } from 'react';
import { X, Volume2, VolumeX, ImageIcon, Trash2 } from 'lucide-react';

function resizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let { width: w, height: h } = img;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else        { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Settings({ sfxVolume, setSfxVolume, muted, onToggleMute, bgPhoto, onSetBgPhoto, onClose }) {
  const [vibration, setVibration]       = useState(() => localStorage.getItem('bb_vibration') !== 'false');
  const [confirmReset, setConfirmReset] = useState(false);
  const resetTimerRef = useRef(null);
  const fileInputRef  = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      localStorage.setItem('bb_bg_image', dataUrl);
      onSetBgPhoto(dataUrl);
    } catch { /* silent */ }
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    localStorage.removeItem('bb_bg_image');
    onSetBgPhoto(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="modal-title" style={{ margin: 0 }}>Cài đặt</h2>
          <button className="music-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Background photo */}
        <div className="settings-section">
          <div className="settings-row">
            <span className="settings-label">Ảnh nền</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {bgPhoto && (
                <button className="settings-mute-btn" onClick={handleRemovePhoto} title="Xóa ảnh">
                  <Trash2 size={16} />
                </button>
              )}
              <button className="settings-mute-btn" onClick={() => fileInputRef.current?.click()} title="Chọn ảnh">
                <ImageIcon size={16} />
              </button>
            </div>
          </div>
          {bgPhoto && (
            <div className="settings-bg-preview">
              <img src={bgPhoto} alt="Ảnh nền" className="settings-bg-thumb" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* SFX */}
        <div className="settings-section">
          <div className="settings-row">
            <span className="settings-label">Âm thanh hiệu ứng</span>
            <button className="settings-mute-btn" onClick={onToggleMute}>
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

        {/* Vibration */}
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
