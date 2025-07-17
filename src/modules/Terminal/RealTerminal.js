import React, { useState, useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { TERMINAL_THEMES } from './components/TerminalThemes/TerminalThemes.js';
import { useGlobalState } from '../../shared/hooks/useGlobalState.js';
import './Terminal.css';

function RealTerminal() {
  // Use global state management for terminal
  const { state, updateState } = useGlobalState('realTerminal', {
    theme: 'cyber',
    tabs: [{ id: 1, name: "Terminal 1", cwd: "~" }],
    activeTab: 1,
    showThemes: false,
    showSettings: false,
    showHelp: false
  });

  const { theme, tabs, activeTab, showThemes, showSettings, showHelp } = state;
  
  // State setters
  const setTheme = (value) => updateState({ theme: typeof value === 'function' ? value(theme) : value });
  const setTabs = (value) => updateState({ tabs: typeof value === 'function' ? value(tabs) : value });
  const setActiveTab = (value) => updateState({ activeTab: value });
  const setShowThemes = (value) => updateState({ showThemes: value });
  const setShowSettings = (value) => updateState({ showSettings: value });
  const setShowHelp = (value) => updateState({ showHelp: value });

  const terminalRefs = useRef({});
  const fitAddons = useRef({});
  const [isConnected, setIsConnected] = useState(false);

  // Initialize terminal for a specific tab
  const initTerminal = async (tabId) => {
    const container = document.getElementById(`terminal-${tabId}`);
    if (!container) return;

    // Create XTerm instance
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      theme: TERMINAL_THEMES[theme] || TERMINAL_THEMES.cyber,
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      allowTransparency: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();

    // Store references
    terminalRefs.current[tabId] = term;
    fitAddons.current[tabId] = fitAddon;

    // Initialize real terminal connection
    if (window.electronAPI) {
      try {
        // Initialize the terminal process with unique ID
        const terminalIdStr = `terminal-${tabId}`;
        const result = await window.electronAPI.terminalInit(terminalIdStr);

        if (result.success) {
          setIsConnected(true);

          // Handle terminal output
          window.electronAPI.onTerminalOutput((_, { terminalId, data }) => {
            if (terminalId === terminalIdStr) {
              term.write(data);
            }
          });

          // Handle user input
          term.onData((data) => {
            window.electronAPI.terminalInput(terminalIdStr, data);
          });
        } else {
          throw new Error(result.error || 'Failed to initialize terminal');
        }

        // Handle terminal resize
        term.onResize(() => {
          // Send resize signal to terminal process if needed
          // This would require additional IPC setup
        });

      } catch (error) {
        console.error('Failed to initialize real terminal:', error);
        term.writeln('Failed to connect to system terminal');
        term.writeln('Falling back to simulated mode');
      }
    } else {
      term.writeln('Electron API not available');
      term.writeln('Running in browser mode');
    }

    // Handle window resize
    const handleResize = () => {
      if (fitAddons.current[tabId]) {
        fitAddons.current[tabId].fit();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (terminalRefs.current[tabId]) {
        terminalRefs.current[tabId].dispose();
        delete terminalRefs.current[tabId];
        delete fitAddons.current[tabId];
      }
    };
  };

  // Initialize terminals when tabs change
  useEffect(() => {
    tabs.forEach(tab => {
      if (!terminalRefs.current[tab.id]) {
        setTimeout(() => initTerminal(tab.id), 100);
      }
    });
  }, [tabs, theme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.electronAPI) {
        // Close all terminal processes
        tabs.forEach(tab => {
          window.electronAPI.terminalClose(`terminal-${tab.id}`);
        });
        window.electronAPI.removeAllListeners('terminal-output');
      }
      Object.values(terminalRefs.current).forEach(term => {
        if (term) term.dispose();
      });
    };
  }, [tabs]);

  // Add new tab
  const addTab = () => {
    const newId = Math.max(...tabs.map(tab => tab.id)) + 1;
    const newTab = {
      id: newId,
      name: `Terminal ${newId}`,
      cwd: "~"
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newId);
  };

  // Close tab
  const closeTab = (tabId) => {
    if (tabs.length <= 1) return; // Don't close last tab

    // Cleanup terminal process
    if (window.electronAPI) {
      window.electronAPI.terminalClose(`terminal-${tabId}`);
    }

    // Cleanup terminal UI
    if (terminalRefs.current[tabId]) {
      terminalRefs.current[tabId].dispose();
      delete terminalRefs.current[tabId];
      delete fitAddons.current[tabId];
    }

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemes(false);
    
    // Update all terminal themes
    Object.values(terminalRefs.current).forEach(term => {
      if (term) {
        term.options.theme = TERMINAL_THEMES[newTheme] || TERMINAL_THEMES.cyber;
      }
    });
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`terminal-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-name">{tab.name}</span>
              {tabs.length > 1 && (
                <button
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="add-tab-btn" onClick={addTab} title="New Terminal">
            +
          </button>
        </div>

        <div className="terminal-controls">
          <button
            className="control-btn theme-btn"
            onClick={() => setShowThemes(true)}
            title="Change Terminal Theme"
          >
            🎨
          </button>
          <button
            className="control-btn help-btn"
            onClick={() => setShowHelp(!showHelp)}
            title="Help"
          >
            ❓
          </button>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢' : '🔴'}
            </span>
            <span className="status-text">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="terminal-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            id={`terminal-${tab.id}`}
            className={`terminal-instance ${activeTab === tab.id ? 'active' : 'hidden'}`}
            style={{ height: '100%', width: '100%' }}
          />
        ))}
      </div>

      {/* Theme Selector */}
      {showThemes && (
        <div className="theme-selector-overlay" onClick={() => setShowThemes(false)}>
          <div className="theme-selector" onClick={(e) => e.stopPropagation()}>
            <h3>Select Terminal Theme</h3>
            <div className="theme-grid">
              {Object.keys(TERMINAL_THEMES).map(themeName => (
                <button
                  key={themeName}
                  className={`theme-option ${theme === themeName ? 'active' : ''}`}
                  onClick={() => handleThemeChange(themeName)}
                >
                  {themeName}
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowThemes(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-panel" onClick={(e) => e.stopPropagation()}>
            <h3>Real Terminal Help</h3>
            <div className="help-content">
              <p>This is a real terminal connected to your system.</p>
              <p>All commands are executed on your actual computer.</p>
              <h4>Features:</h4>
              <ul>
                <li>Full system terminal access</li>
                <li>Multiple tabs</li>
                <li>Theme customization</li>
                <li>Real-time command execution</li>
              </ul>
            </div>
            <button className="close-btn" onClick={() => setShowHelp(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealTerminal;
