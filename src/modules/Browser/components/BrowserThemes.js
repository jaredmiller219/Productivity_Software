import React, { useState } from 'react';
import './BrowserThemes.css';

const PREDEFINED_THEMES = {
  light: {
    name: 'Light',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#333333',
      textSecondary: '#6c757d',
      border: '#e9ecef',
      accent: '#0056b3',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#495057',
      accent: '#0b5ed7',
      success: '#198754',
      warning: '#fd7e14',
      error: '#dc3545',
      info: '#0dcaf0'
    }
  },
  blue: {
    name: 'Ocean Blue',
    colors: {
      primary: '#0077be',
      secondary: '#4a90a4',
      background: '#f0f8ff',
      surface: '#e6f3ff',
      text: '#1e3a8a',
      textSecondary: '#475569',
      border: '#bfdbfe',
      accent: '#1e40af',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0891b2'
    }
  },
  green: {
    name: 'Forest Green',
    colors: {
      primary: '#16a085',
      secondary: '#27ae60',
      background: '#f0fff4',
      surface: '#e6fffa',
      text: '#064e3b',
      textSecondary: '#374151',
      border: '#a7f3d0',
      accent: '#047857',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    }
  },
  purple: {
    name: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87',
      textSecondary: '#4c1d95',
      border: '#c4b5fd',
      accent: '#7c3aed',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    }
  },
  orange: {
    name: 'Sunset Orange',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      background: '#fff7ed',
      surface: '#ffedd5',
      text: '#9a3412',
      textSecondary: '#c2410c',
      border: '#fed7aa',
      accent: '#ea580c',
      success: '#10b981',
      warning: '#eab308',
      error: '#ef4444',
      info: '#06b6d4'
    }
  },
  red: {
    name: 'Cherry Red',
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      background: '#fef2f2',
      surface: '#fee2e2',
      text: '#7f1d1d',
      textSecondary: '#991b1b',
      border: '#fecaca',
      accent: '#b91c1c',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    }
  }
};

function BrowserThemes({ currentTheme, onThemeChange, isVisible, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [customTheme, setCustomTheme] = useState({
    name: 'Custom Theme',
    colors: { ...PREDEFINED_THEMES.light.colors }
  });
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const handleThemeSelect = (themeKey) => {
    setSelectedTheme(themeKey);
  };

  const handleApplyTheme = () => {
    if (selectedTheme === 'custom') {
      onThemeChange(customTheme);
    } else {
      onThemeChange(PREDEFINED_THEMES[selectedTheme]);
    }
    onClose();
  };

  const handleCustomColorChange = (colorKey, value) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const generateThemePreview = (theme) => {
    return {
      background: theme.colors.background,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`
    };
  };

  const generateAccentPreview = (theme) => {
    return {
      background: theme.colors.primary,
      color: theme.colors.background
    };
  };

  if (!isVisible) return null;

  return (
    <div className="browser-themes-overlay">
      <div className="browser-themes-panel">
        <div className="themes-header">
          <h3>Browser Themes</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="themes-content">
          <div className="themes-grid">
            {Object.entries(PREDEFINED_THEMES).map(([key, theme]) => (
              <div
                key={key}
                className={`theme-card ${selectedTheme === key ? 'selected' : ''}`}
                onClick={() => handleThemeSelect(key)}
              >
                <div className="theme-preview" style={generateThemePreview(theme)}>
                  <div className="preview-header" style={generateAccentPreview(theme)}>
                    <div className="preview-title">{theme.name}</div>
                    <div className="preview-controls">
                      <span>●</span>
                      <span>●</span>
                      <span>●</span>
                    </div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-text" style={{ color: theme.colors.text }}>
                      Sample text content
                    </div>
                    <div className="preview-button" style={generateAccentPreview(theme)}>
                      Button
                    </div>
                    <div className="preview-secondary" style={{ color: theme.colors.textSecondary }}>
                      Secondary text
                    </div>
                  </div>
                </div>
                <div className="theme-name">{theme.name}</div>
              </div>
            ))}

            <div
              className={`theme-card custom-theme ${selectedTheme === 'custom' ? 'selected' : ''}`}
              onClick={() => {
                handleThemeSelect('custom');
                setShowCustomEditor(true);
              }}
            >
              <div className="theme-preview" style={generateThemePreview(customTheme)}>
                <div className="preview-header" style={generateAccentPreview(customTheme)}>
                  <div className="preview-title">Custom</div>
                  <div className="preview-controls">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-text" style={{ color: customTheme.colors.text }}>
                    Custom theme
                  </div>
                  <div className="preview-button" style={generateAccentPreview(customTheme)}>
                    Button
                  </div>
                  <div className="preview-secondary" style={{ color: customTheme.colors.textSecondary }}>
                    Customize colors
                  </div>
                </div>
              </div>
              <div className="theme-name">Custom Theme</div>
            </div>
          </div>

          {showCustomEditor && selectedTheme === 'custom' && (
            <div className="custom-theme-editor">
              <h4>Customize Theme Colors</h4>
              <div className="color-inputs-grid">
                {Object.entries(customTheme.colors).map(([colorKey, colorValue]) => (
                  <div key={colorKey} className="color-input-row">
                    <label>{colorKey.charAt(0).toUpperCase() + colorKey.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={colorValue}
                        onChange={(e) => handleCustomColorChange(colorKey, e.target.value)}
                      />
                      <input
                        type="text"
                        value={colorValue}
                        onChange={(e) => handleCustomColorChange(colorKey, e.target.value)}
                        className="color-hex-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="custom-theme-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCustomEditor(false)}
                >
                  Close Editor
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    // Reset to light theme colors
                    setCustomTheme(prev => ({
                      ...prev,
                      colors: { ...PREDEFINED_THEMES.light.colors }
                    }));
                  }}
                >
                  Reset Colors
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="themes-footer">
          <div className="theme-info">
            {selectedTheme !== 'custom' && PREDEFINED_THEMES[selectedTheme] && (
              <span>Selected: {PREDEFINED_THEMES[selectedTheme].name}</span>
            )}
            {selectedTheme === 'custom' && (
              <span>Selected: Custom Theme</span>
            )}
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleApplyTheme}>Apply Theme</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PREDEFINED_THEMES };
export default BrowserThemes;
