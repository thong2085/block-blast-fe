// Each color entry: [lightShade, darkShade] → linear-gradient(135deg, light, dark)
// Light end = white/near-white; dark end = medium pastel (not saturated-dark)
export const THEMES = [
  // 0 — Sakura (Level 1, 9…)
  {
    name: 'Sakura',
    colors: [
      ['#ffffff', '#fda4af'],  // white → soft rose
      ['#ffffff', '#f9a8d4'],  // white → pink
      ['#ffffff', '#fb7185'],  // white → rose
      ['#fff5fa', '#fca5a5'],  // cream → salmon
      ['#ffffff', '#e879f9'],  // white → fuchsia
      ['#fffbeb', '#fbbf24'],  // cream → amber accent
      ['#ffffff', '#f472b6'],  // white → hot pink
      ['#fffbf2', '#fdba74'],  // cream → peach
    ],
    board:  'rgba(255, 210, 228, 0.5)',
    empty:  'rgba(255, 245, 250, 0.5)',
    border: 'rgba(255, 180, 210, 0.7)',
  },
  // 1 — Rose Gold (Level 2, 10…)
  {
    name: 'Rose Gold',
    colors: [
      ['#ffffff', '#fbbf24'],  // white → amber
      ['#fffbeb', '#fdba74'],  // cream → peach orange
      ['#ffffff', '#fca5a5'],  // white → salmon
      ['#fff7ed', '#fde68a'],  // warm white → yellow
      ['#ffffff', '#fed7aa'],  // white → light orange
      ['#fffbf0', '#f9a8d4'],  // cream → pink
      ['#ffffff', '#fda4af'],  // white → soft pink
      ['#fffef0', '#fcd34d'],  // cream → golden
    ],
    board:  'rgba(255, 225, 200, 0.5)',
    empty:  'rgba(255, 248, 240, 0.5)',
    border: 'rgba(255, 200, 165, 0.7)',
  },
  // 2 — Candy (Level 3, 11…)
  {
    name: 'Candy',
    colors: [
      ['#ffffff', '#f0abfc'],  // white → violet pink
      ['#fdf4ff', '#d8b4fe'],  // cream → lavender
      ['#ffffff', '#f5d0fe'],  // white → orchid
      ['#f5f3ff', '#c4b5fd'],  // lavender white → periwinkle
      ['#ffffff', '#f9a8d4'],  // white → pink
      ['#ffffff', '#e879f9'],  // white → fuchsia
      ['#faf5ff', '#a78bfa'],  // lilac white → violet
      ['#ffffff', '#fda4af'],  // white → rose
    ],
    board:  'rgba(240, 210, 255, 0.5)',
    empty:  'rgba(252, 245, 255, 0.5)',
    border: 'rgba(215, 170, 255, 0.7)',
  },
  // 3 — Cotton Candy (Level 4, 12…)
  {
    name: 'Cotton Candy',
    colors: [
      ['#ffffff', '#93c5fd'],  // white → sky blue
      ['#f0feff', '#67e8f9'],  // ice white → cyan
      ['#ffffff', '#86efac'],  // white → mint green
      ['#f0f9ff', '#7dd3fc'],  // sky white → blue
      ['#ecfeff', '#a5f3fc'],  // ice white → teal
      ['#f0fdf4', '#6ee7b7'],  // mint white → emerald
      ['#ffffff', '#bae6fd'],  // white → light blue
      ['#f0fffc', '#5eead4'],  // white → teal
    ],
    board:  'rgba(200, 238, 255, 0.5)',
    empty:  'rgba(240, 252, 255, 0.5)',
    border: 'rgba(160, 218, 250, 0.7)',
  },
  // 4 — Peach (Level 5, 13…)
  {
    name: 'Peach',
    colors: [
      ['#ffffff', '#fdba74'],  // white → peach
      ['#fffbeb', '#fde68a'],  // cream → lemon
      ['#fff7ed', '#fed7aa'],  // warm white → apricot
      ['#ffffff', '#fca5a5'],  // white → salmon
      ['#fffbf0', '#fbbf24'],  // cream → honey
      ['#ffffff', '#fb923c'],  // white → tangerine
      ['#fffef5', '#fcd34d'],  // cream → yellow
      ['#ffffff', '#fda4af'],  // white → blush
    ],
    board:  'rgba(255, 220, 195, 0.5)',
    empty:  'rgba(255, 245, 235, 0.5)',
    border: 'rgba(255, 195, 155, 0.7)',
  },
  // 5 — Lavender (Level 6, 14…)
  {
    name: 'Lavender',
    colors: [
      ['#ffffff', '#c4b5fd'],  // white → lavender
      ['#f5f3ff', '#ddd6fe'],  // lilac white → periwinkle
      ['#ffffff', '#a78bfa'],  // white → violet
      ['#faf5ff', '#d8b4fe'],  // lavender cream → purple
      ['#ffffff', '#f0abfc'],  // white → orchid
      ['#f5f3ff', '#c084fc'],  // lilac white → purple
      ['#ffffff', '#e9d5ff'],  // white → pale violet
      ['#fdf4ff', '#f9a8d4'],  // cream → pink
    ],
    board:  'rgba(220, 210, 255, 0.5)',
    empty:  'rgba(245, 242, 255, 0.5)',
    border: 'rgba(195, 178, 255, 0.7)',
  },
  // 6 — Strawberry (Level 7, 15…)
  {
    name: 'Strawberry',
    colors: [
      ['#ffffff', '#fca5a5'],  // white → strawberry pink
      ['#fff5f5', '#fecaca'],  // blush white → light red
      ['#ffffff', '#fda4af'],  // white → rose
      ['#fff5f7', '#f9a8d4'],  // cream → pink
      ['#ffffff', '#fb7185'],  // white → rose red
      ['#fff0f2', '#fda4af'],  // cream → soft red
      ['#ffffff', '#fbbf24'],  // white → amber accent
      ['#fffbeb', '#fdba74'],  // cream → peach
    ],
    board:  'rgba(255, 205, 210, 0.5)',
    empty:  'rgba(255, 245, 245, 0.5)',
    border: 'rgba(255, 175, 185, 0.7)',
  },
  // 7 — Dreamy (Level 8, 16…)
  {
    name: 'Dreamy',
    colors: [
      ['#ffffff', '#f9a8d4'],  // white → pink
      ['#f5f3ff', '#d8b4fe'],  // lilac → lavender
      ['#f0f9ff', '#93c5fd'],  // sky → blue
      ['#f0fdf4', '#86efac'],  // mint → green
      ['#fffbeb', '#fde68a'],  // cream → yellow
      ['#fff7ed', '#fdba74'],  // warm → peach
      ['#faf5ff', '#c4b5fd'],  // lilac → violet
      ['#fdf4ff', '#f0abfc'],  // cream → fuchsia
    ],
    board:  'rgba(255, 220, 240, 0.5)',
    empty:  'rgba(255, 248, 252, 0.5)',
    border: 'rgba(240, 190, 220, 0.7)',
  },
];

export function getTheme(level) {
  return THEMES[(level - 1) % THEMES.length];
}
