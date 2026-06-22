// Target tăng nhẹ — cảm giác mỗi level cần nỗ lực tương đương
const BASE_TARGET = 800;
const SCALE = 1.2;

export function getLevelTarget(level) {
  return Math.round(BASE_TARGET * Math.pow(SCALE, level - 1));
}

// 1 sao: đạt target, 2 sao: 150%, 3 sao: 200%
export function getStars(score, target) {
  if (score >= target * 2)   return 3;
  if (score >= target * 1.5) return 2;
  return 1;
}

// Lưu level cao nhất đã unlock
export function getMaxUnlockedLevel() {
  return Number(localStorage.getItem('bb_max_level') ?? 1);
}

export function saveMaxLevel(level) {
  const current = getMaxUnlockedLevel();
  if (level > current) localStorage.setItem('bb_max_level', level);
}
