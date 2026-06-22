export function calculateScore(block, clearedRows, clearedCols, combo) {
  const placedScore = block.cells.length;
  const clearedCount = clearedRows.length + clearedCols.length;

  if (clearedCount === 0) {
    return { gained: placedScore, nextCombo: 0 };
  }

  const nextCombo = combo + 1;
  const clearScore = clearedCount * 10;
  const multiBonus = clearedCount * clearedCount * 5;
  const comboBonus = nextCombo * 10;

  return {
    gained: placedScore + clearScore + multiBonus + comboBonus,
    nextCombo,
  };
}
