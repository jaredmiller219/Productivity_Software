import React, { useState, useEffect } from 'react';
import './IDESettings.css';

const DEFAULT_IDE_SETTINGS = {
  cursorColor: '#ffffff',
  fontSize: 14,
  fontFamily: 'SF Mono',
  theme: 'dark',
  tabSize: 2,
  wordWrap: false,
  lineNumbers: true,
  minimap: false,
  autoSave: true,
  autoSaveDelay: 1000
};

const IDESettings = ({ isVisible, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_IDE_SETTINGS, ...settings });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Update local settings when props change
  React.useEffect(() => {
    if (settings) {
      setLocalSettings({ ...DEFAULT_IDE_SETTINGS, ...settings });
    }
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(localSettings) !== JSON.stringify({ ...DEFAULT_IDE_SETTINGS, ...settings });
    if (hasChanges) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_IDE_SETTINGS);
  };

  const handleClose = () => {
    handleCancel();
  };

  const handleCancelDialog = () => {
    setShowUnsavedDialog(false);
  };

  const handleDiscardAndClose = () => {
    setLocalSettings({ ...DEFAULT_IDE_SETTINGS, ...settings });
    setShowUnsavedDialog(false);
    onClose();
  };

  const handleSaveAndClose = () => {
    onSettingsChange(localSettings);
    setShowUnsavedDialog(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="ide-settings-overlay">
      <div className="ide-settings-modal">
        <div className="settings-header">
          <h3>IDE Settings</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h4>Editor Appearance</h4>
            
            <div className="setting-group">
              <label htmlFor="cursorColor">Cursor Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="cursorColor"
                  value={localSettings.cursorColor}
                  onChange={(e) => handleSettingChange('cursorColor', e.target.value)}
                />
                <input
                  type="text"
                  value={localSettings.cursorColor}
                  onChange={(e) => handleSettingChange('cursorColor', e.target.value)}
                  placeholder="#ffffff"
                  className="color-text-input"
                />
              </div>
              <small>Color of the text cursor in the editor</small>
            </div>

            <div className="setting-group">
              <label htmlFor="fontSize">Font Size</label>
              <div className="range-input-group">
                <input
                  type="range"
                  id="fontSize"
                  min="10"
                  max="24"
                  value={localSettings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                />
                <span className="range-value">{localSettings.fontSize}px</span>
              </div>
            </div>

            <div className="setting-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select
                id="fontFamily"
                value={localSettings.fontFamily}
                onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
              >
                <option value="SF Mono">SF Mono</option>
                <option value="Monaco">Monaco</option>
                <option value="Inconsolata">Inconsolata</option>
                <option value="Roboto Mono">Roboto Mono</option>
                <option value="Courier New">Courier New</option>
                <option value="Consolas">Consolas</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={localSettings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h4>Editor Behavior</h4>
            
            <div className="setting-group">
              <label htmlFor="tabSize">Tab Size</label>
              <div className="range-input-group">
                <input
                  type="range"
                  id="tabSize"
                  min="2"
                  max="8"
                  value={localSettings.tabSize}
                  onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                />
                <span className="range-value">{localSettings.tabSize} spaces</span>
              </div>
            </div>

            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.wordWrap}
                  onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
                />
                <span className="checkbox-label">Word Wrap</span>
              </label>
              <small>Wrap long lines to fit in the editor</small>
            </div>

            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.lineNumbers}
                  onChange={(e) => handleSettingChange('lineNumbers', e.target.checked)}
                />
                <span className="checkbox-label">Show Line Numbers</span>
              </label>
            </div>

            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.minimap}
                  onChange={(e) => handleSettingChange('minimap', e.target.checked)}
                />
                <span className="checkbox-label">Show Minimap</span>
              </label>
              <small>Display a miniature overview of the file</small>
            </div>

            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                />
                <span className="checkbox-label">Auto Save</span>
              </label>
              <small>Automatically save files after changes</small>
            </div>

            {localSettings.autoSave && (
              <div className="setting-group">
                <label htmlFor="autoSaveDelay">Auto Save Delay</label>
                <div className="range-input-group">
                  <input
                    type="range"
                    id="autoSaveDelay"
                    min="500"
                    max="5000"
                    step="500"
                    value={localSettings.autoSaveDelay}
                    onChange={(e) => handleSettingChange('autoSaveDelay', parseInt(e.target.value))}
                  />
                  <span className="range-value">{localSettings.autoSaveDelay}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={handleReset} className="reset-btn">
            Reset to Defaults
          </button>
          <div className="footer-right">
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleApply} className="save-btn">
              Apply & Close
            </button>
          </div>
        </div>
      </div>

      {/* Unsaved changes dialog */}
      {showUnsavedDialog && (
        <div className="unsaved-dialog-overlay">
          <div className="unsaved-dialog">
            <div className="unsaved-dialog-header">
              <h4>Unsaved Changes</h4>
            </div>
            <div className="unsaved-dialog-content">
              <p>You have unsaved changes. What would you like to do?</p>
            </div>
            <div className="unsaved-dialog-footer">
              <button onClick={handleCancelDialog} className="dialog-cancel-btn">
                Cancel
              </button>
              <button onClick={handleDiscardAndClose} className="dialog-discard-btn">
                Discard Changes
              </button>
              <button onClick={handleSaveAndClose} className="dialog-save-btn">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DEFAULT_IDE_SETTINGS };
export default IDESettings;
