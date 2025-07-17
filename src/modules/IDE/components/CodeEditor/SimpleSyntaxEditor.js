import React, { useRef, useEffect } from 'react';
import Prism from 'prismjs';

// Import core Prism CSS
import 'prismjs/themes/prism-tomorrow.css';

// Import basic languages
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';

import './SimpleSyntaxEditor.css';

const SimpleSyntaxEditor = React.forwardRef(({
  content,
  onChange,
  language,
  fontSize = 14,
  onKeyDown,
  onSelect,
  onClick
}, ref) => {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  // Expose textarea ref to parent
  React.useImperativeHandle(ref, () => textareaRef.current);

  // Map language to Prism language
  const getPrismLanguage = (lang) => {
    const map = {
      'javascript': 'javascript',
      'js': 'javascript',
      'html': 'markup',
      'css': 'css',
      'json': 'json'
    };
    return map[lang.toLowerCase()] || 'javascript';
  };

  // Sync scroll between textarea and highlight
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Update highlighting
  useEffect(() => {
    if (highlightRef.current) {
      const prismLang = getPrismLanguage(language);
      console.log('Applying syntax highlighting:', { language, prismLang });
      
      try {
        if (Prism.languages[prismLang]) {
          const highlighted = Prism.highlight(content, Prism.languages[prismLang], prismLang);
          highlightRef.current.innerHTML = highlighted;
          console.log('Highlighting applied successfully');
        } else {
          highlightRef.current.textContent = content;
          console.log('Language not supported, showing plain text');
        }
      } catch (error) {
        console.error('Highlighting failed:', error);
        highlightRef.current.textContent = content;
      }
    }
  }, [content, language]);

  return (
    <div className="simple-syntax-editor" ref={containerRef}>
      {/* Highlighted background */}
      <pre 
        ref={highlightRef}
        className="highlight-background"
        style={{ fontSize: `${fontSize}px` }}
        aria-hidden="true"
      />
      
      {/* Transparent textarea overlay */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onSelect={onSelect}
        onClick={onClick}
        onScroll={handleScroll}
        className="editor-input"
        style={{ fontSize: `${fontSize}px` }}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        wrap="off"
      />
    </div>
  );
});

export default SimpleSyntaxEditor;
