import React, { useState } from 'react';
import './TerminalThemes.css';

const TERMINAL_THEMES = {
  dark: {
    name: 'Dark',
    background: '#1e1e1e',
    foreground: '#f0f0f0',
    cursor: '#ffffff',
    selection: '#264f78',
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
    cursor: '#000000',
    selection: '#add6ff',
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
  },
  monokai: {
    name: 'Monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    cursor: '#f8f8f0',
    selection: '#49483e',
    black: '#272822',
    red: '#f92672',
    green: '#a6e22e',
    yellow: '#f4bf75',
    blue: '#66d9ef',
    magenta: '#ae81ff',
    cyan: '#a1efe4',
    white: '#f8f8f2',
    brightBlack: '#75715e',
    brightRed: '#f92672',
    brightGreen: '#a6e22e',
    brightYellow: '#f4bf75',
    brightBlue: '#66d9ef',
    brightMagenta: '#ae81ff',
    brightCyan: '#a1efe4',
    brightWhite: '#f9f8f5'
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

  const theme = TERMINAL_THEMES[selectedTheme];

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
