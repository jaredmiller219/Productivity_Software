import React, { useState } from "react";
import TerminalHeader from "./components/TerminalHeader/TerminalHeader.js";
import TerminalDisplay from "./components/TerminalDisplay/TerminalDisplay.js";
import TerminalInput from "./components/TerminalInput/TerminalInput.js";
import "./SimpleTerminal.css";

function SimpleTerminal() {
  const [theme, setTheme] = useState('dark');
  const [tabs, setTabs] = useState([{ id: 1, name: "Terminal 1" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [showThemes, setShowThemes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Create a separate terminal state for each tab
  const createNewTerminalState = () => {
    return {
      history: [
        { type: "output", content: "Welcome to Dev Suite Terminal", timestamp: Date.now() },
        { type: "output", content: "This is a simulated terminal environment.", timestamp: Date.now() },
        { type: "output", content: 'Type "help" for available commands.', timestamp: Date.now() },
      ],
      input: '',
      historyIndex: -1,
      commandCount: 0
    };
  };

  // Initialize with first tab
  const [tabStates, setTabStates] = useState({
    1: createNewTerminalState()
  });

  // Get current tab's state
  const currentTabState = tabStates[activeTab] || createNewTerminalState();

  // Terminal functions for current tab
  const setInput = (value) => {
    setTabStates(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], input: value }
    }));
  };

  const processCommand = (command) => {
    const timestamp = Date.now();
    const cmd = command.toLowerCase().trim();

    // Add the command to history first
    const commandEntry = {
      type: "command",
      content: command,
      timestamp
    };

    // Handle clear command specially - show it, then clear everything
    if (cmd === 'clear') {
      // First add the clear command to history so it shows
      setTabStates(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          history: [...prev[activeTab].history, commandEntry],
          commandCount: prev[activeTab].commandCount + 1,
          historyIndex: -1
        }
      }));

      // Then clear everything after a brief moment
      setTimeout(() => {
        setTabStates(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            history: [], // Completely empty - no welcome message
            commandCount: 0
          }
        }));
      }, 10); // Very quick delay so user sees the clear command
      return;
    }

    // Get the output for other commands
    const output = getCommandOutput(command);

    // Add output to history (if there is output)
    const outputEntry = output ? {
      type: "output",
      content: output,
      timestamp
    } : null;

    setTabStates(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        history: outputEntry
          ? [...prev[activeTab].history, commandEntry, outputEntry]
          : [...prev[activeTab].history, commandEntry],
        commandCount: prev[activeTab].commandCount + 1,
        historyIndex: -1
      }
    }));
  };

  const clearHistory = () => {
    // Clear button in header should restore welcome message
    setTabStates(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        history: [
          { type: "output", content: "Welcome to Dev Suite Terminal", timestamp: Date.now() },
          { type: "output", content: "This is a simulated terminal environment.", timestamp: Date.now() },
          { type: "output", content: 'Type "help" for available commands.', timestamp: Date.now() },
        ],
        commandCount: 0
      }
    }));
  };

  const navigateHistory = (direction) => {
    const history = currentTabState.history;
    const commandHistory = history.filter(entry => entry.type === "command");
    if (commandHistory.length === 0) return;

    let newIndex = currentTabState.historyIndex;
    if (direction === 'up') {
      newIndex = newIndex === -1 ? commandHistory.length - 1 : Math.max(0, newIndex - 1);
    } else {
      newIndex = newIndex === -1 ? -1 : Math.min(commandHistory.length - 1, newIndex + 1);
    }

    const command = newIndex === -1 ? '' : commandHistory[newIndex].content;
    setTabStates(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], historyIndex: newIndex, input: command }
    }));
  };

  const getStats = () => ({
    commandCount: currentTabState.commandCount,
    historyLength: currentTabState.history.length
  });

  // Simple command processor
  const getCommandOutput = (command) => {
    const cmd = command.toLowerCase().trim();

    if (cmd === 'help') {
      return 'Available commands: help, clear, date, echo [text], ls, pwd, whoami';
    } else if (cmd === 'date') {
      return new Date().toString();
    } else if (cmd.startsWith('echo ')) {
      return command.substring(5);
    } else if (cmd === 'ls') {
      return 'Documents  Downloads  Desktop  Pictures  Music  Videos';
    } else if (cmd === 'pwd') {
      return '/home/user';
    } else if (cmd === 'whoami') {
      return 'user';
    } else {
      return `Command not found: ${command}`;
    }
  };

  const handleSubmit = () => {
    if (currentTabState.input && currentTabState.input.trim()) {
      processCommand(currentTabState.input);
    }
    setInput("");
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addTab = () => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 1;
    const newTab = { id: newId, name: `Terminal ${newId}` };
    setTabs(prev => [...prev, newTab]);

    // Create new terminal state for the new tab
    setTabStates(prev => ({
      ...prev,
      [newId]: createNewTerminalState()
    }));

    setActiveTab(newId);
  };

  const closeTab = (tabId, event) => {
    event.stopPropagation();
    if (tabs.length === 1) return; // Don't close if it's the last tab

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    // Remove the tab's state
    setTabStates(prev => {
      const newStates = { ...prev };
      delete newStates[tabId];
      return newStates;
    });

    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        theme,
        activeTab,
        tabName: tabs.find(tab => tab.id === activeTab)?.name || 'Terminal',
        history: currentTabState.history,
        stats: getStats()
      };

      // Use Electron's save dialog
      const result = await window.electronAPI.showSaveDialog({
        defaultPath: `terminal-session-${Date.now()}.json`,
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        await window.electronAPI.writeFile(result.filePath, JSON.stringify(exportData, null, 2));
        console.log('Terminal session exported successfully to:', result.filePath);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Fallback to browser download if Electron API is not available
      const exportData = {
        timestamp: new Date().toISOString(),
        theme,
        history,
        stats: getStats()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `terminal-session-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`terminal-container ${theme}`}>
      <TerminalHeader
        onClear={clearHistory}
        onToggleTheme={handleToggleTheme}
        onExport={handleExport}
        stats={getStats()}
        theme={theme}
        onShowThemes={() => setShowThemes(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowHelp={() => setShowHelp(true)}
      />

      {/* Simple Tab Bar */}
      <div className="simple-tab-bar">
        <div className="simple-tab-list">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`simple-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="simple-tab-name">{tab.name}</span>
              {tabs.length > 1 && (
                <button
                  className="simple-close-btn"
                  onClick={(e) => closeTab(tab.id, e)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          className="simple-add-tab-btn"
          onClick={addTab}
          title="Add new terminal tab"
        >
          +
        </button>
      </div>

      <TerminalDisplay
        history={currentTabState.history}
      />

      <TerminalInput
        input={currentTabState.input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onHistoryNavigate={navigateHistory}
      />

      {/* Themes Modal */}
      {showThemes && (
        <div className="simple-modal-overlay" onClick={() => setShowThemes(false)}>
          <div className="simple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="simple-modal-header">
              <h3>🎨 Terminal Themes</h3>
              <button onClick={() => setShowThemes(false)}>✕</button>
            </div>
            <div className="simple-modal-content">
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => { setTheme('dark'); setShowThemes(false); }}
                >
                  🌙 Dark Theme
                </button>
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => { setTheme('light'); setShowThemes(false); }}
                >
                  ☀️ Light Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="simple-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="simple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="simple-modal-header">
              <h3>⚙️ Terminal Settings</h3>
              <button onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="simple-modal-content">
              <div className="settings-section">
                <h4>Display</h4>
                <p>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</p>
                <p>Font: Consolas, Monaco, Courier New</p>
              </div>
              <div className="settings-section">
                <h4>Behavior</h4>
                <p>Tab Management: Enabled</p>
                <p>Command History: Enabled</p>
                <p>Export Format: JSON</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="simple-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="simple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="simple-modal-header">
              <h3>❓ Help & Shortcuts</h3>
              <button onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="simple-modal-content">
              <div className="help-section">
                <h4>Available Commands</h4>
                <ul>
                  <li><code>help</code> - Show available commands</li>
                  <li><code>clear</code> - Clear terminal screen</li>
                  <li><code>date</code> - Show current date and time</li>
                  <li><code>echo [text]</code> - Display text</li>
                  <li><code>ls</code> - List directory contents</li>
                  <li><code>pwd</code> - Show current directory</li>
                  <li><code>whoami</code> - Show current user</li>
                </ul>
              </div>
              <div className="help-section">
                <h4>Tab Management</h4>
                <ul>
                  <li>Click <strong>+</strong> to add new tab</li>
                  <li>Click <strong>×</strong> to close tab</li>
                  <li>Click tab name to switch tabs</li>
                  <li>Each tab has independent history</li>
                </ul>
              </div>
              <div className="help-section">
                <h4>Keyboard Shortcuts</h4>
                <ul>
                  <li><strong>↑/↓</strong> - Navigate command history</li>
                  <li><strong>Enter</strong> - Execute command</li>
                  <li><strong>Tab</strong> - (Future: Auto-complete)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleTerminal;
