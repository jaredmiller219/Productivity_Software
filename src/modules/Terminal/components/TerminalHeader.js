import React, { useState, useEffect } from 'react';
import './TerminalHeader.css';

const TerminalHeader = ({ 
  onClear, 
  onToggleTheme, 
  onExport, 
  stats,
  theme = 'dark' 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStats, setShowStats] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUptime = () => {
    if (!stats.sessionStart) return '0s';
    
    const uptimeMs = Date.now() - stats.sessionStart;
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <div className={`terminal-header ${theme}`}>
      <div className="header-left">
        <div className="terminal-title">
          <span className="title-icon">⚡</span>
          <span className="title-text">Terminal</span>
        </div>
        <div className="terminal-status">
          <span className="status-indicator active"></span>
          <span className="status-text">Ready</span>
        </div>
      </div>

      <div className="header-center">
        <div className="current-time">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="header-right">
        <div className="terminal-controls">
          <button
            className="control-btn stats-btn"
            onClick={() => setShowStats(!showStats)}
            title="Toggle statistics"
          >
            📊
          </button>
          
          <button
            className="control-btn theme-btn"
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button
            className="control-btn export-btn"
            onClick={handleExport}
            title="Export session"
          >
            💾
          </button>
          
          <button
            className="control-btn clear-btn"
            onClick={onClear}
            title="Clear terminal"
          >
            🗑️
          </button>
        </div>
      </div>

      {showStats && (
        <div className="stats-panel">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Commands</span>
              <span className="stat-value">{stats.totalCommands}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lines</span>
              <span className="stat-value">{stats.totalLines}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Uptime</span>
              <span className="stat-value">{formatUptime()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Command</span>
              <span className="stat-value">
                {stats.lastCommand || 'None'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalHeader;
