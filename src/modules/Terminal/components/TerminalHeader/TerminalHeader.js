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

  return (
    <div className={`terminal-header ${theme}`}>
      <div className="header-left">
        <div className="terminal-title">
          <span className="terminal-icon">⚡</span>
          <span>Terminal</span>
        </div>
        <div className="terminal-time">
          {formatTime(currentTime)}
        </div>
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
          <button
            className="header-btn"
            onClick={() => setShowStats(!showStats)}
            title="Toggle stats"
          >
            📊
          </button>
          
          <button
            className="header-btn"
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button
            className="header-btn"
            onClick={onExport}
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

      {showStats && stats && (
        <div className="stats-dropdown">
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
