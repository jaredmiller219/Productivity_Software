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

  const renderOutput = (output) => {
    if (typeof output === 'string') {
      return output.split('\n').map((line, index) => (
        <div key={index} className="output-line">
          {line || '\u00A0'}
        </div>
      ));
    }
    return output;
  };

  return (
    <div 
      ref={terminalRef}
      className="terminal-display"
      onClick={onTerminalClick}
    >
      {history.map((entry, index) => (
        <div key={index} className="terminal-entry">
          {entry.type === "command" && (
            <div className="command-line">
              <span className="timestamp">{formatTimestamp(entry.timestamp)}</span>
              <span className="prompt">$</span>
              <span className="command">{entry.content}</span>
            </div>
          )}
          {entry.type === "output" && (
            <div className="command-output">
              {renderOutput(entry.content)}
            </div>
          )}
          {entry.type === "error" && (
            <div className="command-error">
              {renderOutput(entry.content)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TerminalDisplay;
