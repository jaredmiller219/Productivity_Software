import { useState } from 'react';
import './NotesSettings.css';

const NotesSettings = ({ isVisible, onClose, settings, onSettingsChange, theme, onToggleTheme }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState('editor');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    onSettingsChange(localSettings);
    setHasUnsavedChanges(false);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  // Tab configuration
  const tabs = [
    { id: 'editor', label: 'Editor', icon: '📝' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'behavior', label: 'Behavior', icon: '⚙️' },
    { id: 'export', label: 'Export', icon: '💾' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <div className="notes-settings-tab-content">
            <div className="notes-settings-section">
              <h4>Editor Settings</h4>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.autoSave || true}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                  Auto-save notes
                </label>
                <small>Automatically save changes as you type</small>
              </div>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.spellCheck || false}
                    onChange={(e) => handleSettingChange('spellCheck', e.target.checked)}
                  />
                  Enable spell check
                </label>
                <small>Check spelling while typing</small>
              </div>

              <div className="notes-setting-group">
                <label htmlFor="fontSize">Font Size</label>
                <select
                  id="fontSize"
                  value={localSettings.fontSize || 'medium'}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              <div className="notes-setting-group">
                <label htmlFor="fontFamily">Font Family</label>
                <select
                  id="fontFamily"
                  value={localSettings.fontFamily || 'system'}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                >
                  <option value="system">System Default</option>
                  <option value="serif">Serif</option>
                  <option value="sans-serif">Sans Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.showLineNumbers || false}
                    onChange={(e) => handleSettingChange('showLineNumbers', e.target.checked)}
                  />
                  Show line numbers
                </label>
                <small>Display line numbers in the editor</small>
              </div>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.wordWrap || true}
                    onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
                  />
                  Word wrap
                </label>
                <small>Wrap long lines to fit the editor width</small>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="notes-settings-tab-content">
            <div className="notes-settings-section">
              <h4>Theme & Appearance</h4>

              <div className="notes-setting-group">
                <label htmlFor="defaultTheme">Default Theme</label>
                <select
                  id="defaultTheme"
                  value={localSettings.defaultTheme || 'light'}
                  onChange={(e) => handleSettingChange('defaultTheme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div className="notes-setting-group">
                <label>Current Theme: {theme}</label>
                <button onClick={onToggleTheme} className="notes-theme-toggle-btn">
                  Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                </button>
              </div>
            </div>
          </div>
        );

      case 'behavior':
        return (
          <div className="notes-settings-tab-content">
            <div className="notes-settings-section">
              <h4>Behavior Settings</h4>

              <div className="notes-setting-group">
                <label htmlFor="defaultSort">Default Sort Order</label>
                <select
                  id="defaultSort"
                  value={localSettings.defaultSort || 'updatedAt'}
                  onChange={(e) => handleSettingChange('defaultSort', e.target.value)}
                >
                  <option value="updatedAt">Last Modified</option>
                  <option value="createdAt">Date Created</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="titleDesc">Title (Z-A)</option>
                </select>
              </div>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.confirmDelete || true}
                    onChange={(e) => handleSettingChange('confirmDelete', e.target.checked)}
                  />
                  Confirm before deleting notes
                </label>
                <small>Show confirmation dialog when deleting notes</small>
              </div>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.searchInContent || true}
                    onChange={(e) => handleSettingChange('searchInContent', e.target.checked)}
                  />
                  Search in note content
                </label>
                <small>Include note content when searching (not just titles)</small>
              </div>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="notes-settings-tab-content">
            <div className="notes-settings-section">
              <h4>Export Settings</h4>

              <div className="notes-setting-group">
                <label htmlFor="exportFormat">Default Export Format</label>
                <select
                  id="exportFormat"
                  value={localSettings.exportFormat || 'markdown'}
                  onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                >
                  <option value="markdown">Markdown (.md)</option>
                  <option value="text">Plain Text (.txt)</option>
                  <option value="html">HTML (.html)</option>
                  <option value="json">JSON (.json)</option>
                </select>
              </div>

              <div className="notes-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.includeMetadata || false}
                    onChange={(e) => handleSettingChange('includeMetadata', e.target.checked)}
                  />
                  Include metadata in exports
                </label>
                <small>Include creation date, modification date, etc.</small>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="notes-settings-overlay">
      <div className="notes-settings-modal">
        <div className="notes-settings-header">
          <h3>Notes Settings</h3>
          <button className="notes-close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="notes-settings-body">
          <div className="notes-settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`notes-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="notes-tab-icon">{tab.icon}</span>
                <span className="notes-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="notes-settings-content">
            {renderTabContent()}
          </div>
        </div>

        <div className="notes-settings-footer">
          <div className="notes-footer-buttons">
            <button
              onClick={handleSaveChanges}
              className={`notes-save-settings-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
              disabled={!hasUnsavedChanges}
            >
              Save Changes
            </button>
            <button onClick={handleClose} className="notes-close-settings-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSettings;