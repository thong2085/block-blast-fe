import BlockPreview from './BlockPreview';

export default function BlockTray({ blocks, draggingIndex, newBlocksKey, placeableBlocks, onBlockPointerDown, shuffled }) {
  return (
    <div className={`block-tray${shuffled ? ' block-tray--shuffle' : ''}`}>
      {blocks.map((block, i) => {
        const placeable = placeableBlocks?.[i] ?? true;
        const dim       = block && !placeable;
        return (
          <div
            key={`${newBlocksKey}-${i}`}
            className={[
              'block-slot',
              block === null          ? 'block-slot--used'     : '',
              draggingIndex === i     ? 'block-slot--dragging' : '',
              dim                     ? 'block-slot--dim'      : '',
            ].join(' ')}
            onPointerDown={block && placeable ? (e) => onBlockPointerDown(e, i) : undefined}
            style={{
              cursor:      block ? (placeable ? 'grab' : 'not-allowed') : 'default',
              touchAction: 'none',
              animationDelay: `${i * 45}ms`,
            }}
          >
            {block && <BlockPreview block={block} />}
          </div>
        );
      })}
    </div>
  );
}
