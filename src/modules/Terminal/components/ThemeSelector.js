import React, { useState } from 'react';
import { TERMINAL_THEMES } from './TerminalThemes';
import './ThemeSelector.css';

function ThemeSelector({ isVisible, onClose, currentTheme, onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [previewTheme, setPreviewTheme] = useState(null);

  if (!isVisible) return null;

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    setPreviewTheme(themeName);
  };

  const handleApply = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTheme(currentTheme);
    setPreviewTheme(null);
    onClose();
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
        
        <div className="window-content">
          <div className="themes-grid">
            {Object.entries(TERMINAL_THEMES).map(([themeName, theme]) =>
              renderThemePreview(themeName, theme)
            )}
          </div>
          
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
            <span>Selected: {TERMINAL_THEMES[selectedTheme]?.name}</span>
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleApply}>
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
