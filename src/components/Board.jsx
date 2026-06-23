import { useRef, useState, useMemo } from 'react';
import Cell from './Cell';
import { canPlace } from '../game/board';

const N = 8;

export default function Board({
  board, blocks, draggingIndex, previewPos,
  clearedCells, flashCells, placedCells,
  onBoardPointerLeave,
  boardRef: externalBoardRef,
  activePowerup,
  onPowerupTarget,
  isNearGameOver,
  bgPhoto,
}) {
  const internalRef = useRef(null);
  const boardRef = externalBoardRef ?? internalRef;
  const [hoverCell, setHoverCell] = useState(null);

  const draggingBlock = draggingIndex !== null ? blocks[draggingIndex] : null;

  const { previewCells, previewValid } = (() => {
    if (!draggingBlock || !previewPos) return { previewCells: new Set(), previewValid: false };
    const { row, col } = previewPos;
    const valid = canPlace(board, draggingBlock, row, col);
    const cells = new Set(draggingBlock.cells.map(([dr, dc]) => `${row + dr},${col + dc}`));
    return { previewCells: cells, previewValid: valid };
  })();

  // Cells to highlight during power-up targeting
  const powerupTargetCells = useMemo(() => {
    if (!activePowerup) return new Set();
    const cells = new Set();

    if (activePowerup === 'colorBomb') {
      const counts = {};
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++)
          if (board[r][c]) counts[board[r][c]] = (counts[board[r][c]] || 0) + 1;
      const entries = Object.entries(counts);
      if (entries.length > 0) {
        const target = entries.sort((a, b) => b[1] - a[1])[0][0];
        for (let r = 0; r < N; r++)
          for (let c = 0; c < N; c++)
            if (board[r][c] === target) cells.add(`${r},${c}`);
      }
      return cells;
    }

    if (!hoverCell) return cells;
    const { row, col } = hoverCell;

    if (activePowerup === 'bomb') {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < N && nc >= 0 && nc < N) cells.add(`${nr},${nc}`);
        }
    } else if (activePowerup === 'line') {
      for (let c = 0; c < N; c++) cells.add(`${row},${c}`);
      for (let r = 0; r < N; r++) cells.add(`${r},${col}`);
    }

    return cells;
  }, [activePowerup, hoverCell, board]);

  const handleOverlayMove = (e) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const col = Math.floor((e.clientX - rect.left) / (rect.width / N));
    const row = Math.floor((e.clientY - rect.top) / (rect.height / N));
    if (row >= 0 && row < N && col >= 0 && col < N) setHoverCell({ row, col });
  };

  const handleOverlayDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const col = Math.floor((e.clientX - rect.left) / (rect.width / N));
    const row = Math.floor((e.clientY - rect.top) / (rect.height / N));
    if (row >= 0 && row < N && col >= 0 && col < N) onPowerupTarget?.(row, col);
    setHoverCell(null);
  };

  return (
    <div
      ref={boardRef}
      className={`board${activePowerup ? ' board--targeting' : ''}${isNearGameOver ? ' board--danger' : ''}`}
      data-powerup={activePowerup || undefined}
      onPointerLeave={activePowerup ? () => setHoverCell(null) : onBoardPointerLeave}
      style={bgPhoto ? { background: `linear-gradient(rgba(255,200,220,0.18),rgba(255,200,220,0.18)), url(${bgPhoto}) center/cover` } : undefined}
    >
      {board.map((rowArr, r) =>
        rowArr.map((color, c) => {
          const key = `${r},${c}`;
          const isPreview = previewCells.has(key);
          const isInvalid = isPreview && !previewValid;
          return (
            <Cell
              key={key}
              color={isPreview ? draggingBlock?.color : color}
              isPreview={isPreview && !isInvalid}
              isInvalid={isInvalid}
              isFlashing={flashCells.has(key)}
              isClearing={clearedCells.has(key)}
              isJustPlaced={placedCells.has(key)}
              isPowerupTarget={powerupTargetCells.has(key)}
            />
          );
        })
      )}

      {activePowerup && (
        <div
          className="board-powerup-overlay"
          onPointerMove={handleOverlayMove}
          onPointerLeave={() => setHoverCell(null)}
          onPointerDown={handleOverlayDown}
        />
      )}
    </div>
  );
}
