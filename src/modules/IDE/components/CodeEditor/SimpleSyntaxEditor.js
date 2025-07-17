import React, { useRef, useEffect } from 'react';
import Prism from 'prismjs';

// Import core Prism CSS
import 'prismjs/themes/prism-tomorrow.css';

// Import language support
import 'prismjs/components/prism-markup.js'; // HTML/XML base
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-swift.js';

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
      // JavaScript
      'javascript': 'javascript',
      'js': 'javascript',
      'jsx': 'javascript',

      // Web languages
      'html': 'markup',
      'htm': 'markup',
      'xml': 'markup',
      'css': 'css',
      'scss': 'css',
      'sass': 'css',
      'less': 'css',

      // Data formats
      'json': 'json',

      // Programming languages
      'python': 'python',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cxx': 'cpp',
      'cc': 'cpp',
      'h': 'c',
      'hpp': 'cpp',
      'csharp': 'csharp',
      'cs': 'csharp',
      'ruby': 'ruby',
      'rb': 'ruby',
      'go': 'go',
      'swift': 'swift',

      // Default fallback
      'text': 'text',
      'txt': 'text'
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
