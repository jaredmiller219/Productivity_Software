import React, { useState, useRef, useEffect } from 'react';
import './AdvancedCodeEditor.css';

const LANGUAGE_KEYWORDS = {
  javascript: [
    'const', 'let', 'var', 'function', 'class', 'extends', 'import', 'export', 'default',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return',
    'try', 'catch', 'finally', 'throw', 'async', 'await', 'promise', 'then', 'catch',
    'console', 'log', 'error', 'warn', 'info', 'document', 'window', 'localStorage',
    'sessionStorage', 'JSON', 'parse', 'stringify', 'Array', 'Object', 'String', 'Number'
  ],
  python: [
    'def', 'class', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while',
    'try', 'except', 'finally', 'raise', 'return', 'yield', 'lambda', 'with', 'pass',
    'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False',
    'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed'
  ],
  html: [
    'html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style', 'div', 'span',
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'table',
    'tr', 'td', 'th', 'form', 'input', 'button', 'select', 'option', 'textarea'
  ],
  css: [
    'color', 'background', 'background-color', 'font-size', 'font-family', 'font-weight',
    'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top',
    'left', 'right', 'bottom', 'flex', 'grid', 'justify-content', 'align-items'
  ]
};

const SNIPPETS = {
  javascript: {
    'func': 'function ${1:name}(${2:params}) {\n  ${3:// body}\n}',
    'arrow': '(${1:params}) => {\n  ${2:// body}\n}',
    'class': 'class ${1:ClassName} {\n  constructor(${2:params}) {\n    ${3:// constructor}\n  }\n}',
    'if': 'if (${1:condition}) {\n  ${2:// body}\n}',
    'for': 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n  ${3:// body}\n}',
    'try': 'try {\n  ${1:// try block}\n} catch (${2:error}) {\n  ${3:// catch block}\n}'
  },
  python: {
    'def': 'def ${1:function_name}(${2:params}):\n    ${3:pass}',
    'class': 'class ${1:ClassName}:\n    def __init__(self${2:, params}):\n        ${3:pass}',
    'if': 'if ${1:condition}:\n    ${2:pass}',
    'for': 'for ${1:item} in ${2:iterable}:\n    ${3:pass}',
    'try': 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}'
  }
};

