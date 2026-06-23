import { Pause, Play, RotateCcw } from 'lucide-react';

export default function PauseModal({ onResume, onRestart }) {
  return (
    <div className="modal-overlay" onClick={onResume}>
      <div className="modal modal--pause" onClick={e => e.stopPropagation()}>
        <div className="pause-icon-wrap">
          <Pause size={32} strokeWidth={2.5} />
        </div>
        <h2 className="modal-title modal-title--pause">Tạm dừng</h2>
        <p className="modal-hint">Bấm ra ngoài hoặc nhấn Tiếp tục</p>
        <div className="pause-actions">
          <button className="btn btn-primary" onClick={onResume}>
            <Play size={16} strokeWidth={2.5} />
            Tiếp tục
          </button>
          <button className="btn btn-secondary" onClick={onRestart}>
            <RotateCcw size={15} strokeWidth={2.2} />
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
}
