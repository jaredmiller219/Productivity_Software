import React, { useState, useEffect, useRef } from 'react';
import './TerminalHeader.css';

const TerminalHeader = ({
  onClear,
  onToggleTheme,
  onExport,
  stats,
  theme = 'dark',
  onShowThemes,
  onShowSettings,
  onShowHelp,
  onShowDebug,
  showDebugButton = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStats, setShowStats] = useState(false);
  const statsRef = useRef(null);
  const statsButtonRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle click outside to close stats dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statsRef.current && !statsRef.current.contains(event.target) &&
          statsButtonRef.current && !statsButtonRef.current.contains(event.target)) {
        setShowStats(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleExport = async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        theme,
        stats: stats || {},
        // Add any other terminal data you want to export
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
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className={`terminal-header ${theme}`}>
      <div className="header-left">
        <div className="terminal-title">
          <span className="terminal-icon"> ⚡</span>
          <span>Terminal</span>
        </div>
        {/* <div className="terminal-time">
          {formatTime(currentTime)}
        </div> */}
      </div>

      <div className="header-center">
        {stats && (
          <div className="terminal-stats">
            <span className="stat-item">
              Developer Terminal
            </span>
            {/* <span className="stat-item">
              Uptime: {formatUptime(stats.uptime)}
            </span> */}
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="header-controls">
          {/* Info & Stats Group */}
          <div className="control-group">
            <button
              ref={statsButtonRef}
              className="header-btn"
              onClick={() => setShowStats(!showStats)}
              title="Toggle stats"
            >
              📊
            </button>

            <button
              className="header-btn"
              onClick={onShowHelp}
              title="Help & shortcuts"
            >
              ❓
            </button>

            {/* Debug button - when enabled in settings */}
            {showDebugButton && (
              <button
                className="header-btn debug-btn"
                onClick={onShowDebug}
                title="Debug Information"
              >
                🔧
              </button>
            )}
          </div>

          {/* Customization Group */}
          <div className="control-group">
            <button
              className="header-btn"
              onClick={onShowThemes}
              title="Terminal themes"
            >
              🎨
            </button>

            <button
              className="header-btn"
              onClick={onShowSettings}
              title="Terminal settings"
            >
              ⚙️
            </button>
          </div>

          {/* Actions Group */}
          <div className="control-group">
            <button
              className="header-btn"
              onClick={handleExport}
              title="Export session"
            >
              📤
            </button>

            <button
              className="header-btn clear-btn"
              onClick={onClear}
              title="Clear terminal"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {showStats && stats && (
        <div className="stats-dropdown" ref={statsRef}>
          <div className="stats-header">Terminal Statistics</div>
          <div className="stats-grid">
            <div className="stat-row">
              <span className="stat-label">Commands Executed:</span>
              <span className="stat-value">{stats.commandCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Session Uptime:</span>
              <span className="stat-value">{formatUptime(stats.uptime)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Current Directory:</span>
              <span className="stat-value">{stats.currentDirectory || '~'}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Last Command:</span>
              <span className="stat-value">{stats.lastCommand || 'None'}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Memory Usage:</span>
              <span className="stat-value">{stats.memoryUsage || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalHeader;
