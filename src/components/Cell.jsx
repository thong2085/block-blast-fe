export default function Cell({ color, isPreview, isInvalid, isClearing, isFlashing, isJustPlaced, isPowerupTarget }) {
  const cls = ['cell'];

  if (isPowerupTarget)   cls.push('cell--powerup-target');
  if (isFlashing)        cls.push('cell--flashing');
  else if (isClearing)   cls.push('cell--clearing');
  else if (isInvalid)    cls.push('cell--invalid');
  else if (isPreview)    cls.push('cell--preview');
  else if (color)        cls.push('cell--filled');

  if (isJustPlaced && !isClearing && !isFlashing) cls.push('cell--placed');

  return (
    <div
      className={cls.join(' ')}
      style={color ? { '--cc': color } : undefined}
    />
  );
}
