import React, { useState, useEffect } from 'react';
import './IDESettings.css';

const DEFAULT_IDE_SETTINGS = {
  // Editor Appearance
  cursorColor: '#ffffff',
  cursorStyle: 'line',
  cursorBlinking: 'blink',
  fontSize: 14,
  fontFamily: 'SF Mono',
  fontWeight: 'normal',
  lineHeight: 1.5,
  letterSpacing: 0,

  // Theme & Colors
  theme: 'dark',
  colorScheme: 'vs-dark',
  bracketPairColorization: true,
  highlightActiveIndentGuide: true,

  // Editor Behavior
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'off',
  wordWrapColumn: 80,
  lineNumbers: 'on',
  lineNumbersMinChars: 3,

  // Code Features
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
  autoIndent: 'advanced',
  formatOnSave: false,
  formatOnPaste: false,
  formatOnType: false,

  // Advanced Features
  minimap: false,
  minimapScale: 1,
  minimapShowSlider: 'mouseover',
  scrollBeyondLastLine: true,
  smoothScrolling: false,
  mouseWheelZoom: false,

  // File & Save
  autoSave: 'afterDelay',
  autoSaveDelay: 1000,
  trimTrailingWhitespace: false,
  insertFinalNewline: false,
  trimFinalNewlines: false,

  // Search & Replace
  searchCaseSensitive: false,
  searchWholeWord: false,
  searchRegex: false,
  searchWrapAround: true,

  // Suggestions & IntelliSense
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'off',

  // Folding & Indentation
  folding: true,
  foldingStrategy: 'auto',
  showFoldingControls: 'mouseover',
  indentGuides: true,
  renderIndentGuides: true,

  // Whitespace & Rendering
  renderWhitespace: 'selection',
  renderControlCharacters: false,
  renderLineHighlight: 'line',
  occurrencesHighlight: true,

  // Scrollbar
  scrollbarHorizontalSize: 12,
  scrollbarVerticalSize: 12,
  scrollbarUseShadows: true,

  // Performance
  largeFileOptimizations: true,
  maxTokenizationLineLength: 20000,

  // Accessibility
  accessibilitySupport: 'auto',
  screenReaderAnnounceInlineSuggestion: true
};

