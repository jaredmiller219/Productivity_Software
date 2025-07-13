import React, { useState, useRef, useEffect } from 'react';
import './RichTextEditor.css';

const FORMATTING_COMMANDS = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strikeThrough',
  SUBSCRIPT: 'subscript',
  SUPERSCRIPT: 'superscript',
  JUSTIFY_LEFT: 'justifyLeft',
  JUSTIFY_CENTER: 'justifyCenter',
  JUSTIFY_RIGHT: 'justifyRight',
  JUSTIFY_FULL: 'justifyFull',
  INSERT_UNORDERED_LIST: 'insertUnorderedList',
  INSERT_ORDERED_LIST: 'insertOrderedList',
  OUTDENT: 'outdent',
  INDENT: 'indent',
  REMOVE_FORMAT: 'removeFormat',
  CREATE_LINK: 'createLink',
  UNLINK: 'unlink',
  INSERT_IMAGE: 'insertImage',
  INSERT_HORIZONTAL_RULE: 'insertHorizontalRule'
};

const FONT_SIZES = [
  { value: '1', label: '8pt' },
  { value: '2', label: '10pt' },
  { value: '3', label: '12pt' },
  { value: '4', label: '14pt' },
  { value: '5', label: '18pt' },
  { value: '6', label: '24pt' },
  { value: '7', label: '36pt' }
];

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Palatino',
  'Garamond',
  'Bookman',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact'
];

const COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6600', '#FFCC00', '#FFFF00', '#CCFF00', '#66FF00',
  '#00FF00', '#00FF66', '#00FFCC', '#00FFFF', '#00CCFF', '#0066FF',
  '#0000FF', '#6600FF', '#CC00FF', '#FF00FF', '#FF00CC', '#FF0066'
];

function RichTextEditor({ content, onChange, placeholder = "Start writing..." }) {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !isMarkdownMode) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content, isMarkdownMode]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand(FORMATTING_COMMANDS.BOLD);
          break;
        case 'i':
          e.preventDefault();
          executeCommand(FORMATTING_COMMANDS.ITALIC);
          break;
        case 'u':
          e.preventDefault();
          executeCommand(FORMATTING_COMMANDS.UNDERLINE);
          break;
        case 'k':
          e.preventDefault();
          handleCreateLink();
          break;
        default:
          break;
      }
    }
  };

  const handleCreateLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand(FORMATTING_COMMANDS.CREATE_LINK, url);
    }
  };

  const handleInsertImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        executeCommand(FORMATTING_COMMANDS.INSERT_IMAGE, event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleBackgroundColorChange = (color) => {
    executeCommand('backColor', color);
    setShowColorPicker(false);
  };

  const handleFontSizeChange = (size) => {
    executeCommand('fontSize', size);
  };

  const handleFontFamilyChange = (fontFamily) => {
    executeCommand('fontName', fontFamily);
    setShowFontPicker(false);
  };

  const toggleMarkdownMode = () => {
    if (isMarkdownMode) {
      // Convert markdown to HTML
      setIsMarkdownMode(false);
      if (editorRef.current) {
        editorRef.current.innerHTML = markdownToHtml(markdownContent);
        handleContentChange();
      }
    } else {
      // Convert HTML to markdown
      setMarkdownContent(htmlToMarkdown(content || ''));
      setIsMarkdownMode(true);
    }
  };

  const markdownToHtml = (markdown) => {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  };

  const htmlToMarkdown = (html) => {
    // Simple HTML to markdown conversion
    return html
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gim, '![$1]($2)')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gim, '[$2]($1)')
      .replace(/<br\s*\/?>/gim, '\n')
      .replace(/<[^>]*>/gim, '');
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.BOLD)}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.ITALIC)}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.UNDERLINE)}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.STRIKETHROUGH)}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-group">
          <select
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="toolbar-select"
            title="Font Size"
          >
            <option value="">Size</option>
            {FONT_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
          
          <div className="font-picker-container">
            <button
              className="toolbar-btn"
              onClick={() => setShowFontPicker(!showFontPicker)}
              title="Font Family"
            >
              Font
            </button>
            {showFontPicker && (
              <div className="font-picker">
                {FONT_FAMILIES.map(font => (
                  <button
                    key={font}
                    className="font-option"
                    onClick={() => handleFontFamilyChange(font)}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-group">
          <div className="color-picker-container">
            <button
              className="toolbar-btn color-btn"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Text Color"
            >
              A
            </button>
            {showColorPicker && (
              <div className="color-picker">
                <div className="color-section">
                  <label>Text Color</label>
                  <div className="color-grid">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="color-section">
                  <label>Background Color</label>
                  <div className="color-grid">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                        onClick={() => handleBackgroundColorChange(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.JUSTIFY_LEFT)}
            title="Align Left"
          >
            ⬅️
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.JUSTIFY_CENTER)}
            title="Align Center"
          >
            ↔️
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.JUSTIFY_RIGHT)}
            title="Align Right"
          >
            ➡️
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.INSERT_UNORDERED_LIST)}
            title="Bullet List"
          >
            • List
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.INSERT_ORDERED_LIST)}
            title="Numbered List"
          >
            1. List
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.OUTDENT)}
            title="Decrease Indent"
          >
            ⬅
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.INDENT)}
            title="Increase Indent"
          >
            ➡
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={handleCreateLink}
            title="Insert Link (Ctrl+K)"
          >
            🔗
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.UNLINK)}
            title="Remove Link"
          >
            🔗❌
          </button>
          <button
            className="toolbar-btn"
            onClick={handleInsertImage}
            title="Insert Image"
          >
            🖼️
          </button>
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.INSERT_HORIZONTAL_RULE)}
            title="Insert Horizontal Rule"
          >
            ➖
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => executeCommand(FORMATTING_COMMANDS.REMOVE_FORMAT)}
            title="Clear Formatting"
          >
            🧹
          </button>
          <button
            className={`toolbar-btn ${isMarkdownMode ? 'active' : ''}`}
            onClick={toggleMarkdownMode}
            title="Toggle Markdown Mode"
          >
            MD
          </button>
        </div>
      </div>

      {isMarkdownMode ? (
        <textarea
          className="markdown-editor"
          value={markdownContent}
          onChange={(e) => {
            setMarkdownContent(e.target.value);
            onChange(markdownToHtml(e.target.value));
          }}
          placeholder="Write in Markdown..."
        />
      ) : (
        <div
          ref={editorRef}
          className="editor-content"
          contentEditable
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default RichTextEditor;
