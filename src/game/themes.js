export const THEMES = [
  // 0 — Sakura · jelly blocks · mùa xuân đa màu
  {
    name: 'Sakura',
    blockStyle: 'jelly',
    accent: '#f472b6',
    colors: [
      '#e11d48',  // hoa anh đào đỏ
      '#db2777',  // hồng đậm
      '#7c3aed',  // tử đằng tím
      '#ea580c',  // đào cam
      '#ca8a04',  // hoa cải vàng
      '#16a34a',  // lá non xanh
      '#0891b2',  // trời xuân xanh
      '#0f766e',  // hồ xanh ngọc
    ],
    board:  'rgba(255, 210, 228, 0.5)',
    empty:  'rgba(255, 245, 250, 0.5)',
    border: 'rgba(255, 180, 210, 0.7)',
  },

  // 1 — Ocean · glass blocks · xanh biển/ngọc
  {
    name: 'Ocean',
    blockStyle: 'glass',
    accent: '#0891b2',
    colors: [
      '#0891b2',  // ocean blue
      '#0369a1',  // deep sea
      '#0f766e',  // teal
      '#06b6d4',  // cyan
      '#10b981',  // sea green
      '#1d4ed8',  // navy
      '#0284c7',  // mid blue
      '#047857',  // deep emerald
    ],
    board:  'rgba(164, 230, 244, 0.5)',
    empty:  'rgba(240, 252, 255, 0.5)',
    border: 'rgba(100, 200, 230, 0.7)',
  },

  // 2 — Forest · soft blocks · xanh lá/ngọc lục
  {
    name: 'Forest',
    blockStyle: 'soft',
    accent: '#16a34a',
    colors: [
      '#16a34a',  // forest green
      '#65a30d',  // lime
      '#059669',  // emerald
      '#0d9488',  // teal
      '#15803d',  // deep forest
      '#84cc16',  // yellow-green
      '#0891b2',  // lake blue
      '#ca8a04',  // autumn gold
    ],
    board:  'rgba(187, 247, 208, 0.5)',
    empty:  'rgba(240, 253, 244, 0.5)',
    border: 'rgba(74, 222, 128, 0.6)',
  },

  // 3 — Sunset · candy blocks · cam/vàng/tím hoàng hôn
  {
    name: 'Sunset',
    blockStyle: 'candy',
    accent: '#f97316',
    colors: [
      '#f97316',  // orange
      '#ea580c',  // orange-red
      '#db2777',  // hot pink
      '#ca8a04',  // gold
      '#7c3aed',  // purple
      '#e11d48',  // crimson
      '#d97706',  // amber
      '#c026d3',  // magenta
    ],
    board:  'rgba(255, 218, 185, 0.5)',
    empty:  'rgba(255, 248, 240, 0.5)',
    border: 'rgba(249, 115, 22, 0.5)',
  },

  // 4 — Cosmic · neon blocks · chàm/tím vũ trụ
  {
    name: 'Cosmic',
    blockStyle: 'neon',
    accent: '#6366f1',
    colors: [
      '#6366f1',  // indigo
      '#8b5cf6',  // violet
      '#06b6d4',  // cyan
      '#a855f7',  // purple
      '#3b82f6',  // blue
      '#ec4899',  // pink
      '#10b981',  // emerald
      '#f59e0b',  // amber
    ],
    board:  'rgba(199, 210, 254, 0.5)',
    empty:  'rgba(238, 242, 255, 0.5)',
    border: 'rgba(99, 102, 241, 0.5)',
  },

  // 5 — Desert · pixel blocks · cát/đất/terracotta
  {
    name: 'Desert',
    blockStyle: 'pixel',
    accent: '#d97706',
    colors: [
      '#c2410c',  // burnt orange
      '#b45309',  // brown amber
      '#ea580c',  // orange
      '#991b1b',  // dark red
      '#d97706',  // amber
      '#92400e',  // earth brown
      '#dc2626',  // brick red
      '#78350f',  // dark brown
    ],
    board:  'rgba(253, 211, 160, 0.5)',
    empty:  'rgba(255, 250, 240, 0.5)',
    border: 'rgba(234, 179, 8, 0.6)',
  },

  // 6 — Tropical · gem blocks · xanh nhiệt đới/đa màu rực rỡ
  {
    name: 'Tropical',
    blockStyle: 'gem',
    accent: '#10b981',
    colors: [
      '#059669',  // emerald
      '#0891b2',  // ocean
      '#db2777',  // tropical flower
      '#65a30d',  // lime
      '#ca8a04',  // gold
      '#2563eb',  // cobalt
      '#9333ea',  // amethyst
      '#0f766e',  // jade
    ],
    board:  'rgba(167, 243, 208, 0.5)',
    empty:  'rgba(240, 253, 250, 0.5)',
    border: 'rgba(52, 211, 153, 0.6)',
  },

  // 7 — Volcano · classic blocks · đỏ/cam/lửa
  {
    name: 'Volcano',
    blockStyle: 'classic',
    accent: '#dc2626',
    colors: [
      '#dc2626',  // red
      '#ea580c',  // orange-red
      '#ca8a04',  // molten gold
      '#b91c1c',  // deep red
      '#f97316',  // orange
      '#991b1b',  // dark red
      '#d97706',  // amber
      '#e11d48',  // crimson
    ],
    board:  'rgba(254, 202, 202, 0.5)',
    empty:  'rgba(255, 245, 245, 0.5)',
    border: 'rgba(239, 68, 68, 0.6)',
  },
];

export function getTheme(level) {
  return THEMES[(level - 1) % THEMES.length];
}
