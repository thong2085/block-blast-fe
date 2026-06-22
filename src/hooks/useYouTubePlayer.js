import { useEffect, useRef, useState, useCallback } from 'react';

// Module-level singleton — API script loads only once per page
let _apiState = 'idle'; // 'idle' | 'loading' | 'ready'
const _readyCbs = [];

function ensureYTApi(cb) {
  if (_apiState === 'ready' && window.YT?.Player) { cb(); return; }
  _readyCbs.push(cb);
  if (_apiState === 'idle') {
    _apiState = 'loading';
    window.onYouTubeIframeAPIReady = () => {
      _apiState = 'ready';
      _readyCbs.splice(0).forEach(fn => fn());
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
}

export function extractVideoId(input) {
  if (!input) return null;
  const s = input.trim();
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  return null;
}

const PLAYER_DIV_ID = 'bb-yt-player-container';

export function useYouTubePlayer() {
  const playerRef   = useRef(null);
  const mountedRef  = useRef(true);
  const [isReady,   setIsReady]   = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideo,  setHasVideo]  = useState(false);
  const [volume,    setVolumeState] = useState(
    () => Number(localStorage.getItem('bb_yt_vol') ?? 70)
  );

  useEffect(() => {
    mountedRef.current = true;

    // Create the hidden container if it doesn't exist
    if (!document.getElementById(PLAYER_DIV_ID)) {
      const div = document.createElement('div');
      div.id = PLAYER_DIV_ID;
      div.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;';
      document.body.appendChild(div);
    }

    ensureYTApi(() => {
      if (!mountedRef.current || playerRef.current) return;

      const savedVol = Number(localStorage.getItem('bb_yt_vol') ?? 70);

      playerRef.current = new window.YT.Player(PLAYER_DIV_ID, {
        width: '1',
        height: '1',
        playerVars: { controls: 0, disablekb: 1, fs: 0, rel: 0, iv_load_policy: 3 },
        events: {
          onReady: (e) => {
            e.target.setVolume(savedVol);
            if (mountedRef.current) setIsReady(true);
          },
          onStateChange: (e) => {
            if (!mountedRef.current) return;
            const YT = window.YT.PlayerState;
            setIsPlaying(e.data === YT.PLAYING);
            // Auto-loop when video ends
            if (e.data === YT.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
          onError: () => {
            if (mountedRef.current) setIsPlaying(false);
          },
        },
      });
    });

    return () => { mountedRef.current = false; };
  }, []);

  const loadAndPlay = useCallback((videoId) => {
    if (!playerRef.current) return;
    playerRef.current.loadVideoById(videoId);
    setHasVideo(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else           playerRef.current.playVideo();
  }, [isReady, isPlaying]);

  const changeVolume = useCallback((v) => {
    const num = Number(v);
    setVolumeState(num);
    localStorage.setItem('bb_yt_vol', num);
    playerRef.current?.setVolume(num);
  }, []);

  return { isReady, isPlaying, hasVideo, volume, loadAndPlay, togglePlay, changeVolume };
}
