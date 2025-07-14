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
    foreground: '#00d4ff',
    cursor: '#00d4ff',
    selection: 'rgba(0, 212, 255, 0.3)',
    black: '#000000',
    red: '#ff6b6b',
    green: '#51cf66',
    yellow: '#ffd43b',
    blue: '#339af0',
    magenta: '#f06292',
    cyan: '#22d3ee',
    white: '#e0e0e0',
    brightBlack: '#666666',
    brightRed: '#ff8787',
    brightGreen: '#69db7c',
    brightYellow: '#ffe066',
    brightBlue: '#4dabf7',
    brightMagenta: '#f783ac',
    brightCyan: '#67e8f9',
    brightWhite: '#ffffff'
  },
  matrix: {
    name: 'Matrix',
    background: '#000000',
    foreground: '#00ff00',
    cursor: '#00ff00',
    selection: 'rgba(0, 255, 0, 0.3)',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff',
    brightBlack: '#404040',
    brightRed: '#ff4040',
    brightGreen: '#40ff40',
    brightYellow: '#ffff40',
    brightBlue: '#4040ff',
    brightMagenta: '#ff40ff',
    brightCyan: '#40ffff',
    brightWhite: '#ffffff'
  },
  synthwave: {
    name: 'Synthwave',
    background: '#1a0d2e',
    foreground: '#ff00ff',
    cursor: '#ff00ff',
    selection: 'rgba(255, 0, 255, 0.3)',
    black: '#000000',
    red: '#ff0080',
    green: '#00ff80',
    yellow: '#ffff00',
    blue: '#0080ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff',
    brightBlack: '#404040',
    brightRed: '#ff40a0',
    brightGreen: '#40ffa0',
    brightYellow: '#ffff40',
    brightBlue: '#40a0ff',
    brightMagenta: '#ff40ff',
    brightCyan: '#40ffff',
    brightWhite: '#ffffff'
  },
  solarizedDark: {
    name: 'Solarized Dark',
    background: '#002b36',
    foreground: '#839496',
    cursor: '#93a1a1',
    selection: '#073642',
    black: '#073642',
    red: '#dc322f',
    green: '#859900',
    yellow: '#b58900',
    blue: '#268bd2',
    magenta: '#d33682',
    cyan: '#2aa198',
    white: '#eee8d5',
    brightBlack: '#002b36',
    brightRed: '#cb4b16',
    brightGreen: '#586e75',
    brightYellow: '#657b83',
    brightBlue: '#839496',
    brightMagenta: '#6c71c4',
    brightCyan: '#93a1a1',
    brightWhite: '#fdf6e3'
  },
  dracula: {
    name: 'Dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    cursor: '#f8f8f0',
    selection: '#44475a',
    black: '#000000',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#bfbfbf',
    brightBlack: '#4d4d4d',
    brightRed: '#ff6e67',
    brightGreen: '#5af78e',
    brightYellow: '#f4f99d',
    brightBlue: '#caa9fa',
    brightMagenta: '#ff92d0',
    brightCyan: '#9aedfe',
    brightWhite: '#e6e6e6'
  },
  nord: {
    name: 'Nord',
    background: '#2e3440',
    foreground: '#d8dee9',
    cursor: '#d8dee9',
    selection: '#4c566a',
    black: '#3b4252',
    red: '#bf616a',
    green: '#a3be8c',
    yellow: '#ebcb8b',
    blue: '#81a1c1',
    magenta: '#b48ead',
    cyan: '#88c0d0',
    white: '#e5e9f0',
    brightBlack: '#4c566a',
    brightRed: '#bf616a',
    brightGreen: '#a3be8c',
    brightYellow: '#ebcb8b',
    brightBlue: '#81a1c1',
    brightMagenta: '#b48ead',
    brightCyan: '#8fbcbb',
    brightWhite: '#eceff4'
  }
};

function TerminalThemes({ currentTheme, onThemeChange, isVisible, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleApplyTheme = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  const handlePreviewTheme = (themeName) => {
    setSelectedTheme(themeName);
  };

  if (!isVisible) return null;

  // const theme = TERMINAL_THEMES[selectedTheme];
  const theme = TERMINAL_THEMES[selectedTheme] || TERMINAL_THEMES.cyber;

  return (
    <div className="terminal-themes-overlay">
      <div className="terminal-themes-panel">
        <div className="themes-header">
          <h3>Terminal Themes</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="themes-content">
          <div className="themes-list">
            {Object.entries(TERMINAL_THEMES).map(([key, themeData]) => (
              <div
                key={key}
                className={`theme-item ${selectedTheme === key ? 'selected' : ''}`}
                onClick={() => handlePreviewTheme(key)}
              >
                <div className="theme-preview" style={{ backgroundColor: themeData.background }}>
                  <div className="preview-text" style={{ color: themeData.foreground }}>
                    $ echo "Hello World"
                  </div>
                  <div className="preview-text" style={{ color: themeData.green }}>
                    Hello World
                  </div>
                </div>
                <div className="theme-name">{themeData.name}</div>
              </div>
            ))}
          </div>
          
          <div className="theme-preview-large">
            <div className="preview-terminal" style={{ 
              backgroundColor: theme.background,
              color: theme.foreground,
              border: `1px solid ${theme.selection}`
            }}>
              <div className="preview-line">
                <span style={{ color: theme.blue }}>user@computer</span>
                <span style={{ color: theme.white }}>:</span>
                <span style={{ color: theme.cyan }}>~/projects</span>
                <span style={{ color: theme.white }}>$ </span>
                <span style={{ color: theme.foreground }}>ls -la</span>
              </div>
              <div className="preview-line">
                <span style={{ color: theme.blue }}>drwxr-xr-x</span>
                <span style={{ color: theme.white }}> 5 user user 4096 Dec 13 10:30 </span>
                <span style={{ color: theme.cyan }}>documents</span>
              </div>
              <div className="preview-line">
                <span style={{ color: theme.green }}>-rw-r--r--</span>
                <span style={{ color: theme.white }}> 1 user user 1024 Dec 13 09:15 </span>
                <span style={{ color: theme.yellow }}>readme.txt</span>
              </div>
              <div className="preview-line">
                <span style={{ color: theme.red }}>-rwxr-xr-x</span>
                <span style={{ color: theme.white }}> 1 user user 2048 Dec 13 11:45 </span>
                <span style={{ color: theme.magenta }}>script.sh</span>
              </div>
              <div className="preview-line">
                <span style={{ color: theme.blue }}>user@computer</span>
                <span style={{ color: theme.white }}>:</span>
                <span style={{ color: theme.cyan }}>~/projects</span>
                <span style={{ color: theme.white }}>$ </span>
                <span 
                  className="cursor-preview" 
                  style={{ backgroundColor: theme.cursor }}
                ></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="themes-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleApplyTheme}>Apply Theme</button>
        </div>
      </div>
    </div>
  );
}

export { TERMINAL_THEMES };
export default TerminalThemes;
