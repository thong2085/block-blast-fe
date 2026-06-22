import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  createEmptyBoard, canPlace, placeBlock,
  findCompletedLines, clearLines, hasAnyMove, isBlockPlaceable,
  BOARD_SIZE,
} from '../game/board';
import { calculateScore } from '../game/scoring';
import { generateBlocks } from '../game/generator';

const POWERUP_INIT = { bomb: 2, line: 1, colorBomb: 1 };

export function useGame(colors) {
  const colorsRef = useRef(colors);
  useEffect(() => { colorsRef.current = colors; }, [colors]);

  const [board, setBoard]         = useState(createEmptyBoard);
  const [blocks, setBlocks]       = useState(() => generateBlocks(createEmptyBoard(), 0, colors));
  const [score, setScore]         = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bb_best') ?? 0));
  const [combo, setCombo]         = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [isNewBest, setIsNewBest]   = useState(false);

  // Power-ups
  const [powerups, setPowerups]         = useState(POWERUP_INIT);
  const [activePowerup, setActivePowerup] = useState(null);
  const initialBestRef = useRef(Number(localStorage.getItem('bb_best') ?? 0));

  // Animation states
  const [placedCells, setPlacedCells]   = useState(new Set());
  const [flashCells, setFlashCells]     = useState(new Set());
  const [clearedCells, setClearedCells] = useState(new Set());
  const [lastGained, setLastGained]     = useState(null);
  const [newBlocksKey, setNewBlocksKey] = useState(0);

  // Drag state (ref so pointer handlers don't need re-registration)
  const dragRef = useRef({ active: false, blockIndex: null });
  const [previewPos, setPreviewPos]       = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Timer refs — cleared on restart to prevent stale callbacks
  const gameOverTimerRef  = useRef(null);
  const lastGainedTimerRef = useRef(null);
  const animTimersRef      = useRef([]);

  const clearAllTimers = useCallback(() => {
    clearTimeout(gameOverTimerRef.current);
    clearTimeout(lastGainedTimerRef.current);
    animTimersRef.current.forEach(clearTimeout);
    animTimersRef.current = [];
  }, []);

  const scheduleAnim = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    animTimersRef.current.push(id);
    return id;
  }, []);

  // Per-block placeable check — recomputed only when board or blocks change
  const placeableBlocks = useMemo(
    () => blocks.map(b => (b ? isBlockPlaceable(board, b) : false)),
    [board, blocks],
  );

  // Returns { cleared, nextCombo } on success, null if placement invalid
  const tryPlaceBlock = useCallback((blockIndex, row, col) => {
    const block = blocks[blockIndex];
    if (!block) return null;
    if (!canPlace(board, block, row, col)) return null;

    const newBoard = placeBlock(board, block, row, col);
    const { rows, cols } = findCompletedLines(newBoard);
    const { gained, nextCombo } = calculateScore(block, rows, cols, combo);
    const hasClear = rows.length > 0 || cols.length > 0;

    const placed = new Set(block.cells.map(([dr, dc]) => `${row + dr},${col + dc}`));

    const cleared = new Set();
    rows.forEach(r => { for (let c = 0; c < BOARD_SIZE; c++) cleared.add(`${r},${c}`); });
    cols.forEach(c => { for (let r = 0; r < BOARD_SIZE; r++) cleared.add(`${r},${c}`); });

    const finalBoard = hasClear ? clearLines(newBoard, rows, cols) : newBoard;

    // Board clear bonus: +3600 if the entire board is empty after clearing
    const boardClearBonus = hasClear && finalBoard.every(r => r.every(c => c === null)) ? 3600 : 0;

    const newBlocksList = blocks.map((b, i) => (i === blockIndex ? null : b));
    const allPlaced = newBlocksList.every(b => b === null);
    const nextScore  = score + gained + boardClearBonus;
    const nextBlocks = allPlaced ? generateBlocks(finalBoard, nextScore, colorsRef.current) : newBlocksList;
    const newBest    = Math.max(bestScore, nextScore);

    // --- Placement pop animation ---
    setPlacedCells(placed);
    scheduleAnim(() => setPlacedCells(new Set()), 300);

    // --- Flash → clear animation sequence ---
    if (hasClear) {
      scheduleAnim(() => {
        setFlashCells(cleared);
        scheduleAnim(() => {
          setFlashCells(new Set());
          setClearedCells(cleared);
          scheduleAnim(() => setClearedCells(new Set()), 380);
        }, 160);
      }, 80);
    }

    // --- Score popup ---
    clearTimeout(lastGainedTimerRef.current);
    setLastGained({ key: Date.now(), gained: gained + boardClearBonus, combo: nextCombo, boardClear: boardClearBonus > 0 });
    lastGainedTimerRef.current = setTimeout(() => setLastGained(null), 1200);

    // --- Best combo this session ---
    if (hasClear && nextCombo > 1) setBestCombo(prev => Math.max(prev, nextCombo));

    // --- New best check ---
    if (nextScore > initialBestRef.current) setIsNewBest(true);

    // --- Earn power-ups on score milestones ---
    const t5000  = Math.floor(nextScore / 5000)  > Math.floor(score / 5000);
    const t10000 = Math.floor(nextScore / 10000) > Math.floor(score / 10000);
    const t20000 = Math.floor(nextScore / 20000) > Math.floor(score / 20000);
    if (t5000 || t10000 || t20000) {
      setPowerups(p => ({
        bomb:      t5000  ? Math.min(p.bomb + 1, 5)      : p.bomb,
        line:      t10000 ? Math.min(p.line + 1, 3)      : p.line,
        colorBomb: t20000 ? Math.min(p.colorBomb + 1, 2) : p.colorBomb,
      }));
    }

    // --- Commit state ---
    setBoard(finalBoard);
    setBlocks(nextBlocks);
    setScore(nextScore);
    setBestScore(newBest);
    setCombo(hasClear ? nextCombo : 0);
    localStorage.setItem('bb_best', newBest);
    if (allPlaced) setNewBlocksKey(k => k + 1);

    // --- Game over check ---
    clearTimeout(gameOverTimerRef.current);
    if (!hasAnyMove(finalBoard, nextBlocks.filter(Boolean))) {
      gameOverTimerRef.current = setTimeout(() => setIsGameOver(true), 600);
    }

    return { cleared: rows.length + cols.length, nextCombo, boardClear: boardClearBonus > 0 };
  }, [board, blocks, score, bestScore, combo, scheduleAnim]);

  const selectPowerup = useCallback((key) => {
    setActivePowerup(prev => (prev === key) ? null : key);
  }, []);

  const firePowerup = useCallback((row, col) => {
    const type = activePowerup;
    if (!type) return false;
    setActivePowerup(null);

    let newBoard = board.map(r => [...r]);
    const cleared = new Set();

    if (type === 'bomb') {
      if (powerups.bomb <= 0) return false;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && newBoard[nr][nc] !== null) {
            newBoard[nr][nc] = null;
            cleared.add(`${nr},${nc}`);
          }
        }
      }
      setPowerups(p => ({ ...p, bomb: p.bomb - 1 }));
    } else if (type === 'line') {
      if (powerups.line <= 0) return false;
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[row][c] !== null) { newBoard[row][c] = null; cleared.add(`${row},${c}`); }
      }
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (newBoard[r][col] !== null) { newBoard[r][col] = null; cleared.add(`${r},${col}`); }
      }
      setPowerups(p => ({ ...p, line: p.line - 1 }));
    } else if (type === 'colorBomb') {
      if (powerups.colorBomb <= 0) return false;
      const counts = {};
      for (let r = 0; r < BOARD_SIZE; r++)
        for (let c = 0; c < BOARD_SIZE; c++)
          if (board[r][c]) counts[board[r][c]] = (counts[board[r][c]] || 0) + 1;
      const entries = Object.entries(counts);
      if (entries.length > 0) {
        const target = entries.sort((a, b) => b[1] - a[1])[0][0];
        for (let r = 0; r < BOARD_SIZE; r++)
          for (let c = 0; c < BOARD_SIZE; c++)
            if (newBoard[r][c] === target) { newBoard[r][c] = null; cleared.add(`${r},${c}`); }
      }
      setPowerups(p => ({ ...p, colorBomb: p.colorBomb - 1 }));
    }

    if (cleared.size === 0) return false;

    // Bonus line-clears triggered by the blast
    const { rows, cols } = findCompletedLines(newBoard);
    if (rows.length > 0 || cols.length > 0) {
      rows.forEach(r => { for (let c = 0; c < BOARD_SIZE; c++) cleared.add(`${r},${c}`); });
      cols.forEach(c => { for (let r = 0; r < BOARD_SIZE; r++) cleared.add(`${r},${c}`); });
      newBoard = clearLines(newBoard, rows, cols);
    }

    scheduleAnim(() => {
      setClearedCells(cleared);
      scheduleAnim(() => setClearedCells(new Set()), 380);
    }, 60);

    setBoard(newBoard);

    clearTimeout(gameOverTimerRef.current);
    const remaining = blocks.filter(Boolean);
    if (remaining.length > 0 && !hasAnyMove(newBoard, remaining)) {
      gameOverTimerRef.current = setTimeout(() => setIsGameOver(true), 600);
    }

    return true;
  }, [activePowerup, board, blocks, powerups, scheduleAnim]);

  // Pause cancels any in-flight drag so the block can't be placed after resume
  const pause = useCallback(() => {
    dragRef.current.active = false;
    setIsPaused(true);
    setDraggingIndex(null);
    setPreviewPos(null);
  }, [dragRef]);

  const resume = useCallback(() => setIsPaused(false), []);

  // Restore from a saved snapshot (used by App.jsx on page-load)
  const restore = useCallback(({ board: b, blocks: bl, score: s, combo: c, powerups: p }) => {
    clearAllTimers();
    dragRef.current = { active: false, blockIndex: null };
    setBoard(b);
    setBlocks(bl);
    setScore(s ?? 0);
    setCombo(c ?? 0);
    setPowerups(p ?? POWERUP_INIT);
    setActivePowerup(null);
    setIsGameOver(false);
    setIsPaused(false);
    setIsNewBest(false);
    setPlacedCells(new Set());
    setFlashCells(new Set());
    setClearedCells(new Set());
    setLastGained(null);
    setPreviewPos(null);
    setDraggingIndex(null);
  }, [clearAllTimers, dragRef]);

  const restart = useCallback(() => {
    clearAllTimers();
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setBlocks(generateBlocks(emptyBoard, 0, colorsRef.current));
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setPowerups(POWERUP_INIT);
    setActivePowerup(null);
    setIsGameOver(false);
    setIsPaused(false);
    setIsNewBest(false);
    initialBestRef.current = Number(localStorage.getItem('bb_best') ?? 0);
    setPlacedCells(new Set());
    setFlashCells(new Set());
    setClearedCells(new Set());
    setLastGained(null);
    setPreviewPos(null);
    setDraggingIndex(null);
    dragRef.current = { active: false, blockIndex: null };
    setNewBlocksKey(k => k + 1);
  }, [clearAllTimers, dragRef]);

  return {
    board, blocks, score, bestScore, combo, bestCombo,
    isGameOver, isPaused, isNewBest,
    placedCells, flashCells, clearedCells,
    lastGained, newBlocksKey,
    previewPos, setPreviewPos,
    draggingIndex, setDraggingIndex,
    dragRef, placeableBlocks,
    powerups, activePowerup,
    tryPlaceBlock, pause, resume, restart, restore,
    selectPowerup, firePowerup,
  };
}
