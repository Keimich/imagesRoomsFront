import React, { useRef, useEffect, useState, useCallback } from 'react';
import Draggable from 'react-draggable';
import { useResizeWatcher } from '../hooks/useResizeWatcher';

function Image({ image, onMove, onDelete, onResizeStop }) {
  const nodeRef = useRef(null);
  const isResizing = useResizeWatcher(nodeRef);

  const [localPosition, setLocalPosition] = useState({ x: image.x, y: image.y });

  useEffect(() => {
    setLocalPosition({ x: image.x, y: image.y });
  }, [image.x, image.y]);

  useEffect(() => {
    const element = nodeRef.current;
    if (!element || !onResizeStop) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        onResizeStop(image.id, { width: Math.round(width), height: Math.round(height) });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [image.id, onResizeStop]);

  const handleDrag = useCallback((e, data) => {
    setLocalPosition({ x: data.x, y: data.y });
  }, []);

  const handleStop = useCallback(() => {
    onMove(image.id, localPosition);
  }, [onMove, image.id, localPosition]);

  const containerClasses = `image-container ${isResizing ? 'resizing' : ''}`;

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={isResizing}
      position={localPosition}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className={containerClasses}
        style={{
          width: image.width + 'px',
          aspectRatio: `${image.width} / ${image.height}`,
        }}
      >
        <img
          draggable="false"
          src={image.url}
          alt=""
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onDelete(image.id)}
          className="delete-button"
        >
          X
        </button>
      </div>
    </Draggable>
  );
}

export default Image;