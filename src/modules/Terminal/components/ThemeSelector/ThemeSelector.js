import React, { useState, useEffect } from 'react';
import { TERMINAL_THEMES } from '../TerminalThemes/TerminalThemes.js';
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
  const [localSettings, setLocalSettings] = useState({
    fontSize: 14,
    fontFamily: 'Monaco',
    ...currentSettings
  });

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    setLocalSettings(prev => ({ ...prev, ...currentSettings }));
  }, [currentSettings]);

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setPreviewTheme(themeId);
  };

  const handleApplyTheme = () => {
    if (selectedTheme && onThemeChange) {
      onThemeChange(selectedTheme);
    }
    if (onSettingsChange) {
      onSettingsChange(localSettings);
    }
    onClose();
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  const getDisplayTheme = () => {
    return previewTheme || selectedTheme || 'dark';
  };

  const currentThemeData = TERMINAL_THEMES[getDisplayTheme()];

  if (!isVisible) return null;

  return (
    <div className="theme-selector-overlay">
      <div className="theme-selector-modal">
        <div className="theme-selector-header">
          <h3>🎨 Terminal Themes & Settings</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="theme-selector-content">
          <div className="theme-tabs">
            <button 
              className={`theme-tab ${activeTab === 'themes' ? 'active' : ''}`}
              onClick={() => setActiveTab('themes')}
            >
              🎨 Themes
            </button>
            <button 
              className={`theme-tab ${activeTab === 'fonts' ? 'active' : ''}`}
              onClick={() => setActiveTab('fonts')}
            >
              🔤 Fonts
            </button>
          </div>

          <div className="theme-content">
            {activeTab === 'themes' && (
              <div className="themes-section">
                <div className="themes-grid">
                  {Object.entries(TERMINAL_THEMES).map(([themeId, theme]) => (
                    <div
                      key={themeId}
                      className={`theme-card ${selectedTheme === themeId ? 'selected' : ''}`}
                      onClick={() => handleThemeSelect(themeId)}
                    >
                      <div className="theme-preview" style={{
                        backgroundColor: theme.background,
                        color: theme.foreground,
                        border: `2px solid ${selectedTheme === themeId ? theme.cursor : 'transparent'}`
                      }}>
                        <div className="preview-line">
                          <span style={{ color: theme.green }}>$</span>
                          <span style={{ color: theme.blue }}> echo</span>
                          <span style={{ color: theme.yellow }}> "Hello"</span>
                        </div>
                        <div className="preview-line" style={{ color: theme.foreground }}>
                          Hello World
                        </div>
                        <div className="preview-line">
                          <span style={{ color: theme.red }}>error:</span>
                          <span> not found</span>
                        </div>
                      </div>
                      <div className="theme-name">{theme.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'fonts' && (
              <div className="fonts-section">
                <div className="setting-group">
                  <label>Font Size</label>
                  <div className="font-size-controls">
                    <button 
                      onClick={() => handleSettingChange('fontSize', Math.max(8, localSettings.fontSize - 1))}
                      disabled={localSettings.fontSize <= 8}
                    >
                      -
                    </button>
                    <span className="font-size-display">{localSettings.fontSize}px</span>
                    <button 
                      onClick={() => handleSettingChange('fontSize', Math.min(32, localSettings.fontSize + 1))}
                      disabled={localSettings.fontSize >= 32}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="setting-group">
                  <label>Font Family</label>
                  <select 
                    value={localSettings.fontFamily} 
                    onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="font-preview" style={{
                  fontSize: `${localSettings.fontSize}px`,
                  fontFamily: localSettings.fontFamily,
                  backgroundColor: currentThemeData?.background || '#1e1e1e',
                  color: currentThemeData?.foreground || '#d4d4d4'
                }}>
                  <div>The quick brown fox jumps over the lazy dog</div>
                  <div>0123456789 !@#$%^&*()_+-=[]{}|;:,./</div>
                  <div style={{ color: currentThemeData?.green }}>$ npm install --save-dev</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="theme-selector-footer">
          <div className="current-theme-info">
            <strong>Current: {currentThemeData?.name}</strong>
          </div>
          <div className="theme-actions">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleApplyTheme} className="apply-btn">
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
