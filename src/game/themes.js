// Each color entry: [lightShade, darkShade] → linear-gradient(135deg, light, dark)
export const THEMES = [
  // 0 — Sakura (Level 1, 9…)
  {
    name: 'Sakura',
    blockStyle: 'jelly',
    accent: '#f472b6',
    colors: [
      ['#ffe4e6', '#fb7185'],  // rose-100 → rose-400
      ['#fce7f3', '#f472b6'],  // pink-100 → pink-400
      ['#ffd6e0', '#f43f5e'],  // rose-100+ → rose-500
      ['#ffe4e6', '#f87171'],  // rose-100 → red-400
      ['#fdf4ff', '#d946ef'],  // fuchsia-50 → fuchsia-500
      ['#fef9c3', '#eab308'],  // yellow-100 → yellow-500
      ['#fce7f3', '#ec4899'],  // pink-100 → pink-500
      ['#fff7ed', '#fb923c'],  // orange-50 → orange-400
    ],
    board:  'rgba(255, 210, 228, 0.5)',
    empty:  'rgba(255, 245, 250, 0.5)',
    border: 'rgba(255, 180, 210, 0.7)',
  },
  // 1 — Rose Gold (Level 2, 10…)
  {
    name: 'Rose Gold',
    blockStyle: 'gem',
    accent: '#f59e0b',
    colors: [
      ['#fef9c3', '#f59e0b'],  // yellow-100 → amber-500
      ['#ffedd5', '#fb923c'],  // orange-100 → orange-400
      ['#ffe4e6', '#f87171'],  // rose-100 → red-400
      ['#fef3c7', '#fbbf24'],  // amber-100 → amber-400
      ['#ffedd5', '#fdba74'],  // orange-100 → orange-300+
      ['#fce7f3', '#f472b6'],  // pink-100 → pink-400
      ['#ffe4e6', '#fb7185'],  // rose-100 → rose-400
      ['#fef9c3', '#fcd34d'],  // yellow-100 → amber-300
    ],
    board:  'rgba(255, 225, 200, 0.5)',
    empty:  'rgba(255, 248, 240, 0.5)',
    border: 'rgba(255, 200, 165, 0.7)',
  },
  // 2 — Candy (Level 3, 11…)
  {
    name: 'Candy',
    blockStyle: 'candy',
    accent: '#d946ef',
    colors: [
      ['#fdf4ff', '#e879f9'],  // fuchsia-50 → fuchsia-400
      ['#f3e8ff', '#c084fc'],  // purple-100 → purple-400
      ['#fae8ff', '#d946ef'],  // fuchsia-100 → fuchsia-500
      ['#ede9fe', '#a78bfa'],  // violet-100 → violet-400
      ['#fce7f3', '#f472b6'],  // pink-100 → pink-400
      ['#fdf4ff', '#c026d3'],  // fuchsia-50 → fuchsia-600
      ['#ede9fe', '#8b5cf6'],  // violet-100 → violet-500
      ['#ffe4e6', '#fb7185'],  // rose-100 → rose-400
    ],
    board:  'rgba(240, 210, 255, 0.5)',
    empty:  'rgba(252, 245, 255, 0.5)',
    border: 'rgba(215, 170, 255, 0.7)',
  },
  // 3 — Cotton Candy (Level 4, 12…)
  {
    name: 'Cotton Candy',
    blockStyle: 'soft',
    accent: '#22d3ee',
    colors: [
      ['#dbeafe', '#60a5fa'],  // blue-100 → blue-400
      ['#cffafe', '#22d3ee'],  // cyan-100 → cyan-400
      ['#dcfce7', '#4ade80'],  // green-100 → green-400
      ['#e0f2fe', '#38bdf8'],  // sky-100 → sky-400
      ['#cffafe', '#06b6d4'],  // cyan-100 → cyan-500
      ['#d1fae5', '#34d399'],  // emerald-100 → emerald-400
      ['#e0f2fe', '#7dd3fc'],  // sky-100 → sky-300+
      ['#ccfbf1', '#2dd4bf'],  // teal-100 → teal-400
    ],
    board:  'rgba(200, 238, 255, 0.5)',
    empty:  'rgba(240, 252, 255, 0.5)',
    border: 'rgba(160, 218, 250, 0.7)',
  },
  // 4 — Peach (Level 5, 13…)
  {
    name: 'Peach',
    blockStyle: 'classic',
    accent: '#f97316',
    colors: [
      ['#ffedd5', '#fb923c'],  // orange-100 → orange-400
      ['#fef3c7', '#fbbf24'],  // amber-100 → amber-400
      ['#ffedd5', '#fdba74'],  // orange-100 → orange-300+
      ['#ffe4e6', '#f87171'],  // rose-100 → red-400
      ['#fef9c3', '#f59e0b'],  // yellow-100 → amber-500
      ['#ffedd5', '#f97316'],  // orange-100 → orange-500
      ['#fef9c3', '#fcd34d'],  // yellow-100 → amber-300
      ['#ffe4e6', '#fda4af'],  // rose-100 → rose-300
    ],
    board:  'rgba(255, 220, 195, 0.5)',
    empty:  'rgba(255, 245, 235, 0.5)',
    border: 'rgba(255, 195, 155, 0.7)',
  },
  // 5 — Lavender (Level 6, 14…)
  {
    name: 'Lavender',
    blockStyle: 'neon',
    accent: '#a855f7',
    colors: [
      ['#ede9fe', '#a78bfa'],  // violet-100 → violet-400
      ['#f3e8ff', '#c084fc'],  // purple-100 → purple-400
      ['#ede9fe', '#8b5cf6'],  // violet-100 → violet-500
      ['#f3e8ff', '#a855f7'],  // purple-100 → purple-500
      ['#fdf4ff', '#e879f9'],  // fuchsia-50 → fuchsia-400
      ['#f3e8ff', '#d8b4fe'],  // purple-100 → purple-300+
      ['#ede9fe', '#c4b5fd'],  // violet-100 → violet-300+
      ['#fce7f3', '#f9a8d4'],  // pink-100 → pink-300
    ],
    board:  'rgba(220, 210, 255, 0.5)',
    empty:  'rgba(245, 242, 255, 0.5)',
    border: 'rgba(195, 178, 255, 0.7)',
  },
  // 6 — Strawberry (Level 7, 15…)
  {
    name: 'Strawberry',
    blockStyle: 'pixel',
    accent: '#ef4444',
    colors: [
      ['#ffe4e6', '#f87171'],  // rose-100 → red-400
      ['#fee2e2', '#fca5a5'],  // red-100 → red-300
      ['#ffe4e6', '#fb7185'],  // rose-100 → rose-400
      ['#fce7f3', '#f472b6'],  // pink-100 → pink-400
      ['#ffe4e6', '#f43f5e'],  // rose-100 → rose-500
      ['#fee2e2', '#ef4444'],  // red-100 → red-500
      ['#fef9c3', '#f59e0b'],  // yellow-100 → amber-500
      ['#ffedd5', '#fb923c'],  // orange-100 → orange-400
    ],
    board:  'rgba(255, 205, 210, 0.5)',
    empty:  'rgba(255, 245, 245, 0.5)',
    border: 'rgba(255, 175, 185, 0.7)',
  },
  // 7 — Dreamy (Level 8, 16…)
  {
    name: 'Dreamy',
    blockStyle: 'glass',
    accent: '#c084fc',
    colors: [
      ['#fce7f3', '#f472b6'],  // pink-100 → pink-400
      ['#f3e8ff', '#c084fc'],  // purple-100 → purple-400
      ['#dbeafe', '#60a5fa'],  // blue-100 → blue-400
      ['#dcfce7', '#4ade80'],  // green-100 → green-400
      ['#fef3c7', '#fbbf24'],  // amber-100 → amber-400
      ['#ffedd5', '#fb923c'],  // orange-100 → orange-400
      ['#ede9fe', '#a78bfa'],  // violet-100 → violet-400
      ['#fdf4ff', '#e879f9'],  // fuchsia-50 → fuchsia-400
    ],
    board:  'rgba(255, 220, 240, 0.5)',
    empty:  'rgba(255, 248, 252, 0.5)',
    border: 'rgba(240, 190, 220, 0.7)',
  },
];

export function getTheme(level) {
  return THEMES[(level - 1) % THEMES.length];
}
