import React, { useState, useEffect } from 'react';
import './TabSettings.css';

const FONT_FAMILIES = [
  'Courier New',
  'Monaco',
  'Menlo',
  'Consolas',
  'DejaVu Sans Mono',
  'Liberation Mono',
  'Source Code Pro',
  'Fira Code',
  'JetBrains Mono',
  'Cascadia Code'
];

const CURSOR_STYLES = [
  { value: 'block', label: 'Block' },
  { value: 'underline', label: 'Underline' },
  { value: 'bar', label: 'Bar' }
];

const BELL_STYLES = [
  { value: 'none', label: 'None' },
  { value: 'sound', label: 'Sound' },
  { value: 'visual', label: 'Visual' }
];

function TabSettings({ 
  isVisible, 
  onClose, 
  tabId, 
  currentSettings, 
  onSettingsChange,
  availableThemes 
}) {
  const [settings, setSettings] = useState({
    fontSize: 14,
    fontFamily: 'Courier New',
    lineHeight: 1.2,
    theme: 'cyber',
    opacity: 1,
    cursorStyle: 'block',
    cursorBlink: true,
    bellStyle: 'none',
    scrollback: 1000,
    fastScrollModifier: 'alt',
    macOptionIsMeta: false,
    rightClickSelectsWord: true,
    copyOnSelect: false,
    pasteOnRightClick: true,
    wordSeparator: ' ()[]{}\'"`',
    allowTransparency: false,
    drawBoldTextInBrightColors: true,
    fontWeight: 'normal',
    fontWeightBold: 'bold',
    letterSpacing: 0,
    tabStopWidth: 8,
    ...currentSettings
  });

  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    if (currentSettings) {
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [currentSettings]);

  if (!isVisible) return null;

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleApply = () => {
    onSettingsChange(tabId, settings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      fontSize: 14,
      fontFamily: 'Courier New',
      lineHeight: 1.2,
      theme: 'cyber',
      opacity: 1,
      cursorStyle: 'block',
      cursorBlink: true,
      bellStyle: 'none',
      scrollback: 1000,
      fastScrollModifier: 'alt',
      macOptionIsMeta: false,
      rightClickSelectsWord: true,
      copyOnSelect: false,
      pasteOnRightClick: true,
      wordSeparator: ' ()[]{}\'"`',
      allowTransparency: false,
      drawBoldTextInBrightColors: true,
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      letterSpacing: 0,
      tabStopWidth: 8
    };
    setSettings(defaultSettings);
  };

  const renderAppearanceTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h4>🎨 Font & Typography</h4>
        
        <div className="setting-row">
          <label>Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
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
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
            />
            <input
              type="number"
              min="8"
              max="32"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
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
              value={settings.lineHeight}
              onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
            />
            <input
              type="number"
              min="1"
              max="2"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
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
              value={settings.letterSpacing}
              onChange={(e) => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
            />
            <input
              type="number"
              min="-2"
              max="5"
              step="0.1"
              value={settings.letterSpacing}
              onChange={(e) => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
              className="number-input"
            />
            <span className="unit">px</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4>🎭 Visual Effects</h4>
        
        <div className="setting-row">
          <label>Opacity</label>
          <div className="range-input-group">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.opacity}
              onChange={(e) => handleSettingChange('opacity', parseFloat(e.target.value))}
            />
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.opacity}
              onChange={(e) => handleSettingChange('opacity', parseFloat(e.target.value))}
              className="number-input"
            />
          </div>
        </div>

        <div className="setting-row">
          <label>Allow Transparency</label>
          <input
            type="checkbox"
            checked={settings.allowTransparency}
            onChange={(e) => handleSettingChange('allowTransparency', e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <label>Bright Colors for Bold Text</label>
          <input
            type="checkbox"
            checked={settings.drawBoldTextInBrightColors}
            onChange={(e) => handleSettingChange('drawBoldTextInBrightColors', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h4>🖱️ Cursor & Input</h4>
        
        <div className="setting-row">
          <label>Cursor Style</label>
          <select
            value={settings.cursorStyle}
            onChange={(e) => handleSettingChange('cursorStyle', e.target.value)}
          >
            {CURSOR_STYLES.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-row">
          <label>Cursor Blink</label>
          <input
            type="checkbox"
            checked={settings.cursorBlink}
            onChange={(e) => handleSettingChange('cursorBlink', e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <label>Tab Stop Width</label>
          <input
            type="number"
            min="1"
            max="16"
            value={settings.tabStopWidth}
            onChange={(e) => handleSettingChange('tabStopWidth', parseInt(e.target.value))}
            className="number-input"
          />
        </div>
      </div>

      <div className="settings-section">
        <h4>🔔 Notifications & Alerts</h4>
        
        <div className="setting-row">
          <label>Bell Style</label>
          <select
            value={settings.bellStyle}
            onChange={(e) => handleSettingChange('bellStyle', e.target.value)}
          >
            {BELL_STYLES.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h4>📜 Scrolling & History</h4>
        
        <div className="setting-row">
          <label>Scrollback Lines</label>
          <input
            type="number"
            min="100"
            max="10000"
            step="100"
            value={settings.scrollback}
            onChange={(e) => handleSettingChange('scrollback', parseInt(e.target.value))}
            className="number-input"
          />
        </div>

        <div className="setting-row">
          <label>Fast Scroll Modifier</label>
          <select
            value={settings.fastScrollModifier}
            onChange={(e) => handleSettingChange('fastScrollModifier', e.target.value)}
          >
            <option value="alt">Alt</option>
            <option value="ctrl">Ctrl</option>
            <option value="shift">Shift</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h4>⚙️ Advanced Options</h4>
        
        <div className="setting-row">
          <label>Copy on Select</label>
          <input
            type="checkbox"
            checked={settings.copyOnSelect}
            onChange={(e) => handleSettingChange('copyOnSelect', e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <label>Paste on Right Click</label>
          <input
            type="checkbox"
            checked={settings.pasteOnRightClick}
            onChange={(e) => handleSettingChange('pasteOnRightClick', e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <label>Right Click Selects Word</label>
          <input
            type="checkbox"
            checked={settings.rightClickSelectsWord}
            onChange={(e) => handleSettingChange('rightClickSelectsWord', e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <label>Mac Option is Meta</label>
          <input
            type="checkbox"
            checked={settings.macOptionIsMeta}
            onChange={(e) => handleSettingChange('macOptionIsMeta', e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <label>Word Separator Characters</label>
          <input
            type="text"
            value={settings.wordSeparator}
            onChange={(e) => handleSettingChange('wordSeparator', e.target.value)}
            className="text-input"
            placeholder="Characters that separate words"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="tab-settings-overlay">
      <div className="tab-settings-window">
        <div className="window-header">
          <h2>⚙️ Terminal Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            🎨 Appearance
          </button>
          <button
            className={`tab-btn ${activeTab === 'behavior' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavior')}
          >
            🖱️ Behavior
          </button>
          <button
            className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            ⚙️ Advanced
          </button>
        </div>
        
        <div className="window-content">
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'behavior' && renderBehaviorTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>
        
        <div className="window-footer">
          <div className="footer-info">
            <span>Tab: Terminal {tabId}</span>
          </div>
          <div className="footer-actions">
            <button className="btn-reset" onClick={handleReset}>
              Reset to Defaults
            </button>
            <button className="btn-secondary" onClick={onClose}>
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

export default TabSettings;
