import React, { useState, useRef, useEffect } from 'react';
import './TerminalSplitPane.css';

function TerminalSplitPane({ 
  children, 
  split = 'vertical', 
  minSize = 100, 
  maxSize = null,
  defaultSize = '50%',
  onResize = null,
  disabled = false,
  className = ''
}) {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const paneRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || disabled) return;

      const pane = paneRef.current;
      if (!pane) return;

      const rect = pane.getBoundingClientRect();
      let newSize;

      if (split === 'vertical') {
        const totalWidth = rect.width;
        const mouseX = e.clientX - rect.left;
        newSize = (mouseX / totalWidth) * 100;
      } else {
        const totalHeight = rect.height;
        const mouseY = e.clientY - rect.top;
        newSize = (mouseY / totalHeight) * 100;
      }

      // Apply constraints
      const minPercent = (minSize / (split === 'vertical' ? rect.width : rect.height)) * 100;
      const maxPercent = maxSize ? (maxSize / (split === 'vertical' ? rect.width : rect.height)) * 100 : 90;

      newSize = Math.max(minPercent, Math.min(maxPercent, newSize));
      
      setSize(`${newSize}%`);
      
      if (onResize) {
        onResize(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, split, minSize, maxSize, onResize, disabled]);

  const handleMouseDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const [firstChild, secondChild] = React.Children.toArray(children);

  return (
    <div 
      ref={paneRef}
      className={`terminal-split-pane ${split} ${className} ${isDragging ? 'dragging' : ''}`}
    >
      <div 
        className="pane first-pane"
        style={{
          [split === 'vertical' ? 'width' : 'height']: size
        }}
      >
        {firstChild}
      </div>
      
      <div 
        ref={resizerRef}
        className={`resizer ${split} ${disabled ? 'disabled' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="resizer-handle">
          {split === 'vertical' ? '⋮' : '⋯'}
        </div>
      </div>
      
      <div className="pane second-pane">
        {secondChild}
      </div>
    </div>
  );
}

export default TerminalSplitPane;
