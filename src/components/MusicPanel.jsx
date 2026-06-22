import { useState, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Music, Search, Link2, ChevronRight } from 'lucide-react';
import { extractVideoId } from '../hooks/useYouTubePlayer';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY ?? '';

async function searchYouTube(query) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&maxResults=10` +
    `&q=${encodeURIComponent(query)}&key=${API_KEY}`
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message ?? 'API error');
  if (!res.ok)    throw new Error('Search failed');
  return data.items.map(item => ({
    videoId: item.id.videoId,
    title:   item.snippet.title,
    artist:  item.snippet.channelTitle,
    thumb:   item.snippet.thumbnails?.default?.url ?? '',
  }));
}

const QUICK_TAGS = [
  { label: 'Nhạc Lofi Việt',    sub: 'Chill · Nhẹ nhàng',    gradient: 'linear-gradient(135deg,#fda4af,#fb7185)' },
  { label: 'Nhạc Chill',        sub: 'Thư giãn · Tập trung', gradient: 'linear-gradient(135deg,#c4b5fd,#a78bfa)' },
  { label: 'Sơn Tùng M-TP',     sub: 'V-Pop',                 gradient: 'linear-gradient(135deg,#fdba74,#f97316)' },
  { label: 'Đen Vâu',           sub: 'Rap Việt',              gradient: 'linear-gradient(135deg,#6ee7b7,#34d399)' },
  { label: 'Mono',              sub: 'V-Pop · Ballad',        gradient: 'linear-gradient(135deg,#93c5fd,#60a5fa)' },
  { label: 'Vũ Cát Tường',      sub: 'Indie · V-Pop',        gradient: 'linear-gradient(135deg,#f9a8d4,#f472b6)' },
  { label: 'Bích Phương',       sub: 'V-Pop',                 gradient: 'linear-gradient(135deg,#fde68a,#fbbf24)' },
  { label: 'Hoàng Thùy Linh',   sub: 'V-Pop · Dance',        gradient: 'linear-gradient(135deg,#a5f3fc,#22d3ee)' },
  { label: 'Tăng Duy Tân',      sub: 'V-Pop · Ballad',       gradient: 'linear-gradient(135deg,#d8b4fe,#c084fc)' },
  { label: 'Nhạc Bolero',       sub: 'Trữ tình · Quê hương', gradient: 'linear-gradient(135deg,#fca5a5,#f87171)' },
  { label: 'Nhạc Trữ Tình',     sub: 'Ballad · Nhẹ nhàng',  gradient: 'linear-gradient(135deg,#bbf7d0,#4ade80)' },
];

export default function MusicPanel({
  onClose, isReady, isPlaying, hasVideo, volume,
  loadAndPlay, togglePlay, changeVolume,
}) {
  const [tab, setTab]               = useState(API_KEY ? 'search' : 'url');
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [searchErr, setSearchErr]   = useState('');
  const [nowPlaying, setNowPlaying] = useState(null);

  const [url, setUrl]       = useState(() => localStorage.getItem('bb_yt_url') ?? '');
  const [urlErr, setUrlErr] = useState('');

  const handleSearch = useCallback(async (q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSearching(true);
    setSearchErr('');
    setResults([]);
    try {
      setResults(await searchYouTube(trimmed));
    } catch (err) {
      setSearchErr(err.message ?? 'Tìm kiếm thất bại — thử tab "Dán link" nhé!');
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleSelect = useCallback((item) => {
    setNowPlaying(item);
    loadAndPlay(item.videoId);
  }, [loadAndPlay]);

  const handlePastePlay = useCallback(() => {
    const id = extractVideoId(url);
    if (!id) { setUrlErr('Link không hợp lệ — hãy dán link YouTube!'); return; }
    setUrlErr('');
    localStorage.setItem('bb_yt_url', url);
    setNowPlaying({ title: 'Nhạc từ link', artist: '' });
    loadAndPlay(id);
  }, [url, loadAndPlay]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal music-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="music-header">
          <Music size={18} strokeWidth={2} className="music-header-icon" />
          <span className="music-header-title">Nhạc YouTube</span>
          <button className="music-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="music-tabs">
          {API_KEY && (
            <button className={`music-tab${tab === 'search' ? ' music-tab--active' : ''}`} onClick={() => setTab('search')}>
              <Search size={13} strokeWidth={2.5} /> Tìm kiếm
            </button>
          )}
          <button className={`music-tab${tab === 'url' ? ' music-tab--active' : ''}`} onClick={() => setTab('url')}>
            <Link2 size={13} strokeWidth={2.5} /> Dán link
          </button>
        </div>

        {/* ── SEARCH TAB ── */}
        {tab === 'search' && API_KEY && (
          <div className="music-tab-body">
            <div className="music-url-row">
              <input
                className="name-input music-url-input"
                placeholder="Tên bài hát, nghệ sĩ..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                autoFocus
              />
              <button
                className="btn btn-primary music-search-btn"
                onClick={() => handleSearch()}
                disabled={searching || !query.trim()}
                aria-label="Tìm"
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Quick-search list */}
            {!searching && results.length === 0 && !searchErr && (
              <ul className="music-results music-suggestions">
                {QUICK_TAGS.map(tag => (
                  <li key={tag.label}>
                    <div className="music-result-item" onClick={() => handleSearch(tag.label)} style={{ cursor: 'pointer' }}>
                      <span className="music-result-thumb music-suggest-icon" style={{ background: tag.gradient }}>
                        <Music size={20} strokeWidth={2} color="#fff" />
                      </span>
                      <div className="music-result-info">
                        <span className="music-result-title">{tag.label}</span>
                        <span className="music-result-meta">{tag.sub}</span>
                      </div>
                      <ChevronRight size={16} strokeWidth={2} className="music-suggest-arrow" />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {searching && (
              <div className="music-status">
                <span className="music-spinner" /> Đang tìm kiếm...
              </div>
            )}

            {searchErr && <p className="music-search-err">{searchErr}</p>}

            {results.length > 0 && (
              <ul className="music-results">
                {results.map((item, idx) => {
                  const active = nowPlaying?.videoId === item.videoId;
                  return (
                    <li key={item.videoId ?? idx}>
                      <div
                        className={`music-result-item music-result-item--clickable${active ? ' music-result-item--active' : ''}`}
                        onClick={() => handleSelect(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && handleSelect(item)}
                      >
                        {item.thumb ? (
                          <img
                            className="music-result-thumb"
                            src={item.thumb}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <span className="music-result-thumb music-suggest-icon" style={{ background: 'linear-gradient(135deg,#fda4af,#f43f5e)' }}>
                            <Music size={16} strokeWidth={2} color="#fff" />
                          </span>
                        )}
                        <div className="music-result-info">
                          <span className="music-result-title">{item.title}</span>
                          <span className="music-result-meta">{item.artist}</span>
                        </div>
                        <span className="music-result-play-btn" aria-hidden="true">
                          {active && isPlaying
                            ? <Pause size={14} strokeWidth={2.5} />
                            : <Play  size={14} strokeWidth={2.5} />
                          }
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ── URL TAB ── */}
        {tab === 'url' && (
          <div className="music-tab-body">
            {!API_KEY && (
              <p className="music-hint" style={{ margin: 0, textAlign: 'left' }}>
                💡 Để bật tính năng <strong>tìm kiếm nhạc</strong>, thêm dòng này vào file <code>.env</code>:<br />
                <code style={{ color: '#db2777', fontWeight: 700 }}>VITE_YOUTUBE_API_KEY=your_key_here</code>
              </p>
            )}
            <input
              className="name-input"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={e => { setUrl(e.target.value); setUrlErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handlePastePlay()}
              autoFocus
            />
            {urlErr && <p className="form-error" style={{ margin: 0 }}>{urlErr}</p>}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              onClick={handlePastePlay}
              disabled={!isReady}
            >
              <Play size={16} strokeWidth={2.5} />
              {isReady ? 'Phát nhạc' : 'Đang tải...'}
            </button>
          </div>
        )}

        {/* ── PLAYER CONTROLS ── */}
        {hasVideo && (
          <div className="music-controls">
            {nowPlaying && (
              <p className="music-now-playing">
                🎵 <strong>{nowPlaying.title}</strong>
                {nowPlaying.artist && <span> — {nowPlaying.artist}</span>}
              </p>
            )}
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={togglePlay}>
              {isPlaying
                ? <><Pause size={15} strokeWidth={2.5} /> Tạm dừng</>
                : <><Play  size={15} strokeWidth={2.5} /> Tiếp tục</>
              }
            </button>
            <div className="music-volume-row">
              <button className="music-vol-icon" onClick={() => changeVolume(volume === 0 ? 70 : 0)}>
                {volume === 0 ? <VolumeX size={17} strokeWidth={2} /> : <Volume2 size={17} strokeWidth={2} />}
              </button>
              <input
                type="range" min="0" max="100"
                value={volume}
                onChange={e => changeVolume(e.target.value)}
                className="music-slider"
                style={{ '--vol': `${volume}%` }}
              />
              <span className="music-vol-label">{volume}%</span>
            </div>
          </div>
        )}

        <p className="music-hint">Đóng panel này nhạc vẫn phát tiếp trong nền 🎵</p>

      </div>
    </div>
  );
}
