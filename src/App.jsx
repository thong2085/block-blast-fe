import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, BarChart2, Music } from 'lucide-react';
import Board from './components/Board';
import BlockTray from './components/BlockTray';
import ScorePanel from './components/ScorePanel';
import GameOverModal from './components/GameOverModal';
import PauseModal from './components/PauseModal';
import ModeSelect from './components/ModeSelect';
import Leaderboard from './components/Leaderboard';
import BlockPreview from './components/BlockPreview';
import MusicPanel from './components/MusicPanel';
import ParticlesCanvas from './components/ParticlesCanvas';
import PowerUpBar from './components/PowerUpBar';
import ComboEffect from './components/ComboEffect';
import Confetti from './components/Confetti';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { getLevelTarget } from './game/levels';
import { getTheme } from './game/themes';
import { BOARD_SIZE } from './game/board';
import './App.css';

export default function App() {
  const [mode, setMode] = useState(null);
  const [level, setLevel] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [clearEvent, setClearEvent] = useState(null);
  const [comboEvent, setComboEvent] = useState(null);

  const ytPlayer = useYouTubePlayer();

  const levelTarget = getLevelTarget(level);
  const theme = getTheme(mode === 'level' ? level : 1);

  const {
    board, blocks, score, bestScore, combo,
    isGameOver, isPaused,
    placedCells, flashCells, clearedCells,
    lastGained, newBlocksKey,
    previewPos, setPreviewPos,
    draggingIndex, setDraggingIndex,
    dragRef, placeableBlocks,
    powerups, activePowerup,
    tryPlaceBlock, pause, resume, restart, restore,
    selectPowerup, firePowerup,
  } = useGame(theme.colors);

  const { play, muted, toggleMute } = useSound();
  const ghostRef = useRef(null);
  const boardRef = useRef(null);
  const vibrate  = (pattern) => navigator.vibrate?.(pattern);

  useEffect(() => {
    if (mode === 'level' && !levelComplete && !isGameOver && score >= levelTarget) {
      setLevelComplete(true);
      play('clear');
      setTimeout(() => {
        setLevel(l => l + 1);
        setLevelComplete(false);
        restart();
      }, 1500);
    }
  }, [score, mode, levelTarget, levelComplete, isGameOver, level, play, restart]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || isGameOver || levelComplete || !mode) return;
      if (activePowerup) { selectPowerup(activePowerup); return; }
      isPaused ? resume() : pause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPaused, isGameOver, levelComplete, mode, activePowerup, selectPowerup, pause, resume]);

  useEffect(() => {
    if (isGameOver) play('gameover');
  }, [isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (clearedCells.size > 0) setClearEvent({ key: Date.now(), cells: new Set(clearedCells) });
  }, [clearedCells]);

  useEffect(() => {
    if (combo > 1) setComboEvent({ key: Date.now(), count: combo });
  }, [combo]);

  // Bump this whenever block color format changes to invalidate old sessions
  const SESSION_VERSION = 3;

  // Persist mid-game state so closing the tab doesn't lose progress
  useEffect(() => {
    if (!mode || isGameOver || levelComplete) {
      localStorage.removeItem('bb_session');
      return;
    }
    try {
      localStorage.setItem('bb_session', JSON.stringify({ v: SESSION_VERSION, mode, level, board, blocks, score, combo, powerups }));
    } catch {}
  }, [board, blocks, score, combo, mode, level, isGameOver, levelComplete]);

  // Restore on first page-load (runs once, after first render)
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('bb_session') ?? 'null');
      if (!s?.mode || !Array.isArray(s?.board) || s.v !== SESSION_VERSION) {
        localStorage.removeItem('bb_session');
        return;
      }
      setMode(s.mode);
      setLevel(s.level ?? 1);
      restore(s);
    } catch {
      localStorage.removeItem('bb_session');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateGhost = useCallback((x, y) => {
    if (ghostRef.current) {
      ghostRef.current.style.left = `${x}px`;
      ghostRef.current.style.top = `${y}px`;
    }
  }, []);

  const handleBlockPointerDown = useCallback((e, index) => {
    if (isPaused || isGameOver || levelComplete) return;
    if (activePowerup) { selectPowerup(activePowerup); return; }
    e.preventDefault();
    if (e.target.hasPointerCapture?.(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
    dragRef.current = { active: true, blockIndex: index };
    setDraggingIndex(index);
    updateGhost(e.clientX, e.clientY);
    document.body.style.cursor = 'grabbing';
  }, [isPaused, isGameOver, levelComplete, activePowerup, selectPowerup, dragRef, setDraggingIndex, updateGhost]);

  const handleSelectPowerup = useCallback((key) => {
    selectPowerup(key);
    play('powerup');
  }, [selectPowerup, play]);

  const handlePowerupTarget = useCallback((row, col) => {
    const cleared = firePowerup(row, col);
    if (cleared) {
      play('clear');
      vibrate([20, 10, 50]);
    }
  }, [firePowerup, play]);

  // Convert pointer position → board (row, col) using ghost visual top-left corner.
  // Ghost CSS: translate(-50%, -130%), so visual top-left = (clientX - ghostW/2, clientY - ghostH*1.3)
  const getAdjustedCoords = useCallback((clientX, clientY) => {
    if (!boardRef.current) return null;
    const ghostEl  = ghostRef.current;
    const ghostW   = ghostEl?.getBoundingClientRect().width  ?? 0;
    const ghostH   = ghostEl?.getBoundingClientRect().height ?? 0;
    const adjustedX = clientX - ghostW / 2;
    const adjustedY = clientY - ghostH * 1.3;
    const rect = boardRef.current.getBoundingClientRect();
    const col  = Math.floor((adjustedX - rect.left) / (rect.width  / BOARD_SIZE));
    const row  = Math.floor((adjustedY - rect.top)  / (rect.height / BOARD_SIZE));
    return { row, col };
  }, []);

  // Ghost snaps to board cell, then cells pop in
  const snapAndPlace = useCallback((idx, row, col) => {
    setPreviewPos(null);
    dragRef.current.active = false;

    const ghost = ghostRef.current;
    const board = boardRef.current;

    const doPlace = () => {
      document.body.style.cursor = '';
      const result = tryPlaceBlock(idx, row, col);
      setDraggingIndex(null);
      if (!result) return;
      play('place');
      vibrate(12);
      if (result.cleared > 0) {
        setTimeout(() => { play('clear'); vibrate(result.boardClear ? 80 : 35); }, 80);
        if (result.nextCombo > 1) setTimeout(() => { play('combo', result.nextCombo); vibrate([15, 8, 25]); }, 300);
      }
    };

    if (!ghost || !board) { doPlace(); return; }

    const ghostW = ghost.offsetWidth;
    const ghostH = ghost.offsetHeight;
    const boardRect = board.getBoundingClientRect();
    const cellSize  = boardRect.width / BOARD_SIZE;

    // CSS transform: translate(-50%, -130%)
    // visual.left = style.left - ghostW*0.5  →  targetLeft = cell_x + ghostW*0.5
    // visual.top  = style.top  - ghostH*1.3  →  targetTop  = cell_y + ghostH*1.3
    const targetLeft = boardRect.left + col * cellSize + ghostW * 0.5;
    const targetTop  = boardRect.top  + row * cellSize + ghostH * 1.3;

    ghost.style.transition = [
      'left 0.1s cubic-bezier(.3,1.5,.4,1)',
      'top  0.1s cubic-bezier(.3,1.5,.4,1)',
      'transform 0.1s cubic-bezier(.3,1.5,.4,1)',
      'opacity 0.07s ease 0.04s',
    ].join(',');
    void ghost.getBoundingClientRect(); // force reflow so transition fires
    ghost.style.left      = `${targetLeft}px`;
    ghost.style.top       = `${targetTop}px`;
    ghost.style.transform = 'translate(-50%,-130%) scale(0.8)';
    ghost.style.opacity   = '0';

    setTimeout(() => {
      ghost.style.transition = '';
      ghost.style.transform  = '';
      ghost.style.opacity    = '';
      doPlace();
    }, 105);
  }, [dragRef, ghostRef, boardRef, tryPlaceBlock, play, setDraggingIndex, setPreviewPos]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      updateGhost(e.clientX, e.clientY);
      const coords = getAdjustedCoords(e.clientX, e.clientY);
      if (coords && coords.row >= 0 && coords.row < BOARD_SIZE && coords.col >= 0 && coords.col < BOARD_SIZE) {
        setPreviewPos(coords);
      } else {
        setPreviewPos(null);
      }
    };
    const onUp = (e) => {
      if (!dragRef.current.active) return;
      const idx    = dragRef.current.blockIndex;
      const coords = getAdjustedCoords(e.clientX, e.clientY);
      const inBounds = coords &&
        coords.row >= 0 && coords.row < BOARD_SIZE &&
        coords.col >= 0 && coords.col < BOARD_SIZE;
      if (inBounds) {
        snapAndPlace(idx, coords.row, coords.col);
      } else {
        dragRef.current.active = false;
        setDraggingIndex(null);
        setPreviewPos(null);
        document.body.style.cursor = '';
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragRef, setDraggingIndex, setPreviewPos, updateGhost, getAdjustedCoords, snapAndPlace]);

  const handleBoardPointerLeave = useCallback(() => setPreviewPos(null), [setPreviewPos]);

  const handleSelectMode = useCallback((selectedMode, startLevel = 1) => {
    setMode(selectedMode);
    setLevel(startLevel);
    setLevelComplete(false);
    restart();
  }, [restart]);

  const handleRetryLevel = useCallback(() => {
    setLevelComplete(false);
    restart();
  }, [restart]);

  const handleGameOverRestart = useCallback(() => {
    if (mode === 'level') setLevel(1);
    setLevelComplete(false);
    restart();
  }, [mode, restart]);

  const handleBackToMenu = useCallback(() => {
    setMode(null);
    setLevelComplete(false);
    restart();
  }, [restart]);

  const isNearGameOver = !isGameOver && !levelComplete &&
    blocks.some(Boolean) &&
    blocks.every((b, i) => !b || !placeableBlocks[i]);

  const draggingBlock = draggingIndex !== null ? blocks[draggingIndex] : null;

  const themeVars = {
    '--board-bg':     theme.board,
    '--board-empty':  theme.empty,
    '--board-border': theme.border,
    '--theme-accent': theme.accent,
  };

  if (!mode) {
    return (
      <div className="app" data-block="jelly">
        <ModeSelect onSelect={handleSelectMode} />
      </div>
    );
  }

  return (
    <div className="app" style={themeVars} data-block={theme.blockStyle ?? 'classic'}>
      <header className="app-header">
        <button className="btn btn-icon" onClick={handleBackToMenu} title="Menu">
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <h1 className="app-title">
          {mode === 'level' ? `Level ${level}` : 'Block Blast'}
        </h1>
        <div className="header-actions">
          {!isGameOver && !levelComplete && !showLeaderboard && (
            <button
              className="btn btn-icon"
              onClick={isPaused ? resume : pause}
              title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            >
              {isPaused
                ? <Play size={16} strokeWidth={2.5} />
                : <Pause size={16} strokeWidth={2.5} />
              }
            </button>
          )}
          <button className="btn btn-icon" onClick={toggleMute} title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
            {muted
              ? <VolumeX size={16} strokeWidth={2.2} />
              : <Volume2 size={16} strokeWidth={2.2} />
            }
          </button>
          <button
            className={`btn btn-icon${ytPlayer.isPlaying ? ' btn-icon--playing' : ''}`}
            onClick={() => setShowMusic(s => !s)}
            title="Nhạc YouTube"
          >
            <Music size={16} strokeWidth={2.2} />
          </button>
          {mode === 'classic' && (
            <button
              className="btn btn-icon"
              onClick={() => setShowLeaderboard(s => !s)}
              title="Bảng xếp hạng"
            >
              <BarChart2 size={16} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        <ScorePanel
          score={score}
          bestScore={bestScore}
          combo={combo}
          lastGained={lastGained}
          mode={mode}
          level={level}
          levelTarget={levelTarget}
        />

        {showLeaderboard ? (
          <Leaderboard visible={showLeaderboard} />
        ) : (
          <>
            <Board
              board={board}
              blocks={blocks}
              draggingIndex={draggingIndex}
              previewPos={previewPos}
              clearedCells={clearedCells}
              flashCells={flashCells}
              placedCells={placedCells}
              onBoardPointerLeave={handleBoardPointerLeave}
              boardRef={boardRef}
              activePowerup={activePowerup}
              onPowerupTarget={handlePowerupTarget}
              isNearGameOver={isNearGameOver}
            />
            <PowerUpBar
              powerups={powerups}
              activePowerup={activePowerup}
              onSelect={handleSelectPowerup}
            />
            <BlockTray
              blocks={blocks}
              draggingIndex={draggingIndex}
              newBlocksKey={newBlocksKey}
              placeableBlocks={placeableBlocks}
              onBlockPointerDown={handleBlockPointerDown}
            />
          </>
        )}
      </main>

      {draggingBlock && (
        <div ref={ghostRef} className="ghost-block">
          <BlockPreview block={draggingBlock} />
        </div>
      )}

      {isPaused && !isGameOver && !levelComplete && (
        <PauseModal onResume={resume} onRestart={handleRetryLevel} />
      )}
      {isGameOver && !levelComplete && (
        <GameOverModal score={score} bestScore={bestScore} onRestart={handleGameOverRestart} mode={mode} />
      )}
      {showMusic && (
        <MusicPanel
          onClose={() => setShowMusic(false)}
          isReady={ytPlayer.isReady}
          isPlaying={ytPlayer.isPlaying}
          hasVideo={ytPlayer.hasVideo}
          volume={ytPlayer.volume}
          loadAndPlay={ytPlayer.loadAndPlay}
          togglePlay={ytPlayer.togglePlay}
          changeVolume={ytPlayer.changeVolume}
        />
      )}
      <ParticlesCanvas clearEvent={clearEvent} boardRef={boardRef} />
      {comboEvent && <ComboEffect key={comboEvent.key} count={comboEvent.count} />}
      {levelComplete && <Confetti />}
    </div>
  );
}
