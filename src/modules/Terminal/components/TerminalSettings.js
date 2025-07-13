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
  shell: 'bash',
  startupCommand: '',
  workingDirectory: '~',
  environmentVariables: {},
  keyBindings: {
    copy: 'Ctrl+C',
    paste: 'Ctrl+V',
    selectAll: 'Ctrl+A',
    find: 'Ctrl+F',
    newTab: 'Ctrl+T',
    closeTab: 'Ctrl+W',
    nextTab: 'Ctrl+Tab',
    prevTab: 'Ctrl+Shift+Tab'
  }
};

const FONT_FAMILIES = [
  'Courier New',
  'Monaco',
  'Menlo',
  'Consolas',
  'DejaVu Sans Mono',
  'Liberation Mono',
  'Ubuntu Mono',
  'Fira Code',
  'Source Code Pro',
  'JetBrains Mono'
];

const CURSOR_STYLES = [
  { value: 'block', label: 'Block' },
  { value: 'underline', label: 'Underline' },
  { value: 'bar', label: 'Bar' }
];

const SHELLS = [
  { value: 'bash', label: 'Bash' },
  { value: 'zsh', label: 'Zsh' },
  { value: 'fish', label: 'Fish' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'cmd', label: 'Command Prompt' }
];

function TerminalSettings({ settings = DEFAULT_SETTINGS, onSettingsChange, isVisible, onClose }) {
  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_SETTINGS, ...settings });
  const [activeTab, setActiveTab] = useState('appearance');

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedSettingChange = (parentKey, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value
      }
    }));
  };

  const handleApplySettings = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleResetToDefaults = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  if (!isVisible) return null;

  const renderAppearanceTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Font</h4>
        <div className="setting-row">
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
        <div className="setting-row">
          <label>Font Size</label>
          <input 
            type="range" 
            min="8" 
            max="24" 
            value={localSettings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
          />
          <span className="setting-value">{localSettings.fontSize}px</span>
        </div>
        <div className="setting-row">
          <label>Line Height</label>
          <input 
            type="range" 
            min="1" 
            max="2" 
            step="0.1"
            value={localSettings.lineHeight}
            onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
          />
          <span className="setting-value">{localSettings.lineHeight}</span>
        </div>
      </div>

      <div className="setting-group">
        <h4>Cursor</h4>
        <div className="setting-row">
          <label>Cursor Style</label>
          <select 
            value={localSettings.cursorStyle} 
            onChange={(e) => handleSettingChange('cursorStyle', e.target.value)}
          >
            {CURSOR_STYLES.map(style => (
              <option key={style.value} value={style.value}>{style.label}</option>
            ))}
          </select>
        </div>
        <div className="setting-row">
          <label>Cursor Blink</label>
          <input 
            type="checkbox" 
            checked={localSettings.cursorBlink}
            onChange={(e) => handleSettingChange('cursorBlink', e.target.checked)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Transparency</h4>
        <div className="setting-row">
          <label>Allow Transparency</label>
          <input 
            type="checkbox" 
            checked={localSettings.allowTransparency}
            onChange={(e) => handleSettingChange('allowTransparency', e.target.checked)}
          />
        </div>
        {localSettings.allowTransparency && (
          <div className="setting-row">
            <label>Transparency Level</label>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1"
              value={localSettings.transparency}
              onChange={(e) => handleSettingChange('transparency', parseFloat(e.target.value))}
            />
            <span className="setting-value">{Math.round(localSettings.transparency * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Scrolling</h4>
        <div className="setting-row">
          <label>Scrollback Lines</label>
          <input 
            type="number" 
            min="100" 
            max="10000" 
            value={localSettings.scrollback}
            onChange={(e) => handleSettingChange('scrollback', parseInt(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <label>Scroll Sensitivity</label>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1"
            value={localSettings.scrollSensitivity}
            onChange={(e) => handleSettingChange('scrollSensitivity', parseFloat(e.target.value))}
          />
          <span className="setting-value">{localSettings.scrollSensitivity}x</span>
        </div>
      </div>

      <div className="setting-group">
        <h4>Text Behavior</h4>
        <div className="setting-row">
          <label>Word Wrap</label>
          <input 
            type="checkbox" 
            checked={localSettings.wordWrap}
            onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Copy on Select</label>
          <input 
            type="checkbox" 
            checked={localSettings.copyOnSelect}
            onChange={(e) => handleSettingChange('copyOnSelect', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Paste on Right Click</label>
          <input 
            type="checkbox" 
            checked={localSettings.pasteOnRightClick}
            onChange={(e) => handleSettingChange('pasteOnRightClick', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Right Click Selects Word</label>
          <input 
            type="checkbox" 
            checked={localSettings.rightClickSelectsWord}
            onChange={(e) => handleSettingChange('rightClickSelectsWord', e.target.checked)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Audio</h4>
        <div className="setting-row">
          <label>Bell Sound</label>
          <input 
            type="checkbox" 
            checked={localSettings.bellSound}
            onChange={(e) => handleSettingChange('bellSound', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderShellTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Shell Configuration</h4>
        <div className="setting-row">
          <label>Default Shell</label>
          <select 
            value={localSettings.shell} 
            onChange={(e) => handleSettingChange('shell', e.target.value)}
          >
            {SHELLS.map(shell => (
              <option key={shell.value} value={shell.value}>{shell.label}</option>
            ))}
          </select>
        </div>
        <div className="setting-row">
          <label>Working Directory</label>
          <input 
            type="text" 
            value={localSettings.workingDirectory}
            onChange={(e) => handleSettingChange('workingDirectory', e.target.value)}
            placeholder="~/Documents"
          />
        </div>
        <div className="setting-row">
          <label>Startup Command</label>
          <input 
            type="text" 
            value={localSettings.startupCommand}
            onChange={(e) => handleSettingChange('startupCommand', e.target.value)}
            placeholder="echo 'Welcome to Terminal!'"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="terminal-settings-overlay">
      <div className="terminal-settings-panel">
        <div className="settings-header">
          <h3>Terminal Settings</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`tab-btn ${activeTab === 'behavior' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavior')}
          >
            Behavior
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shell' ? 'active' : ''}`}
            onClick={() => setActiveTab('shell')}
          >
            Shell
          </button>
        </div>
        
        <div className="settings-content">
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'behavior' && renderBehaviorTab()}
          {activeTab === 'shell' && renderShellTab()}
        </div>
        
        <div className="settings-footer">
          <button className="btn-secondary" onClick={handleResetToDefaults}>
            Reset to Defaults
          </button>
          <div className="footer-right">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleApplySettings}>Apply Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_SETTINGS };
export default TerminalSettings;
