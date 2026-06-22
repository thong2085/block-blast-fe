import { useState, useCallback, useRef, useEffect } from 'react';
import {
  createEmptyBoard, canPlace, placeBlock,
  findCompletedLines, clearLines, hasAnyMove,
} from '../game/board';
import { calculateScore } from '../game/scoring';
import { generateBlocks } from '../game/generator';

export function useGame(colors) {
  const colorsRef = useRef(colors);
  useEffect(() => { colorsRef.current = colors; }, [colors]);

  const [board, setBoard] = useState(createEmptyBoard);
  const [blocks, setBlocks] = useState(() => generateBlocks(createEmptyBoard(), 0, colors));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bb_best') ?? 0));
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Animation states
  const [placedCells, setPlacedCells] = useState(new Set());
  const [flashCells, setFlashCells] = useState(new Set());
  const [clearedCells, setClearedCells] = useState(new Set());
  const [lastGained, setLastGained] = useState(null);
  const [newBlocksKey, setNewBlocksKey] = useState(0);

  // Drag state (ref so pointer handlers don't need re-registration)
  const dragRef = useRef({ active: false, blockIndex: null });
  const [previewPos, setPreviewPos] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Timer refs — cleared on restart to prevent stale callbacks
  const gameOverTimerRef = useRef(null);
  const lastGainedTimerRef = useRef(null);
  const animTimersRef = useRef([]);

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
    rows.forEach(r => { for (let c = 0; c < 8; c++) cleared.add(`${r},${c}`); });
    cols.forEach(c => { for (let r = 0; r < 8; r++) cleared.add(`${r},${c}`); });

    const finalBoard = hasClear ? clearLines(newBoard, rows, cols) : newBoard;
    const newBlocksList = blocks.map((b, i) => (i === blockIndex ? null : b));
    const allPlaced = newBlocksList.every(b => b === null);
    const nextScore = score + gained;
    const nextBlocks = allPlaced ? generateBlocks(finalBoard, nextScore, colorsRef.current) : newBlocksList;
    const newBest = Math.max(bestScore, nextScore);

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
    setLastGained({ gained, combo: nextCombo });
    lastGainedTimerRef.current = setTimeout(() => setLastGained(null), 1200);

    // --- Commit state ---
    setBoard(finalBoard);
    setBlocks(nextBlocks);
    setScore(nextScore);
    setBestScore(newBest);
    setCombo(hasClear ? nextCombo : 0);
    localStorage.setItem('bb_best', newBest);
    if (allPlaced) setNewBlocksKey(k => k + 1);

    // --- Game over check (cancels any previous pending check) ---
    clearTimeout(gameOverTimerRef.current);
    if (!hasAnyMove(finalBoard, nextBlocks.filter(Boolean))) {
      gameOverTimerRef.current = setTimeout(() => setIsGameOver(true), 600);
    }

    return { cleared: rows.length + cols.length, nextCombo };
  }, [board, blocks, score, bestScore, combo, scheduleAnim]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const restart = useCallback(() => {
    clearAllTimers();
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setBlocks(generateBlocks(emptyBoard, 0, colorsRef.current));
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setIsPaused(false);
    setPlacedCells(new Set());
    setFlashCells(new Set());
    setClearedCells(new Set());
    setLastGained(null);
    setPreviewPos(null);
    setDraggingIndex(null);
    setNewBlocksKey(k => k + 1);
  }, [clearAllTimers]);

  return {
    board, blocks, score, bestScore, combo,
    isGameOver, isPaused,
    placedCells, flashCells, clearedCells,
    lastGained, newBlocksKey,
    previewPos, setPreviewPos,
    draggingIndex, setDraggingIndex,
    dragRef,
    tryPlaceBlock, pause, resume, restart,
  };
}
