import React, { useState, useEffect } from 'react';
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
  theme: 'dark',
  showDebugPanel: false
};

const TerminalSettings = ({ isVisible, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_SETTINGS, ...settings });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Update local settings when props change (but only if no unsaved changes)
  React.useEffect(() => {
    if (isVisible) {
      setLocalSettings({ ...DEFAULT_SETTINGS, ...settings });
    }
  }, [isVisible, settings]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return JSON.stringify(localSettings) !== JSON.stringify({ ...DEFAULT_SETTINGS, ...settings });
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    // Don't apply changes immediately - wait for user to click Apply
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  const handleApply = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    // Cancel always discards changes and closes immediately
    setLocalSettings({ ...DEFAULT_SETTINGS, ...settings }); // Reset to original
    onClose();
  };

  const handleSaveAndClose = () => {
    onSettingsChange(localSettings);
    setShowUnsavedDialog(false);
    onClose();
  };

  const handleDiscardAndClose = () => {
    setLocalSettings({ ...DEFAULT_SETTINGS, ...settings }); // Reset to original
    setShowUnsavedDialog(false);
    onClose();
  };

  const handleCancelDialog = () => {
    setShowUnsavedDialog(false);
  };

  if (!isVisible) return null;

  return (
    <div className="terminal-settings-overlay">
      <div className="terminal-settings-modal">
        <div className="settings-header">
          <h3>Terminal Settings</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-section appearance-section">
            <h4>Appearance</h4>

            <div className="setting-group">
              <div className="setting-group-content">
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
            </div>

            <div className="setting-group">
              <div className="setting-group-content">
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
              <small>Enable blinking cursor animation</small>
            </div>
          </div>

          <div className="settings-section">
            <h4>Behavior</h4>
            
            <div className="setting-group">
              <div className="setting-group-content">
                <label>Scrollback Lines</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={localSettings.scrollback}
                  onChange={(e) => handleSettingChange('scrollback', parseInt(e.target.value))}
                />
              </div>
              <small>Number of lines to keep in terminal history</small>
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
              <small>Play sound on terminal bell character</small>
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
              <small>Wrap long lines to fit terminal width</small>
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
              <small>Automatically copy selected text to clipboard</small>
            </div>
          </div>

          <div className="settings-section">
            <h4>Developer</h4>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.showDebugPanel}
                  onChange={(e) => handleSettingChange('showDebugPanel', e.target.checked)}
                />
                Show Debug Panel
              </label>
              <small>Enable debug information panel for development and troubleshooting</small>
            </div>
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

      {/* Unsaved Changes Dialog */}
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

export { DEFAULT_SETTINGS };
export default TerminalSettings;
