import React, { useState } from 'react';
import './TerminalSettings.css';

const DEFAULT_SETTINGS = {
  fontSize: 14,
  fontFamily: 'Courier New',
  lineHeight: 1.2,
  cursorStyle: 'block',
  cursorBlink: true,
  scrollback: 1000,
  bellSound: true,
  wordWrap: true,
  fastScrollModifier: 'alt',
  scrollSensitivity: 1,
  macOptionIsMeta: false,
  rightClickSelectsWord: true,
  copyOnSelect: false,
  pasteOnRightClick: true,
  allowTransparency: false,
  transparency: 0.9,
  theme: 'dark'
};

const TerminalSettings = ({ isVisible, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_SETTINGS, ...settings });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    onSettingsChange(DEFAULT_SETTINGS);
  };

  if (!isVisible) return null;

  return (
    <div className="terminal-settings-overlay">
      <div className="terminal-settings-modal">
        <div className="settings-header">
          <h3>Terminal Settings</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h4>Appearance</h4>
            
            <div className="setting-group">
              <label>Font Size</label>
              <input
                type="range"
                min="8"
                max="32"
                value={localSettings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
              />
              <span>{localSettings.fontSize}px</span>
            </div>

            <div className="setting-group">
              <label>Font Family</label>
              <select
                value={localSettings.fontFamily}
                onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
              >
                <option value="Courier New">Courier New</option>
                <option value="Monaco">Monaco</option>
                <option value="Menlo">Menlo</option>
                <option value="Consolas">Consolas</option>
                <option value="DejaVu Sans Mono">DejaVu Sans Mono</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Cursor Style</label>
              <select
                value={localSettings.cursorStyle}
                onChange={(e) => handleSettingChange('cursorStyle', e.target.value)}
              >
                <option value="block">Block</option>
                <option value="underline">Underline</option>
                <option value="bar">Bar</option>
              </select>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.cursorBlink}
                  onChange={(e) => handleSettingChange('cursorBlink', e.target.checked)}
                />
                Cursor Blink
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h4>Behavior</h4>
            
            <div className="setting-group">
              <label>Scrollback Lines</label>
              <input
                type="number"
                min="100"
                max="10000"
                value={localSettings.scrollback}
                onChange={(e) => handleSettingChange('scrollback', parseInt(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.bellSound}
                  onChange={(e) => handleSettingChange('bellSound', e.target.checked)}
                />
                Bell Sound
              </label>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.wordWrap}
                  onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
                />
                Word Wrap
              </label>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.copyOnSelect}
                  onChange={(e) => handleSettingChange('copyOnSelect', e.target.checked)}
                />
                Copy on Select
              </label>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={handleReset} className="reset-btn">
            Reset to Defaults
          </button>
          <button onClick={onClose} className="save-btn">
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export { DEFAULT_SETTINGS };
export default TerminalSettings;
