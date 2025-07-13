import React, { useState } from 'react';
import './BrowserSettings.css';

const BROWSER_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  ORANGE: 'orange',
  RED: 'red',
  CUSTOM: 'custom'
};

const PRIVACY_LEVELS = {
  STANDARD: 'standard',
  STRICT: 'strict',
  CUSTOM: 'custom'
};

const DEFAULT_SETTINGS = {
  theme: BROWSER_THEMES.LIGHT,
  customTheme: {
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#0056b3'
  },
  privacy: {
    level: PRIVACY_LEVELS.STANDARD,
    blockTrackers: true,
    blockAds: false,
    blockPopups: true,
    enableDoNotTrack: true,
    clearDataOnExit: false,
    enableIncognito: false
  },
  general: {
    homepage: 'about:blank',
    searchEngine: 'google',
    downloadLocation: 'Downloads',
    enableNotifications: true,
    enableGeolocation: false,
    enableCamera: false,
    enableMicrophone: false,
    enableJavaScript: true,
    enableImages: true,
    enableCookies: true
  },
  appearance: {
    showBookmarksBar: true,
    showTabPreviews: true,
    compactMode: false,
    fontSize: 'medium',
    fontFamily: 'system',
    enableAnimations: true,
    showFavicons: true
  },
  advanced: {
    enableDeveloperTools: false,
    enableExtensions: true,
    hardwareAcceleration: true,
    enableWebGL: true,
    enableWebAssembly: true,
    userAgent: 'default',
    proxySettings: {
      type: 'none',
      host: '',
      port: '',
      username: '',
      password: ''
    }
  }
};

