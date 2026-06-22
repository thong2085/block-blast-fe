export const BOARD_SIZE = 8;

export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

export function canPlace(board, block, startRow, startCol) {
  for (const [dr, dc] of block.cells) {
    const row = startRow + dr;
    const col = startCol + dc;
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;
    if (board[row][col] !== null) return false;
  }
  return true;
}

export function placeBlock(board, block, startRow, startCol) {
  const next = board.map(r => [...r]);
  for (const [dr, dc] of block.cells) {
    next[startRow + dr][startCol + dc] = block.color;
  }
  return next;
}

export function findCompletedLines(board) {
  const completedRows = [];
  const completedCols = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every(cell => cell !== null)) completedRows.push(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    if (board.every(row => row[c] !== null)) completedCols.push(c);
  }

  return { rows: completedRows, cols: completedCols };
}

export function clearLines(board, rows, cols) {
  const next = board.map(r => [...r]);
  for (const r of rows) {
    for (let c = 0; c < BOARD_SIZE; c++) next[r][c] = null;
  }
  for (const c of cols) {
    for (let r = 0; r < BOARD_SIZE; r++) next[r][c] = null;
  }
  return next;
}

export function hasAnyMove(board, blocks) {
  for (const block of blocks) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlace(board, block, r, c)) return true;
      }
    }
  }
  return false;
}

export function isBlockPlaceable(board, block) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, block, r, c)) return true;
    }
  }
  return false;
}

export function getCellsToHighlight(rows, cols) {
  const set = new Set();
  for (const r of rows) {
    for (let c = 0; c < BOARD_SIZE; c++) set.add(`${r},${c}`);
  }
  for (const c of cols) {
    for (let r = 0; r < BOARD_SIZE; r++) set.add(`${r},${c}`);
  }
  return set;
}
