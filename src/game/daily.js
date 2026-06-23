export function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getTodayKey() {
  const d = new Date();
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  return `${Y}-${M}-${D}`;
}

export function getTodaySeed() {
  const key = getTodayKey();
  let h = 0x12345678;
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function getDailyBest() {
  const v = parseInt(localStorage.getItem(`bb_daily_${getTodayKey()}`) ?? '0', 10);
  return isNaN(v) ? 0 : v;
}

export function saveDailyScore(score) {
  const key = `bb_daily_${getTodayKey()}`;
  const prev = getDailyBest();
  if (score > prev) localStorage.setItem(key, String(score));
}

export function getStreak() {
  return parseInt(localStorage.getItem('bb_streak_count') ?? '0', 10) || 0;
}

export function updateStreak() {
  const today = getTodayKey();
  const last  = localStorage.getItem('bb_streak_last');
  if (last === today) return;

  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const next = last === yesterday ? getStreak() + 1 : 1;
  localStorage.setItem('bb_streak_count', String(next));
  localStorage.setItem('bb_streak_last', today);
}
