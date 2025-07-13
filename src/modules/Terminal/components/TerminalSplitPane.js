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
      const dimension = split === 'vertical' ? rect.width : rect.height;
      const minPercent = (minSize / dimension) * 100;
      const maxPercent = maxSize ? (maxSize / dimension) * 100 : 90;

      newSize = Math.max(minPercent, Math.min(maxPercent, newSize));
      
      setSize(`${newSize}%`);
      
      if (onResize) {
        onResize(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = split === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
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
      className={`split-pane ${split} ${className} ${disabled ? 'disabled' : ''}`}
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
        className={`resizer ${split} ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="resizer-handle">
          {split === 'vertical' ? (
            <div className="resizer-dots vertical">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          ) : (
            <div className="resizer-dots horizontal">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="pane second-pane"
        style={{
          [split === 'vertical' ? 'width' : 'height']: `calc(100% - ${size} - 4px)`
        }}
      >
        {secondChild}
      </div>
    </div>
  );
}

function TerminalSplitManager({ children, layout = 'single' }) {
  const [currentLayout, setCurrentLayout] = useState(layout);
  const [panes, setPanes] = useState([]);

  useEffect(() => {
    const childArray = React.Children.toArray(children);
    setPanes(childArray);
  }, [children]);

  const renderLayout = () => {
    switch (currentLayout) {
      case 'horizontal':
        return (
          <TerminalSplitPane split="horizontal">
            {panes[0]}
            {panes[1] || <div className="empty-pane">Empty Pane</div>}
          </TerminalSplitPane>
        );
      
      case 'vertical':
        return (
          <TerminalSplitPane split="vertical">
            {panes[0]}
            {panes[1] || <div className="empty-pane">Empty Pane</div>}
          </TerminalSplitPane>
        );
      
      case 'grid':
        return (
          <TerminalSplitPane split="vertical">
            <TerminalSplitPane split="horizontal">
              {panes[0]}
              {panes[1] || <div className="empty-pane">Empty Pane</div>}
            </TerminalSplitPane>
            <TerminalSplitPane split="horizontal">
              {panes[2] || <div className="empty-pane">Empty Pane</div>}
              {panes[3] || <div className="empty-pane">Empty Pane</div>}
            </TerminalSplitPane>
          </TerminalSplitPane>
        );
      
      case 'single':
      default:
        return panes[0] || <div className="empty-pane">No Terminal</div>;
    }
  };

  return (
    <div className="split-manager">
      <div className="split-controls">
        <button 
          className={`split-btn ${currentLayout === 'single' ? 'active' : ''}`}
          onClick={() => setCurrentLayout('single')}
          title="Single Pane"
        >
          ⬜
        </button>
        <button 
          className={`split-btn ${currentLayout === 'vertical' ? 'active' : ''}`}
          onClick={() => setCurrentLayout('vertical')}
          title="Vertical Split"
        >
          ⬛⬜
        </button>
        <button 
          className={`split-btn ${currentLayout === 'horizontal' ? 'active' : ''}`}
          onClick={() => setCurrentLayout('horizontal')}
          title="Horizontal Split"
        >
          ⬜<br/>⬜
        </button>
        <button 
          className={`split-btn ${currentLayout === 'grid' ? 'active' : ''}`}
          onClick={() => setCurrentLayout('grid')}
          title="Grid Layout"
        >
          ⬛⬜<br/>⬛⬜
        </button>
      </div>
      <div className="split-content">
        {renderLayout()}
      </div>
    </div>
  );
}

export { TerminalSplitPane };
export default TerminalSplitManager;
