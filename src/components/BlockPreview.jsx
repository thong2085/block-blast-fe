export default function BlockPreview({ block, small = false }) {
  if (!block) return <div className="block-placeholder" />;

  const rows = block.cells.map(([r]) => r);
  const cols = block.cells.map(([, c]) => c);
  const minR = Math.min(...rows);
  const minC = Math.min(...cols);
  const maxR = Math.max(...rows);
  const maxC = Math.max(...cols);
  const height = maxR - minR + 1;
  const width = maxC - minC + 1;

  const cellSize = small ? 14 : 20;
  const gap = small ? 2 : 3;

  const grid = Array.from({ length: height }, () => Array(width).fill(false));
  block.cells.forEach(([r, c]) => { grid[r - minR][c - minC] = true; });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {grid.flat().map((filled, i) => (
        <div
          key={i}
          style={{
            width: cellSize,
            height: cellSize,
            borderRadius: 3,
            background: filled ? block.color : 'transparent',
            boxShadow: filled
              ? `inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)`
              : 'none',
          }}
        />
      ))}
    </div>
  );
}
