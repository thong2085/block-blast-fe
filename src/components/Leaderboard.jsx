import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Leaderboard({ visible }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    axios.get(`${API_URL}/leaderboard`)
      .then(res => setEntries(res.data.data || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="leaderboard">
      <h3 className="leaderboard-title">Bảng xếp hạng</h3>
      {loading ? (
        <p className="leaderboard-loading">Đang tải...</p>
      ) : entries.length === 0 ? (
        <p className="leaderboard-empty">Chưa có điểm nào. Hãy là người đầu tiên!</p>
      ) : (
        <ol className="leaderboard-list">
          {entries.map((entry, i) => (
            <li key={entry.id} className={`leaderboard-item ${i < 3 ? 'top-' + (i + 1) : ''}`}>
              <span className="rank">{i + 1}</span>
              <span className="player-name">{entry.name}</span>
              <span className="player-score">{Number(entry.score).toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