const IDESettings = ({ isVisible, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_IDE_SETTINGS, ...settings });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [searchQuery, setSearchQuery] = useState('');

  // Update local settings when props change
  React.useEffect(() => {
    if (settings) {
      setLocalSettings({ ...DEFAULT_IDE_SETTINGS, ...settings });
    }
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Apply some settings immediately for preview
    if (key === 'fontSize' || key === 'fontFamily' || key === 'cursorColor' ||
        key === 'fontWeight' || key === 'lineHeight' || key === 'letterSpacing' ||
        key === 'tabSize' || key === 'theme') {
      onSettingsChange({ ...localSettings, [key]: value });
    }
  };

  const handleApply = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(localSettings) !== JSON.stringify({ ...DEFAULT_IDE_SETTINGS, ...settings });
    if (hasChanges) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_IDE_SETTINGS);
    onSettingsChange(DEFAULT_IDE_SETTINGS);
  };

  const handleClose = () => {
    handleCancel();
  };

  const handleCancelDialog = () => {
    setShowUnsavedDialog(false);
  };

  const handleDiscardAndClose = () => {
    setLocalSettings({ ...DEFAULT_IDE_SETTINGS, ...settings });
    setShowUnsavedDialog(false);
    onClose();
  };

  const handleSaveAndClose = () => {
    onSettingsChange(localSettings);
    setShowUnsavedDialog(false);
    onClose();
  };

  // Filter settings based on search query
  const filterSettings = (settingsObj) => {
    if (!searchQuery) return settingsObj;
    const filtered = {};
    Object.keys(settingsObj).forEach(key => {
      if (key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(settingsObj[key]).toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[key] = settingsObj[key];
      }
    });
    return filtered;
  };

  // Tab configuration
  const tabs = [
    { id: 'editor', label: 'Editor', icon: '📝' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'behavior', label: 'Behavior', icon: '⚙️' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ];

  if (!isVisible) return null;

  return (
    <div className="ide-settings-overlay">
      <div className="ide-settings-modal">
        <div className="settings-header">
          <div className="header-left">
            <h3>IDE Settings</h3>
            <div className="settings-search">
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="settings-body">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="settings-content">
            {activeTab === 'editor' && (
              <div className="settings-tab-content">
                <div className="settings-section">
                  <h4>Text & Font</h4>

                  <div className="setting-group">
                    <label htmlFor="fontSize">Font Size</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="fontSize"
                        min="8"
                        max="32"
                        value={localSettings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.fontSize}px</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="fontFamily">Font Family</label>
                    <select
                      id="fontFamily"
                      value={localSettings.fontFamily}
                      onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                    >
                      <option value="SF Mono">SF Mono</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Menlo">Menlo</option>
                      <option value="Consolas">Consolas</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Fira Code">Fira Code</option>
                      <option value="JetBrains Mono">JetBrains Mono</option>
                      <option value="Source Code Pro">Source Code Pro</option>
                      <option value="Inconsolata">Inconsolata</option>
                      <option value="Roboto Mono">Roboto Mono</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="fontWeight">Font Weight</label>
                    <select
                      id="fontWeight"
                      value={localSettings.fontWeight}
                      onChange={(e) => handleSettingChange('fontWeight', e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Lighter</option>
                      <option value="100">100 (Thin)</option>
                      <option value="300">300 (Light)</option>
                      <option value="400">400 (Normal)</option>
                      <option value="500">500 (Medium)</option>
                      <option value="600">600 (Semi Bold)</option>
                      <option value="700">700 (Bold)</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="lineHeight">Line Height</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="lineHeight"
                        min="1.0"
                        max="3.0"
                        step="0.1"
                        value={localSettings.lineHeight}
                        onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                      />
                      <span className="range-value">{localSettings.lineHeight}</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="letterSpacing">Letter Spacing</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="letterSpacing"
                        min="-2"
                        max="5"
                        step="0.1"
                        value={localSettings.letterSpacing}
                        onChange={(e) => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
                      />
                      <span className="range-value">{localSettings.letterSpacing}px</span>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Indentation & Spacing</h4>

                  <div className="setting-group">
                    <label htmlFor="tabSize">Tab Size</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="tabSize"
                        min="1"
                        max="8"
                        value={localSettings.tabSize}
                        onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.tabSize} spaces</span>
                    </div>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.insertSpaces}
                        onChange={(e) => handleSettingChange('insertSpaces', e.target.checked)}
                      />
                      <span className="checkbox-label">Insert Spaces</span>
                    </label>
                    <small>Use spaces instead of tabs for indentation</small>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Line Numbers & Guides</h4>

                  <div className="setting-group">
                    <label htmlFor="lineNumbers">Line Numbers</label>
                    <select
                      id="lineNumbers"
                      value={localSettings.lineNumbers}
                      onChange={(e) => handleSettingChange('lineNumbers', e.target.value)}
                    >
                      <option value="off">Off</option>
                      <option value="on">On</option>
                      <option value="relative">Relative</option>
                      <option value="interval">Interval</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="lineNumbersMinChars">Line Numbers Min Characters</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="lineNumbersMinChars"
                        min="1"
                        max="10"
                        value={localSettings.lineNumbersMinChars}
                        onChange={(e) => handleSettingChange('lineNumbersMinChars', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.lineNumbersMinChars}</span>
                    </div>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.indentGuides}
                        onChange={(e) => handleSettingChange('indentGuides', e.target.checked)}
                      />
                      <span className="checkbox-label">Show Indent Guides</span>
                    </label>
                    <small>Display vertical lines to show indentation levels</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.highlightActiveIndentGuide}
                        onChange={(e) => handleSettingChange('highlightActiveIndentGuide', e.target.checked)}
                      />
                      <span className="checkbox-label">Highlight Active Indent Guide</span>
                    </label>
                    <small>Highlight the indent guide of the current scope</small>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="settings-tab-content">
                <div className="settings-section">
                  <h4>Cursor</h4>

                  <div className="setting-group">
                    <label htmlFor="cursorColor">Cursor Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        id="cursorColor"
                        value={localSettings.cursorColor}
                        onChange={(e) => handleSettingChange('cursorColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={localSettings.cursorColor}
                        onChange={(e) => handleSettingChange('cursorColor', e.target.value)}
                        placeholder="#ffffff"
                        className="color-text-input"
                      />
                    </div>
                    <small>Color of the text cursor in the editor</small>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="cursorStyle">Cursor Style</label>
                    <select
                      id="cursorStyle"
                      value={localSettings.cursorStyle}
                      onChange={(e) => handleSettingChange('cursorStyle', e.target.value)}
                    >
                      <option value="line">Line</option>
                      <option value="block">Block</option>
                      <option value="underline">Underline</option>
                      <option value="line-thin">Line Thin</option>
                      <option value="block-outline">Block Outline</option>
                      <option value="underline-thin">Underline Thin</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="cursorBlinking">Cursor Blinking</label>
                    <select
                      id="cursorBlinking"
                      value={localSettings.cursorBlinking}
                      onChange={(e) => handleSettingChange('cursorBlinking', e.target.value)}
                    >
                      <option value="blink">Blink</option>
                      <option value="smooth">Smooth</option>
                      <option value="phase">Phase</option>
                      <option value="expand">Expand</option>
                      <option value="solid">Solid</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Theme & Colors</h4>

                  <div className="setting-group">
                    <label htmlFor="theme">Theme</label>
                    <select
                      id="theme"
                      value={localSettings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="high-contrast">High Contrast</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="colorScheme">Color Scheme</label>
                    <select
                      id="colorScheme"
                      value={localSettings.colorScheme}
                      onChange={(e) => handleSettingChange('colorScheme', e.target.value)}
                    >
                      <option value="vs-dark">VS Dark</option>
                      <option value="vs-light">VS Light</option>
                      <option value="hc-black">High Contrast Black</option>
                      <option value="monokai">Monokai</option>
                      <option value="solarized-dark">Solarized Dark</option>
                      <option value="solarized-light">Solarized Light</option>
                      <option value="github-dark">GitHub Dark</option>
                      <option value="github-light">GitHub Light</option>
                    </select>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.bracketPairColorization}
                        onChange={(e) => handleSettingChange('bracketPairColorization', e.target.checked)}
                      />
                      <span className="checkbox-label">Bracket Pair Colorization</span>
                    </label>
                    <small>Color matching brackets with different colors</small>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Rendering & Highlighting</h4>

                  <div className="setting-group">
                    <label htmlFor="renderLineHighlight">Line Highlight</label>
                    <select
                      id="renderLineHighlight"
                      value={localSettings.renderLineHighlight}
                      onChange={(e) => handleSettingChange('renderLineHighlight', e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="gutter">Gutter</option>
                      <option value="line">Line</option>
                      <option value="all">All</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="renderWhitespace">Render Whitespace</label>
                    <select
                      id="renderWhitespace"
                      value={localSettings.renderWhitespace}
                      onChange={(e) => handleSettingChange('renderWhitespace', e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="boundary">Boundary</option>
                      <option value="selection">Selection</option>
                      <option value="trailing">Trailing</option>
                      <option value="all">All</option>
                    </select>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.renderControlCharacters}
                        onChange={(e) => handleSettingChange('renderControlCharacters', e.target.checked)}
                      />
                      <span className="checkbox-label">Render Control Characters</span>
                    </label>
                    <small>Show control characters like tabs and line breaks</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.occurrencesHighlight}
                        onChange={(e) => handleSettingChange('occurrencesHighlight', e.target.checked)}
                      />
                      <span className="checkbox-label">Highlight Occurrences</span>
                    </label>
                    <small>Highlight all occurrences of the selected word</small>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="settings-tab-content">
                <div className="settings-section">
                  <h4>Word Wrapping</h4>

                  <div className="setting-group">
                    <label htmlFor="wordWrap">Word Wrap</label>
                    <select
                      id="wordWrap"
                      value={localSettings.wordWrap}
                      onChange={(e) => handleSettingChange('wordWrap', e.target.value)}
                    >
                      <option value="off">Off</option>
                      <option value="on">On</option>
                      <option value="wordWrapColumn">At Column</option>
                      <option value="bounded">Bounded</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="wordWrapColumn">Word Wrap Column</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="wordWrapColumn"
                        min="40"
                        max="200"
                        value={localSettings.wordWrapColumn}
                        onChange={(e) => handleSettingChange('wordWrapColumn', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.wordWrapColumn}</span>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Auto Closing</h4>

                  <div className="setting-group">
                    <label htmlFor="autoClosingBrackets">Auto Closing Brackets</label>
                    <select
                      id="autoClosingBrackets"
                      value={localSettings.autoClosingBrackets}
                      onChange={(e) => handleSettingChange('autoClosingBrackets', e.target.value)}
                    >
                      <option value="never">Never</option>
                      <option value="languageDefined">Language Defined</option>
                      <option value="beforeWhitespace">Before Whitespace</option>
                      <option value="always">Always</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="autoClosingQuotes">Auto Closing Quotes</label>
                    <select
                      id="autoClosingQuotes"
                      value={localSettings.autoClosingQuotes}
                      onChange={(e) => handleSettingChange('autoClosingQuotes', e.target.value)}
                    >
                      <option value="never">Never</option>
                      <option value="languageDefined">Language Defined</option>
                      <option value="beforeWhitespace">Before Whitespace</option>
                      <option value="always">Always</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="autoIndent">Auto Indent</label>
                    <select
                      id="autoIndent"
                      value={localSettings.autoIndent}
                      onChange={(e) => handleSettingChange('autoIndent', e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="keep">Keep</option>
                      <option value="brackets">Brackets</option>
                      <option value="advanced">Advanced</option>
                      <option value="full">Full</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Scrolling</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.scrollBeyondLastLine}
                        onChange={(e) => handleSettingChange('scrollBeyondLastLine', e.target.checked)}
                      />
                      <span className="checkbox-label">Scroll Beyond Last Line</span>
                    </label>
                    <small>Allow scrolling past the last line of the file</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.smoothScrolling}
                        onChange={(e) => handleSettingChange('smoothScrolling', e.target.checked)}
                      />
                      <span className="checkbox-label">Smooth Scrolling</span>
                    </label>
                    <small>Enable smooth scrolling animations</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.mouseWheelZoom}
                        onChange={(e) => handleSettingChange('mouseWheelZoom', e.target.checked)}
                      />
                      <span className="checkbox-label">Mouse Wheel Zoom</span>
                    </label>
                    <small>Zoom the editor with Ctrl + mouse wheel</small>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Scrollbar</h4>

                  <div className="setting-group">
                    <label htmlFor="scrollbarHorizontalSize">Horizontal Scrollbar Size</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="scrollbarHorizontalSize"
                        min="8"
                        max="20"
                        value={localSettings.scrollbarHorizontalSize}
                        onChange={(e) => handleSettingChange('scrollbarHorizontalSize', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.scrollbarHorizontalSize}px</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="scrollbarVerticalSize">Vertical Scrollbar Size</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="scrollbarVerticalSize"
                        min="8"
                        max="20"
                        value={localSettings.scrollbarVerticalSize}
                        onChange={(e) => handleSettingChange('scrollbarVerticalSize', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.scrollbarVerticalSize}px</span>
                    </div>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.scrollbarUseShadows}
                        onChange={(e) => handleSettingChange('scrollbarUseShadows', e.target.checked)}
                      />
                      <span className="checkbox-label">Use Scrollbar Shadows</span>
                    </label>
                    <small>Show shadows to indicate scrollable content</small>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="settings-tab-content">
                <div className="settings-section">
                  <h4>Auto Save</h4>

                  <div className="setting-group">
                    <label htmlFor="autoSave">Auto Save</label>
                    <select
                      id="autoSave"
                      value={localSettings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.value)}
                    >
                      <option value="off">Off</option>
                      <option value="afterDelay">After Delay</option>
                      <option value="onFocusChange">On Focus Change</option>
                      <option value="onWindowChange">On Window Change</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="autoSaveDelay">Auto Save Delay</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="autoSaveDelay"
                        min="500"
                        max="5000"
                        step="100"
                        value={localSettings.autoSaveDelay}
                        onChange={(e) => handleSettingChange('autoSaveDelay', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.autoSaveDelay}ms</span>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Formatting</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.formatOnSave}
                        onChange={(e) => handleSettingChange('formatOnSave', e.target.checked)}
                      />
                      <span className="checkbox-label">Format On Save</span>
                    </label>
                    <small>Automatically format code when saving</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.formatOnPaste}
                        onChange={(e) => handleSettingChange('formatOnPaste', e.target.checked)}
                      />
                      <span className="checkbox-label">Format On Paste</span>
                    </label>
                    <small>Automatically format pasted code</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.formatOnType}
                        onChange={(e) => handleSettingChange('formatOnType', e.target.checked)}
                      />
                      <span className="checkbox-label">Format On Type</span>
                    </label>
                    <small>Automatically format code as you type</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.trimTrailingWhitespace}
                        onChange={(e) => handleSettingChange('trimTrailingWhitespace', e.target.checked)}
                      />
                      <span className="checkbox-label">Trim Trailing Whitespace</span>
                    </label>
                    <small>Remove trailing whitespace on save</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.insertFinalNewline}
                        onChange={(e) => handleSettingChange('insertFinalNewline', e.target.checked)}
                      />
                      <span className="checkbox-label">Insert Final Newline</span>
                    </label>
                    <small>Insert a newline at the end of the file</small>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Suggestions & IntelliSense</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.quickSuggestions}
                        onChange={(e) => handleSettingChange('quickSuggestions', e.target.checked)}
                      />
                      <span className="checkbox-label">Quick Suggestions</span>
                    </label>
                    <small>Show suggestions while typing</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.suggestOnTriggerCharacters}
                        onChange={(e) => handleSettingChange('suggestOnTriggerCharacters', e.target.checked)}
                      />
                      <span className="checkbox-label">Suggest On Trigger Characters</span>
                    </label>
                    <small>Show suggestions when typing trigger characters</small>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="acceptSuggestionOnEnter">Accept Suggestion On Enter</label>
                    <select
                      id="acceptSuggestionOnEnter"
                      value={localSettings.acceptSuggestionOnEnter}
                      onChange={(e) => handleSettingChange('acceptSuggestionOnEnter', e.target.value)}
                    >
                      <option value="on">On</option>
                      <option value="off">Off</option>
                      <option value="smart">Smart</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="tabCompletion">Tab Completion</label>
                    <select
                      id="tabCompletion"
                      value={localSettings.tabCompletion}
                      onChange={(e) => handleSettingChange('tabCompletion', e.target.value)}
                    >
                      <option value="off">Off</option>
                      <option value="on">On</option>
                      <option value="onlySnippets">Only Snippets</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Code Folding</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.folding}
                        onChange={(e) => handleSettingChange('folding', e.target.checked)}
                      />
                      <span className="checkbox-label">Enable Folding</span>
                    </label>
                    <small>Allow collapsing code sections</small>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="foldingStrategy">Folding Strategy</label>
                    <select
                      id="foldingStrategy"
                      value={localSettings.foldingStrategy}
                      onChange={(e) => handleSettingChange('foldingStrategy', e.target.value)}
                    >
                      <option value="auto">Auto</option>
                      <option value="indentation">Indentation</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="showFoldingControls">Show Folding Controls</label>
                    <select
                      id="showFoldingControls"
                      value={localSettings.showFoldingControls}
                      onChange={(e) => handleSettingChange('showFoldingControls', e.target.value)}
                    >
                      <option value="always">Always</option>
                      <option value="mouseover">On Mouseover</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="settings-tab-content">
                <div className="settings-section">
                  <h4>Large Files</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.largeFileOptimizations}
                        onChange={(e) => handleSettingChange('largeFileOptimizations', e.target.checked)}
                      />
                      <span className="checkbox-label">Large File Optimizations</span>
                    </label>
                    <small>Enable optimizations for large files</small>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="maxTokenizationLineLength">Max Tokenization Line Length</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="maxTokenizationLineLength"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={localSettings.maxTokenizationLineLength}
                        onChange={(e) => handleSettingChange('maxTokenizationLineLength', parseInt(e.target.value))}
                      />
                      <span className="range-value">{localSettings.maxTokenizationLineLength}</span>
                    </div>
                    <small>Lines longer than this will not be tokenized for performance</small>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Minimap</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.minimap}
                        onChange={(e) => handleSettingChange('minimap', e.target.checked)}
                      />
                      <span className="checkbox-label">Show Minimap</span>
                    </label>
                    <small>Display a miniature overview of the file</small>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="minimapScale">Minimap Scale</label>
                    <div className="range-input-group">
                      <input
                        type="range"
                        id="minimapScale"
                        min="1"
                        max="3"
                        step="0.1"
                        value={localSettings.minimapScale}
                        onChange={(e) => handleSettingChange('minimapScale', parseFloat(e.target.value))}
                      />
                      <span className="range-value">{localSettings.minimapScale}x</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="minimapShowSlider">Minimap Show Slider</label>
                    <select
                      id="minimapShowSlider"
                      value={localSettings.minimapShowSlider}
                      onChange={(e) => handleSettingChange('minimapShowSlider', e.target.value)}
                    >
                      <option value="always">Always</option>
                      <option value="mouseover">On Mouseover</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'accessibility' && (
              <div className="settings-tab-content">
                <div className="settings-section">
                  <h4>Screen Reader</h4>

                  <div className="setting-group">
                    <label htmlFor="accessibilitySupport">Accessibility Support</label>
                    <select
                      id="accessibilitySupport"
                      value={localSettings.accessibilitySupport}
                      onChange={(e) => handleSettingChange('accessibilitySupport', e.target.value)}
                    >
                      <option value="auto">Auto</option>
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>
                    <small>Optimize the editor for screen readers</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.screenReaderAnnounceInlineSuggestion}
                        onChange={(e) => handleSettingChange('screenReaderAnnounceInlineSuggestion', e.target.checked)}
                      />
                      <span className="checkbox-label">Announce Inline Suggestions</span>
                    </label>
                    <small>Announce inline suggestions to screen readers</small>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Search Options</h4>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.searchCaseSensitive}
                        onChange={(e) => handleSettingChange('searchCaseSensitive', e.target.checked)}
                      />
                      <span className="checkbox-label">Case Sensitive Search</span>
                    </label>
                    <small>Make search case sensitive by default</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.searchWholeWord}
                        onChange={(e) => handleSettingChange('searchWholeWord', e.target.checked)}
                      />
                      <span className="checkbox-label">Whole Word Search</span>
                    </label>
                    <small>Match whole words only by default</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.searchRegex}
                        onChange={(e) => handleSettingChange('searchRegex', e.target.checked)}
                      />
                      <span className="checkbox-label">Regular Expression Search</span>
                    </label>
                    <small>Enable regex search by default</small>
                  </div>

                  <div className="setting-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={localSettings.searchWrapAround}
                        onChange={(e) => handleSettingChange('searchWrapAround', e.target.checked)}
                      />
                      <span className="checkbox-label">Search Wrap Around</span>
                    </label>
                    <small>Wrap search to beginning when reaching end</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={handleReset} className="reset-btn">
            Reset to Defaults
          </button>
          <div className="footer-right">
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleApply} className="save-btn">
              Apply & Close
            </button>
          </div>
        </div>
      </div>

      {/* Unsaved changes dialog */}
      {showUnsavedDialog && (
        <div className="unsaved-dialog-overlay">
          <div className="unsaved-dialog">
            <div className="unsaved-dialog-header">
              <h4>Unsaved Changes</h4>
            </div>
            <div className="unsaved-dialog-content">
              <p>You have unsaved changes. What would you like to do?</p>
            </div>
            <div className="unsaved-dialog-footer">
              <button onClick={handleCancelDialog} className="dialog-cancel-btn">
                Cancel
              </button>
              <button onClick={handleDiscardAndClose} className="dialog-discard-btn">
                Discard Changes
              </button>
              <button onClick={handleSaveAndClose} className="dialog-save-btn">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DEFAULT_IDE_SETTINGS };
export default IDESettings;
