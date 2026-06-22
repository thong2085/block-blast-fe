// Placed cells: 2 pt each
// Line clear bonus: n*(n-1)*100, floor at 100 for n=1
//   1 line  →  100
//   2 lines →  200
//   3 lines →  600
//   4 lines → 1200
//   5 lines → 2000
//   6 lines → 3000
//
// Combo multiplier (applied to clear bonus):
//   1st clear → ×1.0
//   2nd       → ×1.2
//   3rd       → ×1.5
//   4th       → ×2.0
//   5th+      → ×3.0

const COMBO_MULT = [1.0, 1.0, 1.2, 1.5, 2.0, 3.0];

function lineClearBonus(n) {
  return Math.max(100, n * (n - 1) * 100);
}

export function calculateScore(block, clearedRows, clearedCols, combo) {
  const placedScore = block.cells.length * 2;
  const n = clearedRows.length + clearedCols.length;

  if (n === 0) {
    return { gained: placedScore, nextCombo: 0 };
  }

  const nextCombo = combo + 1;
  const mult      = COMBO_MULT[Math.min(nextCombo, COMBO_MULT.length - 1)];

  return {
    gained: placedScore + Math.round(lineClearBonus(n) * mult),
    nextCombo,
  };
}
