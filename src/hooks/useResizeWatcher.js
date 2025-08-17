import { useState, useEffect } from 'react';

export function useResizeWatcher(ref) {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = () => {
      // This function is primarily to ensure we are tracking the drag action.
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('mousemove', handleMouseMove, true);
    };

    const handleMouseDown = (e) => {
      const rect = element.getBoundingClientRect();
      const resizeHandleSize = 20;

      if (
        e.clientX >= rect.left + rect.width - resizeHandleSize &&
        e.clientX <= rect.left + rect.width &&
        e.clientY >= rect.top + rect.height - resizeHandleSize &&
        e.clientY <= rect.top + rect.height
      ) {
        setIsResizing(true);
        window.addEventListener('mouseup', handleMouseUp, true);
        window.addEventListener('mousemove', handleMouseMove, true);
      }
    };

    element.addEventListener('mousedown', handleMouseDown);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('mousemove', handleMouseMove, true);
    };
  }, [ref]);

  return isResizing;
}