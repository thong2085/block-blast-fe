export default function FloatingScore({ gained, combo, boardClear, boardRef }) {
  const rect = boardRef?.current?.getBoundingClientRect();
  if (!rect || gained <= 0) return null;

  const x = rect.left + rect.width  / 2;
  const y = rect.top  + rect.height * 0.32;

  const isCombo = combo > 1;
  const label   = boardClear ? 'BOARD CLEAR! ✨'
                : isCombo    ? `×${combo} COMBO`
                : null;

  const cls = ['floating-score']
    .concat(boardClear ? 'floating-score--clear' : [])
    .concat(isCombo    ? 'floating-score--combo'  : [])
    .join(' ');

  return (
    <div className={cls} style={{ left: x, top: y }}>
      <span className="floating-score__pts">+{gained.toLocaleString()}</span>
      {label && <span className="floating-score__label">{label}</span>}
    </div>
  );
}
