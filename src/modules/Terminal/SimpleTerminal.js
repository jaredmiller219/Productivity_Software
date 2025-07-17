import React, { useState, useEffect } from "react";
import { useGlobalState } from '../../shared/hooks/useGlobalState.js';
import TerminalHeader from "./components/TerminalHeader/TerminalHeader.js";
import TerminalDisplay from "./components/TerminalDisplay/TerminalDisplay.js";
import TerminalInput from "./components/TerminalInput/TerminalInput.js";
import "./SimpleTerminal.css";

function SimpleTerminal() {
  // Create a separate terminal state for each tab
  const createNewTerminalState = () => {
    return {
      history: [
        { type: "output", content: "Welcome to Dev Suite Terminal", timestamp: Date.now() },
        { type: "output", content: "This is a simulated terminal environment.", timestamp: Date.now() },
        { type: "output", content: "Type 'help' for available commands", timestamp: Date.now() }
      ],
      input: "",
      historyIndex: -1,
      commandCount: 0,
      currentDirectory: "/home/user"
    };
  };

  // Use global state management for terminal
  const { state, updateState } = useGlobalState('terminal', {
    theme: 'dark',
    tabs: [{ id: 1, name: "Terminal 1" }],
    activeTab: 1,
    showThemes: false,
    showSettings: false,
    showHelp: false,
    showDebug: false,
    debugPosition: { x: 50, y: 50 },
    debugSize: { width: 400, height: 500 },
    debugMinimized: false,
    tabStates: {
      1: createNewTerminalState()
    }
  });

  // Extract state values
  const { theme, tabs, activeTab, showThemes, showSettings, showHelp, showDebug, debugPosition, debugSize, debugMinimized, tabStates } = state;

  // State setter wrappers for global state
  const setTheme = (value) => updateState({ theme: typeof value === 'function' ? value(theme) : value });
  const setTabs = (value) => updateState({ tabs: typeof value === 'function' ? value(tabs) : value });
  const setActiveTab = (value) => updateState({ activeTab: value });
  const setShowThemes = (value) => updateState({ showThemes: value });
  const setShowSettings = (value) => updateState({ showSettings: value });
  const setShowHelp = (value) => updateState({ showHelp: value });
  const setShowDebug = (value) => updateState({ showDebug: value });
  const setDebugPosition = (value) => updateState({ debugPosition: value });
  const setDebugSize = (value) => updateState({ debugSize: value });
  const setDebugMinimized = (value) => updateState({ debugMinimized: value });
  const setTabStates = (value) => updateState({ tabStates: typeof value === 'function' ? value(tabStates) : value });

  // Ensure existing tab states have currentDirectory
  useEffect(() => {
    const needsUpdate = Object.keys(tabStates).some(tabId =>
      !tabStates[tabId].currentDirectory
    );

    if (needsUpdate) {
      const updatedTabStates = { ...tabStates };
      Object.keys(updatedTabStates).forEach(tabId => {
        if (!updatedTabStates[tabId].currentDirectory) {
          updatedTabStates[tabId] = {
            ...updatedTabStates[tabId],
            currentDirectory: "/home/user"
          };
        }
      });
      setTabStates(updatedTabStates);
    }
  }, [tabStates, setTabStates]);

  // Local state for drag/resize (don't persist these)
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const debugContentRef = React.useRef(null);
  const tabStatesRef = React.useRef(null);

  // Get current tab's state
  const currentTabState = tabStates[activeTab] || createNewTerminalState();

  // Local state for input (for immediate UI updates)
  const [localInput, setLocalInput] = useState(currentTabState.input || "");

  // Real terminal connection state
  const [isRealTerminalConnected, setIsRealTerminalConnected] = useState(false);

  // Ensure the current tab state exists in global state
  React.useEffect(() => {
    if (!tabStates[activeTab]) {
      setTabStates(prev => ({
        ...prev,
        [activeTab]: createNewTerminalState()
      }));
    }
  }, [activeTab, tabStates, setTabStates]);

  // Sync local input with global state when tab changes
  React.useEffect(() => {
    setLocalInput(currentTabState.input || "");
  }, [activeTab, currentTabState.input]);

  // Terminal functions for current tab
  const setInput = (value) => {
    // Update local state immediately for UI responsiveness
    setLocalInput(value);
    // Update global state for persistence
    setTabStates(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], input: value }
    }));
  };

  // Initialize real terminal connection
  const initializeRealTerminal = async () => {
    try {
      const terminalIdStr = `simple-terminal-${activeTab}`;
      const result = await window.electronAPI.terminalInit(terminalIdStr);
      if (result.success) {
        setIsRealTerminalConnected(true);
        console.log(`Terminal initialized: ${terminalIdStr}`);
      }
    } catch (error) {
      console.error('Failed to initialize real terminal:', error);
    }
  };

  // Execute real command
  const executeRealCommand = async (command, timestamp) => {
    const commandEntry = {
      type: "command",
      content: command,
      timestamp
    };

    // Add command to history immediately
    setTabStates(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        history: [...prev[activeTab].history, commandEntry],
        commandCount: prev[activeTab].commandCount + 1,
        historyIndex: -1
      }
    }));

    // Handle clear command specially
    if (command.toLowerCase().trim() === 'clear') {
      // Clear the terminal display after showing the command
      setTimeout(() => {
        setTabStates(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            history: []
          }
        }));
      }, 100);
      return;
    }

    try {
      // Send command to real terminal
      await window.electronAPI.terminalInput(`simple-terminal-${activeTab}`, command + '\n');

    } catch (error) {
      console.error('Failed to execute real command:', error);
      // Add error message to history
      const errorEntry = {
        type: "output",
        content: `Error: Failed to execute command - ${error.message}`,
        timestamp: Date.now()
      };

      setTabStates(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          history: [...prev[activeTab].history, errorEntry]
        }
      }));
    }
  };

  // Set up terminal output listener
  useEffect(() => {
    if (window.electronAPI) {
      const handleTerminalOutput = (_, { terminalId, data }) => {
        if (terminalId === `simple-terminal-${activeTab}`) {
          // Add output directly to terminal history
          const outputEntry = {
            type: "output",
            content: data.trim(),
            timestamp: Date.now()
          };

          setTabStates(prev => ({
            ...prev,
            [activeTab]: {
              ...prev[activeTab],
              history: [...prev[activeTab].history, outputEntry]
            }
          }));
        }
      };

      window.electronAPI.onTerminalOutput(handleTerminalOutput);

      return () => {
        window.electronAPI.removeAllListeners('terminal-output');
      };
    }
  }, [activeTab, setTabStates]);

  // Initialize real terminal when component mounts or tab changes
  useEffect(() => {
    if (window.electronAPI && !isRealTerminalConnected) {
      initializeRealTerminal();
    }
  }, [activeTab, isRealTerminalConnected]);

  const processCommand = (command) => {
    const timestamp = Date.now();
    const cmd = command.toLowerCase().trim();

    // Add the command to history first
    const commandEntry = {
      type: "command",
      content: command,
      timestamp
    };

    // Execute real command if electronAPI is available
    if (window.electronAPI) {
      executeRealCommand(command, timestamp);
      return;
    }

    // Only fall back to simulated commands if no real terminal available
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

    // No real terminal available - show error
    const errorEntry = {
      type: "output",
      content: "Error: No terminal connection available. Please run in Electron environment for real terminal functionality.",
      timestamp
    };

    const newTabState = {
      ...tabStates[activeTab],
      history: [...tabStates[activeTab].history, commandEntry, errorEntry],
      commandCount: tabStates[activeTab].commandCount + 1,
      historyIndex: -1
    };

    setTabStates(prev => ({
      ...prev,
      [activeTab]: newTabState
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
    // Update local input immediately
    setLocalInput(command);
    // Update global state
    setTabStates(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], historyIndex: newIndex, input: command }
    }));
  };

  const getStats = () => ({
    commandCount: currentTabState.commandCount,
    historyLength: currentTabState.history.length
  });



  const handleSubmit = () => {
    const command = localInput;
    if (command && command.trim()) {
      // Clear input immediately
      setInput("");
      // Process command
      processCommand(command);
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Cleanup real terminal connections
  useEffect(() => {
    return () => {
      if (window.electronAPI && isRealTerminalConnected) {
        // Close terminal for current tab
        window.electronAPI.terminalClose(`simple-terminal-${activeTab}`);
        window.electronAPI.removeAllListeners('terminal-output');
      }
    };
  }, [activeTab, isRealTerminalConnected]);

  // Calculate max height up to end of Tab States section
  const getContentMaxHeight = () => {
    if (!tabStatesRef.current) return 600; // Fallback

    const headerHeight = 50; // Header height
    const modalRect = debugContentRef.current?.getBoundingClientRect();
    const tabStatesRect = tabStatesRef.current.getBoundingClientRect();

    if (modalRect && tabStatesRect) {
      // Calculate height from modal top to end of Tab States section
      const contentHeight = (tabStatesRect.bottom - modalRect.top) + 20; // 20px padding
      return headerHeight + contentHeight;
    }

    return 600; // Fallback
  };

  // Debug modal drag handlers
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - debugPosition.x,
      y: e.clientY - debugPosition.y
    });
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Resize start:', { debugSize, clientX: e.clientX, clientY: e.clientY });
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: debugSize.width,
      height: debugSize.height
    });
  };

  // Global mouse handlers
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setDebugPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const minWidth = 300; // Wide enough for header content
        const minHeight = 50; // Height of header
        const maxHeight = getContentMaxHeight(); // Content-based max height
        const newWidth = Math.max(minWidth, resizeStart.width + deltaX);
        const newHeight = Math.max(minHeight, Math.min(resizeStart.height + deltaY, maxHeight));

        console.log('Resizing:', {
          deltaX,
          deltaY,
          resizeStart,
          newWidth,
          newHeight,
          maxHeight,
          currentSize: debugSize
        });

        setDebugSize({
          width: newWidth,
          height: newHeight
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, dragStart, resizeStart, debugSize]);

  // Note: We don't auto-shrink the modal - user controls the size manually
  // The max height is only enforced during resize operations

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
        onShowDebug={() => setShowDebug(true)}
        isRealTerminal={isRealTerminalConnected}
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
        input={localInput}
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

      {/* Debug Modal - Development Only */}
      {showDebug && process.env.NODE_ENV === 'development' && (
        <div
          className={`debug-modal ${debugMinimized ? 'minimized' : ''}`}
          style={{
            position: 'fixed',
            left: `${debugPosition.x}px`,
            top: `${debugPosition.y}px`,
            width: `${debugSize.width}px`,
            height: debugMinimized ? 'auto' : `${debugSize.height}px`,
            zIndex: 1001
          }}
        >
          <div
            className="debug-modal-header"
            onMouseDown={handleDragStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <h3>🔧 Debug Information</h3>
            <div className="debug-header-controls">
              <button
                onClick={() => setDebugMinimized(!debugMinimized)}
                title={debugMinimized ? "Expand" : "Minimize"}
              >
                {debugMinimized ? '▶️' : '🔽'}
              </button>
              <button onClick={() => setShowDebug(false)}>✕</button>
            </div>
          </div>

          {!debugMinimized && (
            <>
              <div className="debug-modal-content" ref={debugContentRef}>
                <div className="debug-section">
                  <h4>Terminal State</h4>
                  <p><strong>Active Tab:</strong> {activeTab}</p>
                  <p><strong>Total Tabs:</strong> {tabs.length}</p>
                  <p><strong>Current Theme:</strong> {theme}</p>
                  <p><strong>Tab Names:</strong> {tabs.map(tab => tab.name).join(', ')}</p>
                </div>
                <div className="debug-section">
                  <h4>Current Tab Data</h4>
                  <p><strong>History Length:</strong> {currentTabState.history.length}</p>
                  <p><strong>Command Count:</strong> {currentTabState.commandCount}</p>
                  <p><strong>Current Input:</strong> "{currentTabState.input}"</p>
                  <p><strong>History Index:</strong> {currentTabState.historyIndex}</p>
                </div>
                <div className="debug-section">
                  <h4>Environment</h4>
                  <p><strong>Node ENV:</strong> {process.env.NODE_ENV}</p>
                  <p><strong>React Version:</strong> {React.version || 'Unknown'}</p>
                </div>
                <div className="debug-section" ref={tabStatesRef}>
                  <h4>Tab States</h4>
                  <pre style={{
                    fontSize: '11px',
                    background: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    padding: '8px 28px 8px 8px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '150px',
                    width: 'fit-content',
                    minWidth: 'auto'
                  }}>
                    {JSON.stringify(tabStates, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Resize Handle */}
              <div
                className="debug-resize-handle"
                onMouseDown={handleResizeStart}
                title="Drag to resize"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SimpleTerminal;
