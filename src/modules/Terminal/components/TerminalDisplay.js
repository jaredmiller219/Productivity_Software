import React, { useEffect, useRef } from 'react';
import './TerminalDisplay.css';

const TerminalDisplay = ({ history, onTerminalClick }) => {
  const terminalRef = useRef(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getLineIcon = (type) => {
    switch (type) {
      case 'command':
        return '▶';
      case 'error':
        return '✗';
      case 'output':
      default:
        return '';
    }
  };

  return (
    <div 
      className="terminal-display" 
      ref={terminalRef} 
      onClick={onTerminalClick}
    >
      <div className="terminal-history">
        {history.map((item, index) => (
          <div 
            key={index} 
            className={`terminal-line ${item.type}`}
            title={item.timestamp ? formatTimestamp(item.timestamp) : ''}
          >
            <span className="line-icon">{getLineIcon(item.type)}</span>
            <span className="line-content">
              {item.type === "command" ? (
                <>
                  <span className="prompt">$ </span>
                  <span className="command-text">{item.content}</span>
                </>
              ) : (
                <span className={`output-text ${item.type}`}>
                  {item.content}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalDisplay;
