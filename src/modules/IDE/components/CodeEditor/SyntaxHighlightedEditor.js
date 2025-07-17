import React, { useRef, useEffect, useState } from 'react';
import SyntaxHighlighter from '../SyntaxHighlighter/SyntaxHighlighter.js';
import './SyntaxHighlightedEditor.css';

const SyntaxHighlightedEditor = React.forwardRef(({
  content,
  onChange,
  language,
  fontSize = 14,
  className = '',
  style = {},
  placeholder = '',
  readOnly = false,
  onKeyDown,
  onSelect,
  onClick
}, ref) => {
  const textareaRef = useRef(null);

  // Expose textarea ref to parent
  React.useImperativeHandle(ref, () => textareaRef.current);
  const highlightRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sync scroll between textarea and highlight layer
  const handleScroll = (e) => {
    const { scrollTop, scrollLeft } = e.target;
    setScrollTop(scrollTop);
    setScrollLeft(scrollLeft);
    
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  };

  // Handle textarea changes
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Handle selection changes
  const handleSelectionChange = (e) => {
    if (onSelect) {
      onSelect(e);
    }
  };

  // Handle click events
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Sync textarea and highlight dimensions
  useEffect(() => {
    const syncDimensions = () => {
      if (textareaRef.current && highlightRef.current) {
        const textarea = textareaRef.current;
        const highlight = highlightRef.current;
        
        // Sync scroll position
        highlight.scrollTop = textarea.scrollTop;
        highlight.scrollLeft = textarea.scrollLeft;
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', syncDimensions);
      return () => textarea.removeEventListener('scroll', syncDimensions);
    }
  }, []);

  // Focus management
  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === highlightRef.current) {
      textareaRef.current?.focus();
    }
  };

  // Debug logging
  React.useEffect(() => {
    console.log('SyntaxHighlightedEditor rendered:', { language, contentLength: content.length });
  }, [language, content]);

  return (
    <div 
      ref={containerRef}
      className={`syntax-highlighted-editor ${className}`}
      style={style}
      onClick={handleContainerClick}
    >
      {/* Syntax highlighted background */}
      <div 
        ref={highlightRef}
        className="highlight-layer"
        style={{
          fontSize: `${fontSize}px`,
          transform: `translate(-${scrollLeft}px, -${scrollTop}px)`
        }}
      >
        <SyntaxHighlighter
          code={content + '\n'} // Add newline to prevent layout issues
          language={language}
          fontSize={fontSize}
          lineNumbers={false}
          className="highlight-content"
        />
      </div>

      {/* Transparent textarea overlay */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onSelect={handleSelectionChange}
        onClick={handleClick}
        onScroll={handleScroll}
        className="editor-textarea"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.5
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        wrap="off"
      />
    </div>
  );
});

export default SyntaxHighlightedEditor;
