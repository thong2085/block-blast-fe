import { useRef } from 'react';
import Cell from './Cell';
import { canPlace } from '../game/board';

export default function Board({
  board, blocks, draggingIndex, previewPos,
  clearedCells, flashCells, placedCells,
  onBoardPointerLeave,
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

  return (
    <div
      ref={boardRef}
      className="board"
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
