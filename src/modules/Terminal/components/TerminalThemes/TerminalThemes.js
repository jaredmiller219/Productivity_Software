import React, { useState } from 'react';
import './TerminalThemes.css';

const TERMINAL_THEMES = {
  cyber: {
    name: 'Cyber',
    background: '#0a0a0a',
    foreground: '#00ff41',
    cursor: '#00ff41',
    selection: 'rgba(0, 255, 65, 0.3)',
    black: '#000000',
    red: '#ff0040',
    green: '#00ff41',
    yellow: '#ffff00',
    blue: '#0080ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#c0c0c0',
    brightBlack: '#404040',
    brightRed: '#ff4080',
    brightGreen: '#40ff80',
    brightYellow: '#ffff80',
    brightBlue: '#4080ff',
    brightMagenta: '#ff80ff',
    brightCyan: '#80ffff',
    brightWhite: '#ffffff'
  },
  neon: {
    name: 'Neon',
    background: '#0d1117',
    foreground: '#f0f6fc',
    cursor: '#58a6ff',
    selection: 'rgba(88, 166, 255, 0.3)',
    black: '#484f58',
    red: '#ff7b72',
    green: '#7ee787',
    yellow: '#f2cc60',
    blue: '#79c0ff',
    magenta: '#d2a8ff',
    cyan: '#56d4dd',
    white: '#f0f6fc',
    brightBlack: '#6e7681',
    brightRed: '#ffa198',
    brightGreen: '#56d364',
    brightYellow: '#e3b341',
    brightBlue: '#79c0ff',
    brightMagenta: '#d2a8ff',
    brightCyan: '#56d4dd',
    brightWhite: '#f0f6fc'
  },
  dark: {
    name: 'Dark',
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    cursor: '#d4d4d4',
    selection: 'rgba(255, 255, 255, 0.2)',
    black: '#000000',
    red: '#cd3131',
    green: '#0dbc79',
    yellow: '#e5e510',
    blue: '#2472c8',
    magenta: '#bc3fbc',
    cyan: '#11a8cd',
    white: '#e5e5e5',
    brightBlack: '#666666',
    brightRed: '#f14c4c',
    brightGreen: '#23d18b',
    brightYellow: '#f5f543',
    brightBlue: '#3b8eea',
    brightMagenta: '#d670d6',
    brightCyan: '#29b8db',
    brightWhite: '#e5e5e5'
  },
  light: {
    name: 'Light',
    background: '#ffffff',
    foreground: '#333333',
    cursor: '#333333',
    selection: 'rgba(0, 0, 0, 0.2)',
    black: '#000000',
    red: '#cd3131',
    green: '#00bc00',
    yellow: '#949800',
    blue: '#0451a5',
    magenta: '#bc05bc',
    cyan: '#0598bc',
    white: '#555555',
    brightBlack: '#666666',
    brightRed: '#cd3131',
    brightGreen: '#14ce14',
    brightYellow: '#b5ba00',
    brightBlue: '#0451a5',
    brightMagenta: '#bc05bc',
    brightCyan: '#0598bc',
    brightWhite: '#a5a5a5'
  }
};

const TerminalThemes = ({ isVisible, onClose, currentTheme, onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'dark');

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    onThemeChange(themeId, TERMINAL_THEMES[themeId]);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="terminal-themes-overlay">
      <div className="terminal-themes-modal">
        <div className="themes-header">
          <h3>Terminal Themes</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="themes-content">
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
                    <span style={{ color: theme.yellow }}> "Hello World"</span>
                  </div>
                  <div className="preview-line" style={{ color: theme.foreground }}>
                    Hello World
                  </div>
                  <div className="preview-line">
                    <span style={{ color: theme.red }}>error:</span>
                    <span> command not found</span>
                  </div>
                </div>
                <div className="theme-name">{theme.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="themes-footer">
          <div className="theme-info">
            <h4>Current Theme: {TERMINAL_THEMES[selectedTheme]?.name}</h4>
            <div className="color-palette">
              {Object.entries(TERMINAL_THEMES[selectedTheme] || {}).map(([key, color]) => {
                if (key === 'name') return null;
                return (
                  <div key={key} className="color-swatch">
                    <div 
                      className="color-box" 
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    ></div>
                    <span className="color-label">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TERMINAL_THEMES };
export default TerminalThemes;
