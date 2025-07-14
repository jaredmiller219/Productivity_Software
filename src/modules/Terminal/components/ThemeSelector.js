import React, { useState, useEffect } from 'react';
import { TERMINAL_THEMES } from './TerminalThemes';
import './ThemeSelector.css';

const FONT_FAMILIES = [
  'SF Mono',
  'Monaco',
  'Menlo',
  'Consolas',
  'Courier New',
  'DejaVu Sans Mono',
  'Liberation Mono',
  'Source Code Pro',
  'Fira Code',
  'JetBrains Mono',
  'Cascadia Code',
  'Roboto Mono'
];

function ThemeSelector({ isVisible, onClose, currentTheme, onThemeChange, currentSettings, onSettingsChange }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [previewTheme, setPreviewTheme] = useState(null);
  const [activeTab, setActiveTab] = useState('themes');
  const [fontSettings, setFontSettings] = useState({
    fontSize: 14,
    fontFamily: 'SF Mono',
    lineHeight: 1.2,
    letterSpacing: 0,
    ...currentSettings
  });

  useEffect(() => {
    if (currentSettings) {
      setFontSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [currentSettings]);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  if (!isVisible) return null;

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    setPreviewTheme(themeName);
  };

  const handleApply = () => {
    onThemeChange(selectedTheme);
    if (onSettingsChange) {
      onSettingsChange(fontSettings);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedTheme(currentTheme);
    setPreviewTheme(null);
    setFontSettings(prev => ({ ...prev, ...currentSettings }));
    onClose();
  };

  const handleFontSettingChange = (key, value) => {
    setFontSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderThemePreview = (themeName, theme) => {
    const isSelected = selectedTheme === themeName;
    const isPreview = previewTheme === themeName;
    
    return (
      <div
        key={themeName}
        className={`theme-card ${isSelected ? 'selected' : ''} ${isPreview ? 'preview' : ''}`}
        onClick={() => handleThemeSelect(themeName)}
        onMouseEnter={() => setPreviewTheme(themeName)}
        onMouseLeave={() => setPreviewTheme(null)}
      >
        <div className="theme-preview" style={{ backgroundColor: theme.background }}>
          <div className="preview-header" style={{ backgroundColor: theme.black, color: theme.foreground }}>
            <div className="preview-title">{theme.name}</div>
            <div className="preview-controls">
              <span style={{ color: theme.red }}>●</span>
              <span style={{ color: theme.yellow }}>●</span>
              <span style={{ color: theme.green }}>●</span>
            </div>
          </div>
          <div className="preview-content" style={{ color: theme.foreground }}>
            <div className="preview-line">
              <span style={{ color: theme.green }}>user@system</span>
              <span style={{ color: theme.foreground }}>:</span>
              <span style={{ color: theme.blue }}>~</span>
              <span style={{ color: theme.foreground }}>$ </span>
              <span style={{ color: theme.cyan }}>ls -la</span>
            </div>
            <div className="preview-line">
              <span style={{ color: theme.blue }}>drwxr-xr-x</span>
              <span style={{ color: theme.foreground }}> 2 user user 4096 </span>
              <span style={{ color: theme.yellow }}>Dec 25 12:00</span>
              <span style={{ color: theme.cyan }}> Documents</span>
            </div>
            <div className="preview-line">
              <span style={{ color: theme.green }}>-rw-r--r--</span>
              <span style={{ color: theme.foreground }}> 1 user user 1024 </span>
              <span style={{ color: theme.yellow }}>Dec 25 12:00</span>
              <span style={{ color: theme.white }}> file.txt</span>
            </div>
            <div className="preview-line">
              <span style={{ color: theme.green }}>user@system</span>
              <span style={{ color: theme.foreground }}>:</span>
              <span style={{ color: theme.blue }}>~</span>
              <span style={{ color: theme.foreground }}>$ </span>
              <span 
                className="cursor-blink" 
                style={{ backgroundColor: theme.cursor, color: theme.background }}
              >
                █
              </span>
            </div>
          </div>
        </div>
        <div className="theme-info">
          <h4>{theme.name}</h4>
          <p>{getThemeDescription(themeName)}</p>
          <div className="color-palette">
            {[theme.red, theme.green, theme.yellow, theme.blue, theme.magenta, theme.cyan].map((color, index) => (
              <div 
                key={index} 
                className="color-swatch" 
                style={{ backgroundColor: color }}
                title={['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan'][index]}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getThemeDescription = (themeName) => {
    const descriptions = {
      cyber: 'Matrix-inspired green on black with high contrast',
      neon: 'Electric blue with modern gradient backgrounds',
      matrix: 'Classic green matrix terminal styling',
      synthwave: 'Retro-futuristic purple and magenta theme',
      solarized_dark: 'Popular dark theme with balanced colors',
      dracula: 'Dark theme with purple accents'
    };
    return descriptions[themeName] || 'Custom terminal theme';
  };

  return (
    <div className="theme-selector-overlay">
      <div className="theme-selector-window">
        <div className="window-header">
          <h2>🎨 Terminal Themes</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>
        
        <div className="theme-selector-tabs">
          <button
            className={`tab-btn ${activeTab === 'themes' ? 'active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            🎨 Themes
          </button>
          <button
            className={`tab-btn ${activeTab === 'fonts' ? 'active' : ''}`}
            onClick={() => setActiveTab('fonts')}
          >
            🔤 Fonts
          </button>
        </div>

        <div className="window-content">
          {activeTab === 'themes' && (
            <div className="themes-grid">
              {Object.entries(TERMINAL_THEMES).map(([themeName, theme]) =>
                renderThemePreview(themeName, theme)
              )}
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="font-settings">
              <div className="font-section">
                <h3>🔤 Typography Settings</h3>

                <div className="setting-row">
                  <label>Font Family</label>
                  <select
                    value={fontSettings.fontFamily}
                    onChange={(e) => handleFontSettingChange('fontFamily', e.target.value)}
                    className="font-select"
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-row">
                  <label>Font Size</label>
                  <div className="range-input-group">
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={fontSettings.fontSize}
                      onChange={(e) => handleFontSettingChange('fontSize', parseInt(e.target.value))}
                      className="range-input"
                    />
                    <input
                      type="number"
                      min="8"
                      max="32"
                      value={fontSettings.fontSize}
                      onChange={(e) => handleFontSettingChange('fontSize', parseInt(e.target.value))}
                      className="number-input"
                    />
                    <span className="unit">px</span>
                  </div>
                </div>

                <div className="setting-row">
                  <label>Line Height</label>
                  <div className="range-input-group">
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.1"
                      value={fontSettings.lineHeight}
                      onChange={(e) => handleFontSettingChange('lineHeight', parseFloat(e.target.value))}
                      className="range-input"
                    />
                    <input
                      type="number"
                      min="1"
                      max="2"
                      step="0.1"
                      value={fontSettings.lineHeight}
                      onChange={(e) => handleFontSettingChange('lineHeight', parseFloat(e.target.value))}
                      className="number-input"
                    />
                  </div>
                </div>

                <div className="setting-row">
                  <label>Letter Spacing</label>
                  <div className="range-input-group">
                    <input
                      type="range"
                      min="-2"
                      max="5"
                      step="0.1"
                      value={fontSettings.letterSpacing}
                      onChange={(e) => handleFontSettingChange('letterSpacing', parseFloat(e.target.value))}
                      className="range-input"
                    />
                    <input
                      type="number"
                      min="-2"
                      max="5"
                      step="0.1"
                      value={fontSettings.letterSpacing}
                      onChange={(e) => handleFontSettingChange('letterSpacing', parseFloat(e.target.value))}
                      className="number-input"
                    />
                    <span className="unit">px</span>
                  </div>
                </div>

                <div className="font-preview">
                  <h4>Preview</h4>
                  <div
                    className="preview-text"
                    style={{
                      fontFamily: fontSettings.fontFamily,
                      fontSize: `${fontSettings.fontSize}px`,
                      lineHeight: fontSettings.lineHeight,
                      letterSpacing: `${fontSettings.letterSpacing}px`,
                      background: TERMINAL_THEMES[selectedTheme]?.background || '#0d1117',
                      color: TERMINAL_THEMES[selectedTheme]?.foreground || '#f0f6fc',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(240, 246, 252, 0.1)'
                    }}
                  >
                    <div>$ npm install --save react</div>
                    <div style={{ color: TERMINAL_THEMES[selectedTheme]?.green || '#56d364' }}>
                      ✓ Package installed successfully
                    </div>
                    <div>$ git commit -m "Add new feature"</div>
                    <div style={{ color: TERMINAL_THEMES[selectedTheme]?.blue || '#58a6ff' }}>
                      [main 1a2b3c4] Add new feature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="theme-details">
            {(previewTheme || selectedTheme) && (
              <div className="current-theme-info">
                <h3>Theme Details</h3>
                <div className="theme-properties">
                  <div className="property-group">
                    <h4>Colors</h4>
                    <div className="color-grid">
                      {Object.entries(TERMINAL_THEMES[previewTheme || selectedTheme]).map(([key, value]) => {
                        if (key === 'name') return null;
                        return (
                          <div key={key} className="color-property">
                            <div 
                              className="color-preview" 
                              style={{ backgroundColor: value }}
                            />
                            <span className="color-name">{key}</span>
                            <span className="color-value">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="window-footer">
          <div className="footer-info">
            {activeTab === 'themes' && (
              <span>Theme: {TERMINAL_THEMES[selectedTheme]?.name}</span>
            )}
            {activeTab === 'fonts' && (
              <span>Font: {fontSettings.fontFamily} {fontSettings.fontSize}px</span>
            )}
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleApply}>
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