function BrowserSettings({ settings = DEFAULT_SETTINGS, onSettingsChange, isVisible, onClose }) {
  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_SETTINGS, ...settings });
  const [activeTab, setActiveTab] = useState('general');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorProperty, setActiveColorProperty] = useState(null);

  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
  };

  const handleNestedSettingChange = (category, parentKey, key, value) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [parentKey]: {
          ...localSettings[category][parentKey],
          [key]: value
        }
      }
    };
    setLocalSettings(newSettings);
  };

  const handleApplySettings = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleResetToDefaults = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'browser-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setLocalSettings({ ...DEFAULT_SETTINGS, ...importedSettings });
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const openColorPicker = (property) => {
    setActiveColorProperty(property);
    setShowColorPicker(true);
  };

  if (!isVisible) return null;

  const renderGeneralTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Startup</h4>
        <div className="setting-row">
          <label>Homepage</label>
          <input
            type="url"
            value={localSettings.general.homepage}
            onChange={(e) => handleSettingChange('general', 'homepage', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div className="setting-row">
          <label>Search Engine</label>
          <select
            value={localSettings.general.searchEngine}
            onChange={(e) => handleSettingChange('general', 'searchEngine', e.target.value)}
          >
            <option value="google">Google</option>
            <option value="bing">Bing</option>
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="yahoo">Yahoo</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="setting-group">
        <h4>Downloads</h4>
        <div className="setting-row">
          <label>Download Location</label>
          <input
            type="text"
            value={localSettings.general.downloadLocation}
            onChange={(e) => handleSettingChange('general', 'downloadLocation', e.target.value)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Permissions</h4>
        <div className="setting-row">
          <label>Enable Notifications</label>
          <input
            type="checkbox"
            checked={localSettings.general.enableNotifications}
            onChange={(e) => handleSettingChange('general', 'enableNotifications', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable Geolocation</label>
          <input
            type="checkbox"
            checked={localSettings.general.enableGeolocation}
            onChange={(e) => handleSettingChange('general', 'enableGeolocation', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable Camera</label>
          <input
            type="checkbox"
            checked={localSettings.general.enableCamera}
            onChange={(e) => handleSettingChange('general', 'enableCamera', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable Microphone</label>
          <input
            type="checkbox"
            checked={localSettings.general.enableMicrophone}
            onChange={(e) => handleSettingChange('general', 'enableMicrophone', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Theme</h4>
        <div className="setting-row">
          <label>Browser Theme</label>
          <select
            value={localSettings.theme}
            onChange={(e) => setLocalSettings(prev => ({ ...prev, theme: e.target.value }))}
          >
            {Object.entries(BROWSER_THEMES).map(([key, value]) => (
              <option key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        
        {localSettings.theme === BROWSER_THEMES.CUSTOM && (
          <div className="custom-theme-section">
            <div className="setting-row">
              <label>Primary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={localSettings.customTheme.primaryColor}
                  onChange={(e) => handleNestedSettingChange('customTheme', null, 'primaryColor', e.target.value)}
                />
                <span>{localSettings.customTheme.primaryColor}</span>
              </div>
            </div>
            <div className="setting-row">
              <label>Background Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={localSettings.customTheme.backgroundColor}
                  onChange={(e) => handleNestedSettingChange('customTheme', null, 'backgroundColor', e.target.value)}
                />
                <span>{localSettings.customTheme.backgroundColor}</span>
              </div>
            </div>
            <div className="setting-row">
              <label>Text Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={localSettings.customTheme.textColor}
                  onChange={(e) => handleNestedSettingChange('customTheme', null, 'textColor', e.target.value)}
                />
                <span>{localSettings.customTheme.textColor}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="setting-group">
        <h4>Interface</h4>
        <div className="setting-row">
          <label>Show Bookmarks Bar</label>
          <input
            type="checkbox"
            checked={localSettings.appearance.showBookmarksBar}
            onChange={(e) => handleSettingChange('appearance', 'showBookmarksBar', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Show Tab Previews</label>
          <input
            type="checkbox"
            checked={localSettings.appearance.showTabPreviews}
            onChange={(e) => handleSettingChange('appearance', 'showTabPreviews', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Compact Mode</label>
          <input
            type="checkbox"
            checked={localSettings.appearance.compactMode}
            onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable Animations</label>
          <input
            type="checkbox"
            checked={localSettings.appearance.enableAnimations}
            onChange={(e) => handleSettingChange('appearance', 'enableAnimations', e.target.checked)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Typography</h4>
        <div className="setting-row">
          <label>Font Size</label>
          <select
            value={localSettings.appearance.fontSize}
            onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>
        <div className="setting-row">
          <label>Font Family</label>
          <select
            value={localSettings.appearance.fontFamily}
            onChange={(e) => handleSettingChange('appearance', 'fontFamily', e.target.value)}
          >
            <option value="system">System Default</option>
            <option value="arial">Arial</option>
            <option value="helvetica">Helvetica</option>
            <option value="times">Times New Roman</option>
            <option value="courier">Courier New</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Privacy Level</h4>
        <div className="setting-row">
          <label>Protection Level</label>
          <select
            value={localSettings.privacy.level}
            onChange={(e) => handleSettingChange('privacy', 'level', e.target.value)}
          >
            <option value={PRIVACY_LEVELS.STANDARD}>Standard</option>
            <option value={PRIVACY_LEVELS.STRICT}>Strict</option>
            <option value={PRIVACY_LEVELS.CUSTOM}>Custom</option>
          </select>
        </div>
      </div>

      <div className="setting-group">
        <h4>Blocking</h4>
        <div className="setting-row">
          <label>Block Trackers</label>
          <input
            type="checkbox"
            checked={localSettings.privacy.blockTrackers}
            onChange={(e) => handleSettingChange('privacy', 'blockTrackers', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Block Ads</label>
          <input
            type="checkbox"
            checked={localSettings.privacy.blockAds}
            onChange={(e) => handleSettingChange('privacy', 'blockAds', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Block Popups</label>
          <input
            type="checkbox"
            checked={localSettings.privacy.blockPopups}
            onChange={(e) => handleSettingChange('privacy', 'blockPopups', e.target.checked)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Data & Cookies</h4>
        <div className="setting-row">
          <label>Enable Do Not Track</label>
          <input
            type="checkbox"
            checked={localSettings.privacy.enableDoNotTrack}
            onChange={(e) => handleSettingChange('privacy', 'enableDoNotTrack', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Clear Data on Exit</label>
          <input
            type="checkbox"
            checked={localSettings.privacy.clearDataOnExit}
            onChange={(e) => handleSettingChange('privacy', 'clearDataOnExit', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable Cookies</label>
          <input
            type="checkbox"
            checked={localSettings.general.enableCookies}
            onChange={(e) => handleSettingChange('general', 'enableCookies', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="settings-tab-content">
      <div className="setting-group">
        <h4>Developer</h4>
        <div className="setting-row">
          <label>Enable Developer Tools</label>
          <input
            type="checkbox"
            checked={localSettings.advanced.enableDeveloperTools}
            onChange={(e) => handleSettingChange('advanced', 'enableDeveloperTools', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable Extensions</label>
          <input
            type="checkbox"
            checked={localSettings.advanced.enableExtensions}
            onChange={(e) => handleSettingChange('advanced', 'enableExtensions', e.target.checked)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Performance</h4>
        <div className="setting-row">
          <label>Hardware Acceleration</label>
          <input
            type="checkbox"
            checked={localSettings.advanced.hardwareAcceleration}
            onChange={(e) => handleSettingChange('advanced', 'hardwareAcceleration', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable WebGL</label>
          <input
            type="checkbox"
            checked={localSettings.advanced.enableWebGL}
            onChange={(e) => handleSettingChange('advanced', 'enableWebGL', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <label>Enable WebAssembly</label>
          <input
            type="checkbox"
            checked={localSettings.advanced.enableWebAssembly}
            onChange={(e) => handleSettingChange('advanced', 'enableWebAssembly', e.target.checked)}
          />
        </div>
      </div>

      <div className="setting-group">
        <h4>Network</h4>
        <div className="setting-row">
          <label>User Agent</label>
          <select
            value={localSettings.advanced.userAgent}
            onChange={(e) => handleSettingChange('advanced', 'userAgent', e.target.value)}
          >
            <option value="default">Default</option>
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="setting-group">
        <h4>Data Management</h4>
        <div className="setting-actions">
          <button className="action-btn" onClick={handleExportSettings}>
            Export Settings
          </button>
          <label className="action-btn file-input-label">
            Import Settings
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="browser-settings-overlay">
      <div className="browser-settings-panel">
        <div className="settings-header">
          <h3>Browser Settings</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
          <button
            className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'privacy' && renderPrivacyTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
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

export { BROWSER_THEMES, DEFAULT_SETTINGS };
export default BrowserSettings;
