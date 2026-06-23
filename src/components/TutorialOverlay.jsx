import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';

const STEPS = [
  {
    emoji: '👆',
    title: 'Kéo khối',
    desc: 'Giữ và kéo khối từ khay bên dưới vào bảng. Thả vào ô muốn đặt.',
  },
  {
    emoji: '💥',
    title: 'Xóa hàng / cột',
    desc: 'Điền đầy một hàng ngang hoặc cột dọc để xóa chúng và ghi điểm!',
  },
  {
    emoji: '🔥',
    title: 'Tạo Combo',
    desc: 'Xóa nhiều lần liên tiếp trong một lượt để nhân điểm lên. Càng nhiều combo, điểm càng cao!',
  },
  {
    emoji: '⚡',
    title: 'Dùng Power-up',
    desc: 'Bí rồi? Dùng BOM phá vùng 3×3, SÉT xóa hàng+cột, MÀU xóa một màu, XÁO đổi 3 khối mới.',
  },
];

export default function TutorialOverlay({ onDone }) {
  const [step, setStep] = useState(0);

  const skip = () => {
    localStorage.setItem('bb_tutorial_done', '1');
    onDone();
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      skip();
    }
  };

  const { emoji, title, desc } = STEPS[step];

  return (
    <div className="modal-overlay tutorial-overlay">
      <div className="modal tutorial-modal">
        <button className="tutorial-skip" onClick={skip}>
          Bỏ qua <X size={12} />
        </button>

        <span className="tutorial-emoji" key={step}>{emoji}</span>
        <h2 className="tutorial-title">{title}</h2>
        <p className="tutorial-desc">{desc}</p>

        <div className="tutorial-dots">
          {STEPS.map((_, i) => (
            <div key={i} className={`tutorial-dot${i === step ? ' tutorial-dot--active' : ''}`} />
          ))}
        </div>

        <button className="btn btn-primary tutorial-btn" onClick={next}>
          {step < STEPS.length - 1 ? (
            <>Tiếp <ChevronRight size={16} strokeWidth={2.5} /></>
          ) : (
            'Chơi thôi! 🚀'
          )}
        </button>
      </div>
    </div>
  );
}
