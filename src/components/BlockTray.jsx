import BlockPreview from './BlockPreview';

export default function BlockTray({ blocks, draggingIndex, newBlocksKey, onBlockPointerDown }) {
  return (
    <div className="block-tray">
      {blocks.map((block, i) => (
        <div
          // Changing key causes remount → triggers slotPopIn animation
          key={`${newBlocksKey}-${i}`}
          className={[
            'block-slot',
            block === null ? 'block-slot--used' : '',
            draggingIndex === i ? 'block-slot--dragging' : '',
          ].join(' ')}
          onPointerDown={block ? (e) => onBlockPointerDown(e, i) : undefined}
          style={{
            cursor: block ? 'grab' : 'default',
            touchAction: 'none',
            animationDelay: `${i * 55}ms`,
          }}
        >
          {block && <BlockPreview block={block} />}
        </div>
      ))}
    </div>
  );
}