function AdvancedCodeEditor({ 
  content, 
  onChange, 
  language = 'javascript', 
  theme = 'dark',
  fontSize = 14,
  showLineNumbers = true,
  showMinimap = true,
  enableAutocomplete = true,
  enableSnippets = true
}) {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(0);
  const [autocompletePosition, setAutocompletePosition] = useState({ x: 0, y: 0 });
  const [currentWord, setCurrentWord] = useState('');
  const [diagnostics, setDiagnostics] = useState([]);
  const [foldedLines, setFoldedLines] = useState(new Set());
  
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (enableAutocomplete) {
      updateAutocomplete();
    }
  }, [content, cursorPosition, enableAutocomplete]);

  useEffect(() => {
    if (language === 'javascript') {
      runJavaScriptLinting();
    }
  }, [content, language]);

  const updateAutocomplete = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    // Get current word
    const beforeCursor = text.substring(0, cursorPos);
    const wordMatch = beforeCursor.match(/\w+$/);
    const word = wordMatch ? wordMatch[0] : '';
    
    setCurrentWord(word);

    if (word.length < 2) {
      setShowAutocomplete(false);
      return;
    }

    // Get suggestions
    const keywords = LANGUAGE_KEYWORDS[language] || [];
    const suggestions = keywords
      .filter(keyword => keyword.toLowerCase().startsWith(word.toLowerCase()))
      .map(keyword => ({ text: keyword, type: 'keyword' }));

    // Add snippets
    if (enableSnippets && SNIPPETS[language]) {
      const snippetSuggestions = Object.entries(SNIPPETS[language])
        .filter(([key]) => key.toLowerCase().startsWith(word.toLowerCase()))
        .map(([key, value]) => ({ text: key, type: 'snippet', snippet: value }));
      
      suggestions.push(...snippetSuggestions);
    }

    if (suggestions.length > 0) {
      setAutocompleteItems(suggestions);
      setSelectedAutocompleteIndex(0);
      setShowAutocomplete(true);
      
      // Calculate position
      const rect = textarea.getBoundingClientRect();
      const lines = beforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      const charWidth = 8; // Approximate character width
      const lineHeight = 20; // Approximate line height
      
      setAutocompletePosition({
        x: rect.left + (currentLine.length - word.length) * charWidth,
        y: rect.top + (lines.length - 1) * lineHeight + lineHeight
      });
    } else {
      setShowAutocomplete(false);
    }
  };

  const runJavaScriptLinting = () => {
    const lines = content.split('\n');
    const newDiagnostics = [];

    lines.forEach((line, index) => {
      // Simple linting rules
      if (line.includes('console.log') && !line.includes('//')) {
        newDiagnostics.push({
          line: index + 1,
          column: line.indexOf('console.log') + 1,
          message: 'Consider removing console.log in production',
          severity: 'warning'
        });
      }
      
      if (line.includes('var ')) {
        newDiagnostics.push({
          line: index + 1,
          column: line.indexOf('var') + 1,
          message: 'Use const or let instead of var',
          severity: 'info'
        });
      }
      
      // Check for missing semicolons
      const trimmed = line.trim();
      if (trimmed && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('*') &&
          !trimmed.startsWith('if') &&
          !trimmed.startsWith('for') &&
          !trimmed.startsWith('while') &&
          !trimmed.startsWith('function') &&
          !trimmed.startsWith('class')) {
        newDiagnostics.push({
          line: index + 1,
          column: line.length,
          message: 'Missing semicolon',
          severity: 'error'
        });
      }
    });

    setDiagnostics(newDiagnostics);
  };

  const handleKeyDown = (e) => {
    if (showAutocomplete) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedAutocompleteIndex(prev => 
            Math.min(prev + 1, autocompleteItems.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedAutocompleteIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Tab':
        case 'Enter':
          e.preventDefault();
          insertAutocomplete();
          break;
        case 'Escape':
          e.preventDefault();
          setShowAutocomplete(false);
          break;
      }
      return;
    }

    // Handle other shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          // Save file
          break;
        case 'd':
          e.preventDefault();
          duplicateLine();
          break;
        case '/':
          e.preventDefault();
          toggleComment();
          break;
        case 'f':
          e.preventDefault();
          // Open find dialog
          break;
      }
    }

    // Handle indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTab();
    }

    // Handle auto-closing brackets
    if (['(', '[', '{', '"', "'"].includes(e.key)) {
      handleAutoClose(e);
    }
  };

  const insertAutocomplete = () => {
    if (!textareaRef.current || autocompleteItems.length === 0) return;

    const textarea = textareaRef.current;
    const item = autocompleteItems[selectedAutocompleteIndex];
    const cursorPos = textarea.selectionStart;
    const text = textarea.value;
    
    // Replace current word
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);
    const wordStart = beforeCursor.lastIndexOf(currentWord);
    
    let insertText = item.text;
    if (item.type === 'snippet') {
      insertText = item.snippet.replace(/\$\{\d+:([^}]*)\}/g, '$1');
    }
    
    const newText = text.substring(0, wordStart) + insertText + afterCursor;
    onChange(newText);
    
    setShowAutocomplete(false);
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = wordStart + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertTab = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + '  ' + text.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const duplicateLine = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    // Find current line
    const beforeCursor = text.substring(0, cursorPos);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const afterCursor = text.substring(cursorPos);
    const lineEnd = afterCursor.indexOf('\n');
    const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : cursorPos + lineEnd);
    
    const newText = text.substring(0, lineStart) + currentLine + '\n' + currentLine + text.substring(lineStart + currentLine.length);
    onChange(newText);
  };

  const toggleComment = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    // Find current line
    const beforeCursor = text.substring(0, cursorPos);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const afterCursor = text.substring(cursorPos);
    const lineEnd = afterCursor.indexOf('\n');
    const lineEndPos = lineEnd === -1 ? text.length : cursorPos + lineEnd;
    const currentLine = text.substring(lineStart, lineEndPos);
    
    const commentPrefix = language === 'python' ? '# ' : '// ';
    let newLine;
    
    if (currentLine.trim().startsWith(commentPrefix.trim())) {
      // Remove comment
      newLine = currentLine.replace(new RegExp(`^(\\s*)${commentPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '$1');
    } else {
      // Add comment
      const indent = currentLine.match(/^\s*/)[0];
      newLine = indent + commentPrefix + currentLine.substring(indent.length);
    }
    
    const newText = text.substring(0, lineStart) + newLine + text.substring(lineEndPos);
    onChange(newText);
  };

  const handleAutoClose = (e) => {
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };
    
    const closing = pairs[e.key];
    if (!closing) return;
    
    e.preventDefault();
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + e.key + closing + text.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    const beforeCursor = text.substring(0, cursorPos);
    const lines = beforeCursor.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    setCursorPosition({ line, column });
  };

  const renderLineNumbers = () => {
    const lines = content.split('\n');
    return (
      <div className="line-numbers" style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1.5
      }}>
        {lines.map((_, index) => (
          <div key={index} className="line-number" style={{
            height: `${fontSize * 1.5}px`
          }}>
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderDiagnostics = () => {
    return (
      <div className="diagnostics-gutter">
        {diagnostics.map((diagnostic, index) => (
          <div
            key={index}
            className={`diagnostic-marker ${diagnostic.severity}`}
            style={{ top: `${(diagnostic.line - 1) * 20}px` }}
            title={diagnostic.message}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`advanced-code-editor ${theme}`}>
      <div className="editor-container">
        {showLineNumbers && renderLineNumbers()}
        {renderDiagnostics()}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          className="code-textarea"
          style={{ fontSize: `${fontSize}px` }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        
        {showMinimap && (
          <div className="minimap">
            <div className="minimap-content">
              {content.split('\n').map((line, index) => (
                <div key={index} className="minimap-line">
                  {line.substring(0, 50)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {showAutocomplete && (
        <div 
          className="autocomplete-popup"
          style={{
            left: autocompletePosition.x,
            top: autocompletePosition.y
          }}
        >
          {autocompleteItems.map((item, index) => (
            <div
              key={index}
              className={`autocomplete-item ${index === selectedAutocompleteIndex ? 'selected' : ''}`}
              onClick={() => {
                setSelectedAutocompleteIndex(index);
                insertAutocomplete();
              }}
            >
              <span className={`item-icon ${item.type}`}>
                {item.type === 'keyword' ? 'K' : item.type === 'snippet' ? 'S' : 'F'}
              </span>
              <span className="item-text">{item.text}</span>
              <span className="item-type">{item.type}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="editor-status">
        <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
        <span>{language.toUpperCase()}</span>
        <span>{diagnostics.length} problems</span>
      </div>
    </div>
  );
}

export default AdvancedCodeEditor;
