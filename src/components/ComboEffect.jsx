const LABELS = ['', '', 'NICE!', 'GREAT!', 'AMAZING!', 'INSANE!'];

export default function ComboEffect({ count }) {
  const label = LABELS[Math.min(count, LABELS.length - 1)];
  return (
    <div className="combo-effect" aria-live="assertive">
      <span className="combo-effect-label">{label}</span>
      <span className="combo-effect-num">×{count}</span>
    </div>
  );
}
