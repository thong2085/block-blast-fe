import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, Music, Cog } from 'lucide-react';
import Board from './components/Board';
import BlockTray from './components/BlockTray';
import ScorePanel from './components/ScorePanel';
import GameOverModal from './components/GameOverModal';
import PauseModal from './components/PauseModal';
import ModeSelect from './components/ModeSelect';
import BlockPreview from './components/BlockPreview';
import MusicPanel from './components/MusicPanel';
import ParticlesCanvas from './components/ParticlesCanvas';
import PowerUpBar from './components/PowerUpBar';
import ComboEffect from './components/ComboEffect';
import Confetti from './components/Confetti';
import FloatingScore from './components/FloatingScore';
import LevelComplete from './components/LevelComplete';
import Settings from './components/Settings';
import StatsScreen from './components/StatsScreen';
import TutorialOverlay from './components/TutorialOverlay';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { getLevelTarget } from './game/levels';
import { getTheme } from './game/themes';
import { BOARD_SIZE } from './game/board';
import { getDailyBest, saveDailyScore } from './game/daily';
import './App.css';

export default function App() {
  const [mode, setMode] = useState(null);
  const [level, setLevel] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [clearEvent, setClearEvent] = useState(null);
  const [comboEvent, setComboEvent] = useState(null);
  const [bestLevel, setBestLevel] = useState(() => Number(localStorage.getItem('bb_best_level') ?? 1));
  const [dailyBest, setDailyBest] = useState(getDailyBest);

  const ytPlayer = useYouTubePlayer();

  const levelTarget = getLevelTarget(level);
  const theme = getTheme(mode === 'level' ? level : 1);

  const {
    board, blocks, score, bestScore, combo, bestCombo, totalLinesCleared,
    isGameOver, isPaused,
    placedCells, flashCells, clearedCells,
    lastGained, newBlocksKey,
    previewPos, setPreviewPos,
    draggingIndex, setDraggingIndex,
    dragRef, placeableBlocks,
    powerups, activePowerup,
    tryPlaceBlock, shuffleBlocks, pause, resume, restart, restore,
    selectPowerup, firePowerup,
  } = useGame(theme.colors, mode);

  const { play, muted, toggleMute, sfxVolume, setSfxVolume } = useSound();
  const ghostRef = useRef(null);
  const boardRef = useRef(null);

  const vibrate = useCallback((pattern) => {
    if (localStorage.getItem('bb_vibration') !== 'false') {
      navigator.vibrate?.(pattern);
    }
  }, []);

  // Level complete detection (no auto-advance — modal controls it)
  useEffect(() => {
    if (mode === 'level' && !levelComplete && !isGameOver && score >= levelTarget) {
      setLevelComplete(true); // eslint-disable-line react-hooks/set-state-in-effect
      setComboEvent(null);    // eslint-disable-line react-hooks/set-state-in-effect
      play('clear');
      const nextLvl = level + 1;
      if (nextLvl > bestLevel) {
        setBestLevel(nextLvl); // eslint-disable-line react-hooks/set-state-in-effect
        localStorage.setItem('bb_best_level', nextLvl);
      }
    }
  }, [score, mode, levelTarget, levelComplete, isGameOver, level, play, bestLevel]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || isGameOver || levelComplete || !mode) return;
      if (activePowerup) { selectPowerup(activePowerup); return; }
      isPaused ? resume() : pause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPaused, isGameOver, levelComplete, mode, activePowerup, selectPowerup, pause, resume]);

  // Game over: play sound + save stats
  useEffect(() => {
    if (isGameOver) {
      play('gameover');
      try {
        const raw = localStorage.getItem('bb_stats');
        const stats = raw ? JSON.parse(raw) : {};
        localStorage.setItem('bb_stats', JSON.stringify({
          gamesPlayed:   (stats.gamesPlayed   ?? 0) + 1,
          totalScore:    (stats.totalScore    ?? 0) + score,
          bestComboEver: Math.max(stats.bestComboEver  ?? 0, bestCombo),
          bestLevelEver: Math.max(stats.bestLevelEver  ?? 1, mode === 'level' ? level : 1),
          linesCleared:  (stats.linesCleared  ?? 0) + totalLinesCleared,
          dailyPlays:    (stats.dailyPlays    ?? 0) + (mode === 'daily' ? 1 : 0),
        }));
        if (mode === 'daily') {
          saveDailyScore(score);
          setDailyBest(getDailyBest()); // eslint-disable-line react-hooks/set-state-in-effect
        }
        if (mode === 'level') {
          const nb = Math.max(bestLevel, level);
          if (nb > bestLevel) {
            setBestLevel(nb); // eslint-disable-line react-hooks/set-state-in-effect
            localStorage.setItem('bb_best_level', nb);
          }
        }
      } catch { /* silent */ }
    }
  }, [isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear animation event
  useEffect(() => {
    if (clearedCells.size > 0) setClearEvent({ key: Date.now(), cells: new Set(clearedCells) });
  }, [clearedCells]);

  // Combo event
  useEffect(() => {
    if (combo > 1) setComboEvent({ key: Date.now(), count: combo });
  }, [combo]);

  // Session persistence (skip daily)
  const SESSION_VERSION = 4;
  useEffect(() => {
    if (!mode || mode === 'daily' || isGameOver || levelComplete) {
      localStorage.removeItem('bb_session');
      return;
    }
    try {
      localStorage.setItem('bb_session', JSON.stringify({
        v: SESSION_VERSION, mode, level, board, blocks, score, combo, powerups,
      }));
    } catch {}
  }, [board, blocks, score, combo, mode, level, isGameOver, levelComplete]);

  // Restore on first load
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('bb_session') ?? 'null');
      if (!s?.mode || !Array.isArray(s?.board) || s.v !== SESSION_VERSION || s.mode === 'daily') {
        localStorage.removeItem('bb_session');
        return;
      }
      setMode(s.mode);
      setLevel(s.level ?? 1);
      restore(s);
    } catch { /* corrupted session — clear it */
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
    if (key === 'shuffle') {
      shuffleBlocks();
      play('shuffle');
      vibrate([15, 10, 25]);
      setShuffled(true);
      setTimeout(() => setShuffled(false), 600);
      return;
    }
    selectPowerup(key);
    play('powerup');
  }, [selectPowerup, shuffleBlocks, play, vibrate]);

  const handlePowerupTarget = useCallback((row, col) => {
    const cleared = firePowerup(row, col);
    if (cleared) {
      play('clear');
      vibrate([20, 10, 50]);
    }
  }, [firePowerup, play, vibrate]);

  const getAdjustedCoords = useCallback((clientX, clientY) => {
    if (!boardRef.current) return null;
    const ghostEl = ghostRef.current;
    const ghostW  = ghostEl?.getBoundingClientRect().width  ?? 0;
    const ghostH  = ghostEl?.getBoundingClientRect().height ?? 0;
    const adjustedX = clientX - ghostW / 2;
    const adjustedY = clientY - ghostH * 1.3;
    const rect = boardRef.current.getBoundingClientRect();
    const col  = Math.floor((adjustedX - rect.left) / (rect.width  / BOARD_SIZE));
    const row  = Math.floor((adjustedY - rect.top)  / (rect.height / BOARD_SIZE));
    return { row, col };
  }, []);

  const snapAndPlace = useCallback((idx, row, col) => {
    setPreviewPos(null);
    dragRef.current.active = false;

    const ghost = ghostRef.current;
    const boardEl = boardRef.current;

    const doPlace = () => {
      document.body.style.cursor = '';
      const result = tryPlaceBlock(idx, row, col);
      setDraggingIndex(null);
      if (!result) return;
      play('place');
      vibrate(10);
      if (result.cleared > 0) {
        setTimeout(() => {
          play('clear');
          vibrate(result.boardClear ? [60, 20, 100, 20, 150] : [30, 15, 30]);
        }, 80);
        if (result.nextCombo > 1) setTimeout(() => { play('combo', result.nextCombo); vibrate([20, 10, 35, 10, 55]); }, 300);
      }
    };

    if (!ghost || !boardEl) { doPlace(); return; }

    const ghostW = ghost.offsetWidth;
    const ghostH = ghost.offsetHeight;
    const boardRect = boardEl.getBoundingClientRect();
    const cellSize  = boardRect.width / BOARD_SIZE;

    const targetLeft = boardRect.left + col * cellSize + ghostW * 0.5;
    const targetTop  = boardRect.top  + row * cellSize + ghostH * 1.3;

    ghost.style.transition = [
      'left 0.1s cubic-bezier(.3,1.5,.4,1)',
      'top  0.1s cubic-bezier(.3,1.5,.4,1)',
      'transform 0.1s cubic-bezier(.3,1.5,.4,1)',
      'opacity 0.07s ease 0.04s',
    ].join(',');
    void ghost.getBoundingClientRect();
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
  }, [dragRef, ghostRef, boardRef, tryPlaceBlock, play, setDraggingIndex, setPreviewPos, vibrate]);

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

  const resetTransientUI = useCallback(() => {
    setComboEvent(null);
    setClearEvent(null);
  }, []);

  const handleSelectMode = useCallback((selectedMode, startLevel = 1) => {
    setMode(selectedMode);
    setLevel(startLevel);
    setLevelComplete(false);
    resetTransientUI();
    restart(selectedMode);
    if (!localStorage.getItem('bb_tutorial_done')) {
      setShowTutorial(true);
    }
  }, [restart, resetTransientUI]);

  const handleRetryLevel = useCallback(() => {
    setLevelComplete(false);
    resetTransientUI();
    restart(mode);
  }, [restart, resetTransientUI, mode]);

  const handleGameOverRestart = useCallback(() => {
    if (mode === 'level') setLevel(1);
    setLevelComplete(false);
    resetTransientUI();
    restart(mode);
  }, [mode, restart, resetTransientUI]);

  const handleBackToMenu = useCallback(() => {
    setMode(null);
    setLevelComplete(false);
    resetTransientUI();
    restart(null);
  }, [restart, resetTransientUI]);

  // Level complete → next level (manual via modal button)
  const handleLevelNext = useCallback(() => {
    setLevel(l => l + 1);
    setLevelComplete(false);
    resetTransientUI();
    restart(mode);
  }, [mode, restart, resetTransientUI]);

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
        <ModeSelect
          onSelect={handleSelectMode}
          bestLevel={bestLevel}
          dailyBest={dailyBest}
          onStats={() => setShowStats(true)}
          onSettings={() => setShowSettings(true)}
        />
        {showStats && <StatsScreen onClose={() => setShowStats(false)} />}
        {showSettings && (
          <Settings
            sfxVolume={sfxVolume}
            setSfxVolume={setSfxVolume}
            muted={muted}
            onToggleMute={toggleMute}
            onClose={() => setShowSettings(false)}
          />
        )}
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
          {mode === 'level' ? `Level ${level}` : mode === 'daily' ? '📅 Hôm nay' : 'Block Blast'}
        </h1>
        <div className="header-actions">
          {!isGameOver && !levelComplete && (
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
          <button
            className="btn btn-icon"
            onClick={() => setShowSettings(s => !s)}
            title="Cài đặt"
          >
            <Cog size={16} strokeWidth={2.2} />
          </button>
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
          dailyBest={dailyBest}
        />

        {(
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
              shuffled={shuffled}
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
      {lastGained && lastGained.gained > 0 && (
        <FloatingScore
          key={lastGained.key}
          gained={lastGained.gained}
          combo={lastGained.combo}
          boardClear={lastGained.boardClear}
          boardRef={boardRef}
        />
      )}
      {isGameOver && !levelComplete && (
        <GameOverModal
          score={score}
          bestScore={bestScore}
          bestCombo={bestCombo}
          level={level}
          dailyBest={dailyBest}
          onRestart={handleGameOverRestart}
          mode={mode}
        />
      )}
      {levelComplete && !isGameOver && (
        <LevelComplete
          level={level}
          score={score}
          onNext={handleLevelNext}
          onRetry={handleRetryLevel}
          onMenu={handleBackToMenu}
        />
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
      {showSettings && (
        <Settings
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
          muted={muted}
          onToggleMute={toggleMute}
          onClose={() => setShowSettings(false)}
        />
      )}
      <ParticlesCanvas clearEvent={clearEvent} boardRef={boardRef} />
      {comboEvent && <ComboEffect key={comboEvent.key} count={comboEvent.count} />}
      {levelComplete && <Confetti />}
      {showTutorial && <TutorialOverlay onDone={() => setShowTutorial(false)} />}
    </div>
  );
}
