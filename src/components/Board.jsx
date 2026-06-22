import { useRef, useCallback } from 'react';
import Cell from './Cell';
import { BOARD_SIZE, canPlace } from '../game/board';

export default function Board({
  board, blocks, draggingIndex, previewPos,
  clearedCells, flashCells, placedCells,
  onBoardPointerMove, onBoardPointerUp, onBoardPointerLeave,
  boardRef: externalBoardRef,
}) {
  const internalRef = useRef(null);
  const boardRef = externalBoardRef ?? internalRef;

  const draggingBlock = draggingIndex !== null ? blocks[draggingIndex] : null;

  const { previewCells, previewValid } = (() => {
    if (!draggingBlock || !previewPos) return { previewCells: new Set(), previewValid: false };
    const { row, col } = previewPos;
    const valid = canPlace(board, draggingBlock, row, col);
    const cells = new Set(draggingBlock.cells.map(([dr, dc]) => `${row + dr},${col + dc}`));
    return { previewCells: cells, previewValid: valid };
  })();

  const getCoords = useCallback((e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / (rect.width / BOARD_SIZE));
    const row = Math.floor((e.clientY - rect.top) / (rect.height / BOARD_SIZE));
    return { row, col };
  }, []);

  const handlePointerMove = useCallback((e) => {
    // Touch is handled at window level in App (adjusted for ghost visual offset)
    if (!boardRef.current || e.pointerType === 'touch') return;
    const { row, col } = getCoords(e);
    onBoardPointerMove?.(row, col);
  }, [boardRef, getCoords, onBoardPointerMove]);

  const handlePointerUp = useCallback((e) => {
    // Touch is handled at window level in App (adjusted for ghost visual offset)
    if (!boardRef.current || e.pointerType === 'touch') return;
    const { row, col } = getCoords(e);
    onBoardPointerUp?.(row, col);
  }, [boardRef, getCoords, onBoardPointerUp]);

  return (
    <div
      ref={boardRef}
      className="board"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={onBoardPointerLeave}
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
            />
          );
        })
      )}
    </div>
  );
}
