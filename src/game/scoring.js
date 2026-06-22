// Block Blast scoring — matches the real game's formula.
//
// Line clear bonus: n*(n-1)*10, floor at 10 for n=1
//   1 line  →  10
//   2 lines →  20
//   3 lines →  60
//   4 lines → 120
//   5 lines → 200
//   6 lines → 300
//
// Combo multiplier (multiplicative, applied to the clear bonus only):
//   1st clear (no prior streak) → ×1.0
//   2nd consecutive            → ×1.2
//   3rd consecutive            → ×1.5
//   4th consecutive            → ×2.0
//   5th+ consecutive           → ×3.0
//
// Placed cells always earn 1 pt each regardless of combo.

const COMBO_MULT = [1.0, 1.0, 1.2, 1.5, 2.0, 3.0];

function lineClearBonus(n) {
  return Math.max(10, n * (n - 1) * 10);
}

export function calculateScore(block, clearedRows, clearedCols, combo) {
  const placedScore = block.cells.length;
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
