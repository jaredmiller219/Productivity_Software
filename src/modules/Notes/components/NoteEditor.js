import React, { useState, useRef, useEffect } from 'react';
import './NoteEditor.css';

const NoteEditor = ({ 
  currentNote, 
  onUpdateNote, 
  isRightPanel = false 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const textareaRef = useRef(null);

  // Update statistics when content changes
  useEffect(() => {
    if (currentNote.content) {
      setCharCount(currentNote.content.length);
      const words = currentNote.content.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [currentNote.content]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentNote.content]);

  const handleKeyDown = (e) => {
    // Save with Ctrl+S
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      // Note is auto-saved, just show feedback
      showSaveIndicator();
    }
    
    // Toggle fullscreen with F11
    if (e.key === 'F11') {
      e.preventDefault();
      setIsFullscreen(!isFullscreen);
    }
  };

  const showSaveIndicator = () => {
    // Could implement a save indicator here
    console.log('Note saved');
  };

  const insertText = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = currentNote.content;
    
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    onUpdateNote('content', newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const formatText = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentNote.content.substring(start, end);
    
    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        break;
    }
    
    if (formattedText !== selectedText) {
      const newContent = currentNote.content.substring(0, start) + formattedText + currentNote.content.substring(end);
      onUpdateNote('content', newContent);
    }
  };

  const getReadingTime = () => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes === 1 ? '1 min read' : `${minutes} min read`;
  };

  if (!currentNote.id) {
    return (
      <div className="note-editor-empty">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No note selected</h3>
          <p>Select a note from the list or create a new one to start writing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`note-editor ${isFullscreen ? 'fullscreen' : ''} ${isRightPanel ? 'right-panel' : ''}`}>
      <div className="editor-header">
        <input
          type="text"
          className="note-title-input"
          value={currentNote.title}
          onChange={(e) => onUpdateNote('title', e.target.value)}
          placeholder="Note title..."
        />
        
        <div className="editor-actions">
          <button
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
            title="Toggle statistics"
          >
            📊
          </button>
          <button
            className="fullscreen-toggle"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle fullscreen (F11)"
          >
            {isFullscreen ? '🗗' : '🗖'}
          </button>
        </div>
      </div>

      {showStats && (
        <div className="editor-stats">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
          <span>{getReadingTime()}</span>
          <span>Last updated: {new Date(currentNote.updatedAt || currentNote.createdAt).toLocaleString()}</span>
        </div>
      )}

      <div className="editor-toolbar">
        <button onClick={() => formatText('bold')} title="Bold">
          <strong>B</strong>
        </button>
        <button onClick={() => formatText('italic')} title="Italic">
          <em>I</em>
        </button>
        <button onClick={() => formatText('code')} title="Code">
          {'</>'}
        </button>
        <button onClick={() => formatText('link')} title="Link">
          🔗
        </button>
        <div className="toolbar-separator"></div>
        <button onClick={() => insertText('- ')} title="Bullet point">
          •
        </button>
        <button onClick={() => insertText('1. ')} title="Numbered list">
          1.
        </button>
        <button onClick={() => insertText('---\n')} title="Horizontal rule">
          ―
        </button>
      </div>

      <div className="editor-content">
        <textarea
          ref={textareaRef}
          className="note-content-input"
          value={currentNote.content}
          onChange={(e) => onUpdateNote('content', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start writing your note..."
          spellCheck="true"
        />
      </div>

      <div className="editor-footer">
        <div className="editor-shortcuts">
          <span>Ctrl+S to save</span>
          <span>F11 for fullscreen</span>
        </div>
        <div className="editor-status">
          <span className="save-status">Auto-saved</span>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
