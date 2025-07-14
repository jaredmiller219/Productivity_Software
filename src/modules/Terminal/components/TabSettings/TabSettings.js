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
  settings, 
  onSettingsChange,
  availableThemes = []
}) {
  const [localSettings, setLocalSettings] = useState({
    fontSize: 14,
    fontFamily: 'Monaco',
    theme: 'dark',
    cursorStyle: 'block',
    cursorBlink: true,
    bellStyle: 'none',
    scrollback: 1000,
    fastBlink: false,
    ...settings
  });

  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    setLocalSettings(prev => ({ ...prev, ...settings }));
  }, [settings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(tabId, newSettings);
  };

  const handleClose = () => {
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      fontSize: 14,
      fontFamily: 'Monaco',
      theme: 'dark',
      cursorStyle: 'block',
      cursorBlink: true,
      bellStyle: 'none',
      scrollback: 1000,
      fastBlink: false
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(tabId, defaultSettings);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terminal-tab-${tabId}-settings.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          const newSettings = { ...localSettings, ...importedSettings };
          setLocalSettings(newSettings);
          onSettingsChange(tabId, newSettings);
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="tab-settings-overlay">
      <div className="tab-settings-modal">
        <div className="tab-settings-header">
          <h3>Terminal Tab Settings</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="tab-settings-content">
          <div className="settings-tabs">
            <button 
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              🎨 Appearance
            </button>
            <button 
              className={`settings-tab ${activeTab === 'behavior' ? 'active' : ''}`}
              onClick={() => setActiveTab('behavior')}
            >
              ⚙️ Behavior
            </button>
            <button 
              className={`settings-tab ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              🔧 Advanced
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === 'appearance' && (
              <div className="settings-section">
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

                <div className="setting-group">
                  <label>Theme</label>
                  <select 
                    value={localSettings.theme} 
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    {availableThemes.map(theme => (
                      <option key={theme.id} value={theme.id}>{theme.name}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-group">
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

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={localSettings.cursorBlink}
                      onChange={(e) => handleSettingChange('cursorBlink', e.target.checked)}
                    />
                    Cursor Blink
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="settings-section">
                <div className="setting-group">
                  <label>Bell Style</label>
                  <select 
                    value={localSettings.bellStyle} 
                    onChange={(e) => handleSettingChange('bellStyle', e.target.value)}
                  >
                    {BELL_STYLES.map(style => (
                      <option key={style.value} value={style.value}>{style.label}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-group">
                  <label>Scrollback Lines</label>
                  <input 
                    type="number" 
                    min="100" 
                    max="10000" 
                    step="100"
                    value={localSettings.scrollback}
                    onChange={(e) => handleSettingChange('scrollback', parseInt(e.target.value))}
                  />
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={localSettings.fastBlink}
                      onChange={(e) => handleSettingChange('fastBlink', e.target.checked)}
                    />
                    Fast Blink
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="settings-section">
                <div className="setting-group">
                  <label>Export/Import Settings</label>
                  <div className="export-import-controls">
                    <button onClick={handleExport} className="export-btn">
                      📤 Export Settings
                    </button>
                    <label className="import-btn">
                      📥 Import Settings
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <label>Reset Settings</label>
                  <button onClick={handleReset} className="reset-btn">
                    🔄 Reset to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tab-settings-footer">
          <div className="preview-text" style={{
            fontSize: `${localSettings.fontSize}px`,
            fontFamily: localSettings.fontFamily
          }}>
            Preview: Hello Terminal! 123 $&@
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabSettings;
