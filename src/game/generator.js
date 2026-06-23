import { ALL_SHAPES, SHAPE_WEIGHTS, COLORS } from './shapes';
import { hasAnyMove } from './board';

function pick3Colors(palette, rng) {
  const src = (palette && palette.length >= 3) ? palette : COLORS;
  const shuffled = [...src].sort(() => rng() - 0.5);
  return shuffled.slice(0, 3).map(c =>
    Array.isArray(c) ? `linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 100%)` : c
  );
}

function weightedRandom(shapes, weights, rng) {
  const total = shapes.reduce((sum, s) => sum + (weights[s.id] ?? 1), 0);
  let rand = rng() * total;
  for (const s of shapes) {
    rand -= weights[s.id] ?? 1;
    if (rand <= 0) return s;
  }
  return shapes[shapes.length - 1];
}

function getDifficultyWeights(score) {
  if (score < 2000) return SHAPE_WEIGHTS;

  if (score < 5000) {
    return {
      ...SHAPE_WEIGHTS,
      single: 5,
      line4_h: 5, line4_v: 5,
      t_d: 5, t_u: 5, t_r: 5, t_l: 5,
      llong_r: 4, llong_l: 4, llong_u: 4, llong_d: 4,
    };
  }

  return {
    ...SHAPE_WEIGHTS,
    single: 2,
    line2_h: 3, line2_v: 3,
    line4_h: 6, line4_v: 6,
    line5_h: 3, line5_v: 3,
    square3: 2,
    t_d: 6, t_u: 6, t_r: 6, t_l: 6,
    llong_r: 5, llong_l: 5, llong_u: 5, llong_d: 5,
    plus: 3,
    rect2x3: 2, rect3x2: 2,
    lbig_dr: 2, lbig_dl: 2, lbig_ur: 2, lbig_ul: 2,
  };
}

export function generateBlocks(board, score = 0, colors, rng) {
  const rand = rng ?? Math.random.bind(Math);
  const weights = getDifficultyWeights(score);

  const placeable = ALL_SHAPES.filter(s => hasAnyMove(board, [{ ...s, color: '#fff' }]));
  const pool = placeable.length > 0 ? placeable : ALL_SHAPES;

  const [c0, c1, c2] = pick3Colors(colors, rand);

  return [
    { ...weightedRandom(pool, weights, rand), color: c0 },
    { ...weightedRandom(pool, weights, rand), color: c1 },
    { ...weightedRandom(pool, weights, rand), color: c2 },
  ];
}
