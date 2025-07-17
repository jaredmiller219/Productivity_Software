import React, { useRef, useEffect, useState } from 'react';
import './CodeEditor.css';

const CodeEditor = ({
  content,
  onChange,
  language,
  fileName,
  isModified,
  onSave,
  onRevert,
  onRename,
  projectStats
}) => {
  const textareaRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showStats, setShowStats] = useState(false);
  const statsRef = useRef(null);
  const [isRenamingHeader, setIsRenamingHeader] = useState(false);
  const [headerRenameValue, setHeaderRenameValue] = useState(fileName);

  // Undo/Redo functionality
  const [history, setHistory] = useState([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Track original content (when file was first opened)
  const [originalContent] = useState(content);

  // Helper functions for formatting
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatLastModified = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  // Update line numbers when content changes
  useEffect(() => {
    const lines = content.split('\n');
    setLineNumbers(lines.map((_, index) => index + 1));
  }, [content]);

  // Handle click outside to close stats popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statsRef.current && !statsRef.current.contains(event.target)) {
        setShowStats(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Save with Ctrl+S
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
      return;
    }

    // Toggle fullscreen with F11
    if (e.key === 'F11') {
      e.preventDefault();
      setIsFullscreen(!isFullscreen);
      return;
    }

    // Increase font size with Ctrl+=
    if (e.ctrlKey && e.key === '=') {
      e.preventDefault();
      setFontSize(prev => Math.min(prev + 1, 24));
      return;
    }

    // Decrease font size with Ctrl+-
    if (e.ctrlKey && e.key === '-') {
      e.preventDefault();
      setFontSize(prev => Math.max(prev - 1, 10));
      return;
    }

    // Reset font size with Ctrl+0
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault();
      setFontSize(14);
      return;
    }

    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (e.shiftKey) {
        // Shift+Tab: Remove indentation
        const lines = content.split('\n');
        const startLine = content.substring(0, start).split('\n').length - 1;
        const endLine = content.substring(0, end).split('\n').length - 1;
        
        let newContent = '';
        let newStart = start;
        let newEnd = end;
        
        for (let i = 0; i < lines.length; i++) {
          if (i >= startLine && i <= endLine) {
            if (lines[i].startsWith('  ')) {
              lines[i] = lines[i].substring(2);
              if (i === startLine) newStart = Math.max(0, start - 2);
              if (i <= endLine) newEnd = Math.max(0, newEnd - 2);
            } else if (lines[i].startsWith('\t')) {
              lines[i] = lines[i].substring(1);
              if (i === startLine) newStart = Math.max(0, start - 1);
              if (i <= endLine) newEnd = Math.max(0, newEnd - 1);
            }
          }
        }
        
        newContent = lines.join('\n');
        onChange(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = newStart;
          textarea.selectionEnd = newEnd;
        }, 0);
      } else {
        // Tab: Add indentation
        const beforeCursor = content.substring(0, start);
        const afterCursor = content.substring(end);
        const newContent = beforeCursor + '  ' + afterCursor;
        
        onChange(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }

    // Auto-close brackets and quotes
    const autoCloseChars = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (autoCloseChars[e.key]) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        e.preventDefault();
        const beforeCursor = content.substring(0, start);
        const afterCursor = content.substring(end);
        const newContent = beforeCursor + e.key + autoCloseChars[e.key] + afterCursor;
        
        onChange(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  // Handle content changes with undo/redo support
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    onChange(newContent);

    // Add to history for undo/redo (debounced to avoid too many entries)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);

    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousContent = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextContent = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(nextContent);
    }
  };

  // Handle header file name rename
  const handleHeaderRename = () => {
    setIsRenamingHeader(true);
    setHeaderRenameValue(fileName);
  };

  const handleHeaderRenameSubmit = () => {
    if (headerRenameValue.trim() && onRename) {
      onRename(headerRenameValue.trim());
    }
    setIsRenamingHeader(false);
  };

  const handleHeaderRenameCancel = () => {
    setIsRenamingHeader(false);
    setHeaderRenameValue(fileName);
  };

  const handleHeaderRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleHeaderRenameSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleHeaderRenameCancel();
    }
  };

  // Update cursor position
  const handleSelectionChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);
    const lines = beforeCursor.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    setCursorPosition({ line, column });
  };

  // Focus the textarea when the editor is clicked
  const handleEditorClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Get syntax highlighting class
  const getSyntaxClass = () => {
    return `language-${language}`;
  };

  // Format file size
  const getFileSize = () => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`code-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="editor-header">
        <div className="editor-title">
          {isRenamingHeader ? (
            <div className="file-name-container">
              <input
                type="text"
                className="header-rename-input"
                value={headerRenameValue}
                onChange={(e) => setHeaderRenameValue(e.target.value)}
                onBlur={handleHeaderRenameSubmit}
                onKeyDown={handleHeaderRenameKeyDown}
                autoFocus
              />
              {isModified && <span className="modified-indicator">●</span>}
            </div>
          ) : (
            <span
              className="file-name clickable"
              onClick={handleHeaderRename}
              title="Click to rename file"
            >
              {fileName}
              {isModified && <span className="modified-indicator">●</span>}
            </span>
          )}
          <span className="file-info">
            {language.toUpperCase()} • {getFileSize()}
          </span>
        </div>
        
        <div className="editor-controls">
          {/* Undo/Redo buttons */}
          <div className="undo-redo-controls">
            <button
              className={`undo-btn ${historyIndex <= 0 ? 'disabled' : ''}`}
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              className={`redo-btn ${historyIndex >= history.length - 1 ? 'disabled' : ''}`}
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>

          <div className="font-controls">
            <button
              onClick={() => setFontSize(prev => Math.max(prev - 1, 10))}
              className="font-btn"
              title="Decrease font size (Ctrl+-)"
            >
              A-
            </button>
            <span className="font-size">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(prev + 1, 24))}
              className="font-btn"
              title="Increase font size (Ctrl+=)"
            >
              A+
            </button>
          </div>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="fullscreen-btn"
            title="Toggle fullscreen (F11)"
          >
            {isFullscreen ? '🗗' : '🗖'}
          </button>
          
          <button
            onClick={onSave}
            className={`save-btn ${isModified ? 'modified' : ''}`}
            title="Save file (Ctrl+S)"
          >
            💾 Save
          </button>
        </div>
      </div>

      <div className="editor-content" onClick={handleEditorClick}>
        <div className="line-numbers" style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.5
        }}>
          {lineNumbers.map(num => (
            <div key={num} className="line-number" style={{
              height: `${fontSize * 1.5}px`
            }}>
              {num}
            </div>
          ))}
        </div>
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onClick={handleSelectionChange}
          className={`code-textarea ${getSyntaxClass()}`}
          style={{ fontSize: `${fontSize}px` }}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={`Start typing your ${language} code...`}
          readOnly={false}
          disabled={false}
          tabIndex={0}
        />
      </div>

      <div className="editor-footer">
        <div className="cursor-info">
          Line {cursorPosition.line}, Column {cursorPosition.column}
        </div>

        <div className="editor-shortcuts">
          <span>Ctrl+S: Save</span>
          <span>F11: Fullscreen</span>
          <span>Ctrl+/-: Font Size</span>
        </div>

        <div className="footer-right">
          {/* Revert button - always show in debug mode when file differs from original */}
          {process.env.NODE_ENV === 'development' && content !== originalContent && (
            <button
              className="revert-btn"
              onClick={() => onChange(originalContent)}
              title="Revert file to original state"
            >
              ↶ Revert
            </button>
          )}

          {projectStats && (
            <div className="stats-container" ref={statsRef}>
              <button
                className="stats-btn"
                onClick={() => setShowStats(!showStats)}
                title="Project Statistics"
              >
                📊 Stats
              </button>
              {showStats && (
                <div className="stats-popup">
                  <div className="stats-header">Project Statistics</div>
                  <div className="stat-item">
                    <span className="stat-label">Files:</span>
                    <span className="stat-value">{projectStats.totalFiles}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Lines:</span>
                    <span className="stat-value">{projectStats.totalLines.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Characters:</span>
                    <span className="stat-value">{projectStats.totalCharacters.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Size:</span>
                    <span className="stat-value">{formatFileSize(projectStats.totalCharacters)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Modified:</span>
                    <span className="stat-value">{projectStats.modifiedFiles}</span>
                  </div>
                  <div className="stats-separator"></div>
                  <div className="stat-item">
                    <span className="stat-label">Last Modified:</span>
                    <span className="stat-value small">{formatLastModified(projectStats.lastModified)}</span>
                  </div>
                  <div className="stats-header">File Types</div>
                  {Object.entries(projectStats.fileTypes).map(([type, count]) => (
                    <div key={type} className="stat-item">
                      <span className="stat-label">{type.toUpperCase()}:</span>
                      <span className="stat-value">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="editor-status">
            {isModified ? (
              <span className="status-modified">Modified</span>
            ) : (
              <span className="status-saved">Saved</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
