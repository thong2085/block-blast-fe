import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, BarChart2, Music } from 'lucide-react';
import Board from './components/Board';
import BlockTray from './components/BlockTray';
import ScorePanel from './components/ScorePanel';
import GameOverModal from './components/GameOverModal';
import PauseModal from './components/PauseModal';
import LevelComplete from './components/LevelComplete';
import ModeSelect from './components/ModeSelect';
import Leaderboard from './components/Leaderboard';
import BlockPreview from './components/BlockPreview';
import MusicPanel from './components/MusicPanel';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { getLevelTarget, saveMaxLevel } from './game/levels';
import { getTheme } from './game/themes';
import './App.css';

export default function App() {
  const [mode, setMode] = useState(null);
  const [level, setLevel] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

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
    dragRef, tryPlaceBlock, pause, resume, restart,
  } = useGame(theme.colors);

  const { play, muted, toggleMute } = useSound();
  const ghostRef = useRef(null);

  useEffect(() => {
    if (mode === 'level' && !levelComplete && !isGameOver && score >= levelTarget) {
      setLevelComplete(true);
      saveMaxLevel(level + 1);
      play('clear');
    }
  }, [score, mode, levelTarget, levelComplete, isGameOver, level, play]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || isGameOver || levelComplete || !mode) return;
      isPaused ? resume() : pause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPaused, isGameOver, levelComplete, mode, pause, resume]);

  useEffect(() => {
    if (isGameOver) play('gameover');
  }, [isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateGhost = useCallback((x, y) => {
    if (ghostRef.current) {
      ghostRef.current.style.left = `${x}px`;
      ghostRef.current.style.top = `${y}px`;
    }
  }, []);

  const handleBlockPointerDown = useCallback((e, index) => {
    if (isPaused || isGameOver || levelComplete) return;
    e.preventDefault();
    // Release implicit pointer capture so Board receives pointermove/pointerup on iOS
    if (e.target.hasPointerCapture?.(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
    dragRef.current = { active: true, blockIndex: index };
    setDraggingIndex(index);
    updateGhost(e.clientX, e.clientY);
  }, [isPaused, isGameOver, levelComplete, dragRef, setDraggingIndex, updateGhost]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      updateGhost(e.clientX, e.clientY);
    };
    const onUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      setDraggingIndex(null);
      setPreviewPos(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragRef, setDraggingIndex, setPreviewPos, updateGhost]);

  const handleBoardPointerMove = useCallback((row, col) => {
    if (!dragRef.current.active) return;
    setPreviewPos({ row, col });
  }, [dragRef, setPreviewPos]);

  const handleBoardPointerUp = useCallback((row, col) => {
    if (!dragRef.current.active) return;
    const idx = dragRef.current.blockIndex;
    const result = tryPlaceBlock(idx, row, col);
    dragRef.current.active = false;
    setDraggingIndex(null);
    setPreviewPos(null);
    if (!result) return;
    play('place');
    if (result.cleared > 0) {
      setTimeout(() => play('clear'), 80);
      if (result.nextCombo > 1) setTimeout(() => play('combo', result.nextCombo), 300);
    }
  }, [dragRef, tryPlaceBlock, play, setDraggingIndex, setPreviewPos]);

  const handleBoardPointerLeave = useCallback(() => setPreviewPos(null), [setPreviewPos]);

  const handleSelectMode = useCallback((selectedMode, startLevel = 1) => {
    setMode(selectedMode);
    setLevel(startLevel);
    setLevelComplete(false);
    restart();
  }, [restart]);

  const handleNextLevel = useCallback(() => {
    setLevel(l => l + 1);
    setLevelComplete(false);
    restart();
  }, [restart]);

  const handleRetryLevel = useCallback(() => {
    setLevelComplete(false);
    restart();
  }, [restart]);

  const handleBackToMenu = useCallback(() => {
    setMode(null);
    setLevelComplete(false);
    restart();
  }, [restart]);

  const draggingBlock = draggingIndex !== null ? blocks[draggingIndex] : null;

  const themeVars = {
    '--board-bg':     theme.board,
    '--board-empty':  theme.empty,
    '--board-border': theme.border,
    '--theme-accent': theme.accent,
  };

  if (!mode) {
    return (
      <div className="app">
        <ModeSelect onSelect={handleSelectMode} />
      </div>
    );
  }

  return (
    <div className="app" style={themeVars}>
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
              onBoardPointerMove={handleBoardPointerMove}
              onBoardPointerUp={handleBoardPointerUp}
              onBoardPointerLeave={handleBoardPointerLeave}
            />
            <BlockTray
              blocks={blocks}
              draggingIndex={draggingIndex}
              newBlocksKey={newBlocksKey}
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
      {levelComplete && (
        <LevelComplete level={level} score={score} onNext={handleNextLevel} onRetry={handleRetryLevel} onMenu={handleBackToMenu} />
      )}
      {isGameOver && !levelComplete && (
        <GameOverModal score={score} bestScore={bestScore} onRestart={handleRetryLevel} mode={mode} />
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
    </div>
  );
}
