import { ALL_SHAPES, SHAPE_WEIGHTS, COLORS } from './shapes';
import { hasAnyMove } from './board';

function pick3Colors(palette) {
  const src = (palette && palette.length >= 3) ? palette : COLORS;
  const shuffled = [...src].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(c =>
    Array.isArray(c) ? `linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 100%)` : c
  );
}

function weightedRandom(shapes, weights) {
  const total = shapes.reduce((sum, s) => sum + (weights[s.id] ?? 1), 0);
  let rand = Math.random() * total;
  for (const s of shapes) {
    rand -= weights[s.id] ?? 1;
    if (rand <= 0) return s;
  }
  return shapes[shapes.length - 1];
}

function getDifficultyWeights(score) {
  if (score < 500) return SHAPE_WEIGHTS;

  if (score < 1500) {
    return {
      ...SHAPE_WEIGHTS,
      single: 4,
      line2_h: 4, line2_v: 4,
      line4_h: 6, line4_v: 6,
      t_d: 6, t_u: 6, t_r: 6, t_l: 6,
      llong_r: 5, llong_l: 5, llong_u: 5, llong_d: 5,
      plus: 2,
    };
  }

  return {
    ...SHAPE_WEIGHTS,
    single: 1,
    line2_h: 2, line2_v: 2,
    line3_h: 4, line3_v: 4,
    line4_h: 7, line4_v: 7,
    line5_h: 4, line5_v: 4,
    square2: 4, square3: 2,
    t_d: 6, t_u: 6, t_r: 6, t_l: 6,
    l_dr: 6, l_dl: 6, l_ur: 6, l_ul: 6,
    llong_r: 5, llong_l: 5, llong_u: 5, llong_d: 5,
    plus: 3,
    rect2x3: 2, rect3x2: 2,
    lbig_dr: 2, lbig_dl: 2, lbig_ur: 2, lbig_ul: 2,
    lbig_ld: 2, lbig_lu: 2, lbig_rd: 2, lbig_ru: 2,
  };
}

export function generateBlocks(board, score = 0, colors) {
  const weights = getDifficultyWeights(score);

  // Only generate shapes that can actually be placed on the current board.
  // This prevents instant-game-over from receiving unplaceable large blocks.
  const placeable = ALL_SHAPES.filter(s => hasAnyMove(board, [{ ...s, color: '#fff' }]));
  const pool = placeable.length > 0 ? placeable : ALL_SHAPES;

  const [c0, c1, c2] = pick3Colors(colors);

  return [
    { ...weightedRandom(pool, weights), color: c0 },
    { ...weightedRandom(pool, weights), color: c1 },
    { ...weightedRandom(pool, weights), color: c2 },
  ];
}
