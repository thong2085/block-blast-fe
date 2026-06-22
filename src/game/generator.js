import { ALL_SHAPES, SHAPE_WEIGHTS, getRandomColor } from './shapes';
import { hasAnyMove } from './board';

function makeBlock(shape, colors) {
  return { ...shape, color: getRandomColor(colors) };
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
    };
  }

  return {
    ...SHAPE_WEIGHTS,
    single: 1,
    line2_h: 2, line2_v: 2,
    line3_h: 4, line3_v: 4,
    line4_h: 7, line4_v: 7,
    line5_h: 5, line5_v: 5,
    square2: 4, square3: 3,
    t_d: 6, t_u: 6, t_r: 6, t_l: 6,
    l_dr: 6, l_dl: 6, l_ur: 6, l_ul: 6,
  };
}

export function generateBlocks(board, score = 0, colors) {
  const weights = getDifficultyWeights(score);
  const placeable = ALL_SHAPES.filter(s => hasAnyMove(board, [{ ...s, color: '#fff' }]));
  const pool = placeable.length > 0 ? placeable : ALL_SHAPES;

  return [
    makeBlock(weightedRandom(pool, weights), colors),
    makeBlock(weightedRandom(ALL_SHAPES, weights), colors),
    makeBlock(weightedRandom(ALL_SHAPES, weights), colors),
  ];
}
