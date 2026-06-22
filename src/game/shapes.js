// Each entry is [lightColor, darkColor] — rendered as a diagonal gradient on blocks
export const COLORS = [
  ['#93c5fd', '#2563eb'],
  ['#fca5a5', '#dc2626'],
  ['#86efac', '#16a34a'],
  ['#fde68a', '#d97706'],
  ['#d8b4fe', '#7c3aed'],
  ['#f9a8d4', '#db2777'],
  ['#5eead4', '#0d9488'],
  ['#fdba74', '#ea580c'],
];

export function getRandomColor(palette) {
  const src = palette ?? COLORS;
  const pick = src[Math.floor(Math.random() * src.length)];
  // If it's a gradient pair [light, dark], return as CSS gradient string
  if (Array.isArray(pick)) {
    return `linear-gradient(135deg, ${pick[0]} 0%, ${pick[1]} 100%)`;
  }
  return pick;
}

export const ALL_SHAPES = [
  // 1 ô
  { id: 'single', size: 1, cells: [[0, 0]] },

  // 2 ô
  { id: 'line2_h', size: 2, cells: [[0, 0], [0, 1]] },
  { id: 'line2_v', size: 2, cells: [[0, 0], [1, 0]] },

  // 3 ô thẳng
  { id: 'line3_h', size: 3, cells: [[0, 0], [0, 1], [0, 2]] },
  { id: 'line3_v', size: 3, cells: [[0, 0], [1, 0], [2, 0]] },

  // 4 ô thẳng
  { id: 'line4_h', size: 4, cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { id: 'line4_v', size: 4, cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },

  // 5 ô thẳng
  { id: 'line5_h', size: 5, cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  { id: 'line5_v', size: 5, cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },

  // 2x2 square
  { id: 'square2', size: 4, cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },

  // 3x3 square
  {
    id: 'square3',
    size: 9,
    cells: [
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
    ],
  },

  // L shapes
  { id: 'l_dr', size: 3, cells: [[0, 0], [1, 0], [1, 1]] },
  { id: 'l_dl', size: 3, cells: [[0, 1], [1, 0], [1, 1]] },
  { id: 'l_ur', size: 3, cells: [[0, 0], [0, 1], [1, 0]] },
  { id: 'l_ul', size: 3, cells: [[0, 0], [0, 1], [1, 1]] },

  // L-long (4 cells)
  { id: 'llong_r', size: 4, cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
  { id: 'llong_l', size: 4, cells: [[0, 1], [1, 1], [2, 0], [2, 1]] },
  { id: 'llong_u', size: 4, cells: [[0, 0], [0, 1], [0, 2], [1, 0]] },
  { id: 'llong_d', size: 4, cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },

  // T shapes
  { id: 't_d', size: 4, cells: [[0, 0], [0, 1], [0, 2], [1, 1]] },
  { id: 't_u', size: 4, cells: [[0, 1], [1, 0], [1, 1], [1, 2]] },
  { id: 't_r', size: 4, cells: [[0, 0], [1, 0], [1, 1], [2, 0]] },
  { id: 't_l', size: 4, cells: [[0, 1], [1, 0], [1, 1], [2, 1]] },

  // S/Z shapes
  { id: 's_h', size: 4, cells: [[0, 1], [0, 2], [1, 0], [1, 1]] },
  { id: 's_v', size: 4, cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { id: 'z_h', size: 4, cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { id: 'z_v', size: 4, cells: [[0, 1], [1, 0], [1, 1], [2, 0]] },
];

// Weights: khối nhỏ = trọng số cao (xuất hiện thường hơn)
export const SHAPE_WEIGHTS = {
  single: 8,
  line2_h: 7, line2_v: 7,
  line3_h: 6, line3_v: 6,
  square2: 6,
  l_dr: 5, l_dl: 5, l_ur: 5, l_ul: 5,
  line4_h: 4, line4_v: 4,
  t_d: 4, t_u: 4, t_r: 4, t_l: 4,
  s_h: 3, s_v: 3, z_h: 3, z_v: 3,
  llong_r: 3, llong_l: 3, llong_u: 3, llong_d: 3,
  line5_h: 2, line5_v: 2,
  square3: 1,
};

