import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function GameOverModal({ score, bestScore, bestCombo, level, dailyBest, onRestart, mode }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDaily = mode === 'daily';
  const isLevel = mode === 'level';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/scores`, { name: name.trim(), score });
      setSubmitted(true);
    } catch {
      setError('Không thể kết nối server. Thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">
          {isDaily ? `${<Calendar size={20} />} Thử thách hôm nay` : 'Em đã cố gắng rồi 🌸'}
        </h2>
        <div className="modal-scores">
          <div className="modal-score-item">
            <span>Điểm của bạn</span>
            <strong>{score.toLocaleString()}</strong>
          </div>
          {isDaily ? (
            <div className="modal-score-item">
              <span>Best hôm nay</span>
              <strong>{Math.max(score, dailyBest ?? 0).toLocaleString()}</strong>
            </div>
          ) : (
            <div className="modal-score-item">
              <span>Điểm cao nhất</span>
              <strong>{bestScore.toLocaleString()}</strong>
            </div>
          )}
          {isLevel && (
            <div className="modal-score-item">
              <span>Level đạt</span>
              <strong>{level}</strong>
            </div>
          )}
          {bestCombo > 1 && (
            <div className="modal-score-item modal-score-item--combo">
              <span>Combo cao nhất</span>
              <strong>×{bestCombo}</strong>
            </div>
          )}
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="leaderboard-form">
            <p className="form-label">
              {isLevel
                ? 'Chơi lại từ Level 1!'
                : isDaily
                ? 'Lưu điểm daily lên bảng xếp hạng'
                : 'Lưu điểm lên bảng xếp hạng'}
            </p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tên của bạn..."
              maxLength={20}
              className="name-input"
            />
            {error && <p className="form-error">{error}</p>}
            <div className="modal-actions">
              {mode !== 'level' && (
                <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
                  {loading ? 'Đang lưu...' : 'Lưu điểm'}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={onRestart}>
                Chơi lại
              </button>
            </div>
          </form>
        ) : (
          <div className="submit-success">
            <p>Đã lưu điểm!</p>
            <button className="btn btn-primary" onClick={onRestart}>Chơi lại</button>
          </div>
        )}
      </div>
    </div>
  );
}
