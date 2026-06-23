const LABELS = ['', 'Hay đó! 👏', 'Em giỏi lắm!', 'Cố lên nhé 🌸', 'Không thể tin được 🔥', 'Đỉnh nóc kịch trần 🔥'];

export default function ComboEffect({ count }) {
  const label = LABELS[Math.min(count, LABELS.length - 1)];
  return (
    <div className="combo-effect" aria-live="assertive">
      <span className="combo-effect-label">{label}</span>
      <span className="combo-effect-num">×{count}</span>
    </div>
  );
}