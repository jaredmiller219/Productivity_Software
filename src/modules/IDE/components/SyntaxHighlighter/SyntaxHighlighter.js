import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';

// Import core Prism CSS
import 'prismjs/themes/prism-tomorrow.css';

// Import language support with proper dependencies
import 'prismjs/components/prism-markup.js'; // Base for HTML/XML - must be first
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-yaml.js';

import './SyntaxHighlighter.css';

const SyntaxHighlighter = ({ 
  code, 
  language, 
  fontSize = 14, 
  lineNumbers = true,
  className = '',
  style = {}
}) => {
  const codeRef = useRef(null);

  // Map file extensions to Prism language identifiers
  const getLanguageId = (lang) => {
    const languageMap = {
      // Core languages we've imported
      'javascript': 'javascript',
      'js': 'javascript',
      'jsx': 'javascript', // Use javascript for JSX for now
      'typescript': 'javascript', // Use javascript for TypeScript for now
      'ts': 'javascript',
      'tsx': 'javascript',
      'html': 'markup',
      'htm': 'markup',
      'xml': 'markup',
      'css': 'css',
      'scss': 'css', // Use css for SCSS for now
      'sass': 'css',
      'less': 'css',
      'json': 'json',
      'python': 'python',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'c', // Use c for C++ for now
      'cxx': 'c',
      'cc': 'c',
      'php': 'php',
      'sql': 'sql',
      'bash': 'bash',
      'sh': 'bash',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markup', // Use markup for markdown for now
      'markdown': 'markup',
      'text': 'text',
      'txt': 'text'
    };

    return languageMap[lang.toLowerCase()] || 'text';
  };

  useEffect(() => {
    if (codeRef.current) {
      try {
        // Re-highlight the code when content or language changes
        const prismLang = getLanguageId(language);
        console.log('Highlighting:', { language, prismLang, available: !!Prism.languages[prismLang] });

        // Only highlight if the language is supported by Prism
        if (Prism.languages[prismLang]) {
          Prism.highlightElement(codeRef.current);
          console.log('Syntax highlighting applied for:', prismLang);
        } else {
          console.warn('Language not supported:', prismLang, 'Available:', Object.keys(Prism.languages));
        }
      } catch (error) {
        console.warn('Syntax highlighting failed:', error);
        // Fallback: just display the code without highlighting
      }
    }
  }, [code, language]);

  const prismLanguage = getLanguageId(language);
  const showLineNumbers = lineNumbers && code.split('\n').length > 1;

  return (
    <div 
      className={`syntax-highlighter ${className}`}
      style={{ fontSize: `${fontSize}px`, ...style }}
    >
      <pre 
        className={`${showLineNumbers ? 'line-numbers' : ''}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <code 
          ref={codeRef}
          className={`language-${prismLanguage}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default SyntaxHighlighter;
