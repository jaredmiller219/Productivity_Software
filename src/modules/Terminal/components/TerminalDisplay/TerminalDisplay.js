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
          {renderAnsiColors(line) || '\u00A0'}
        </div>
      ));
    }
    return output;
  };

  const renderAnsiColors = (text) => {
    if (!text) return text;

    // Handle ANSI color codes
    const parts = text.split(/(\x1b\[[0-9;]*m)/);
    let currentColor = null;
    const elements = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part.match(/\x1b\[[0-9;]*m/)) {
        // This is an ANSI code
        if (part === '\x1b[34m') {
          currentColor = 'blue';
        } else if (part === '\x1b[0m') {
          currentColor = null;
        }
      } else if (part) {
        // This is text content
        if (currentColor) {
          elements.push(
            <span key={i} style={{ color: currentColor }}>
              {part}
            </span>
          );
        } else {
          elements.push(part);
        }
      }
    }

    return elements.length > 0 ? elements : text;
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
              {/* <span className="timestamp">{formatTimestamp(entry.timestamp)}</span> */}
              <span className="prompt">$</span>
              <span className="command">{entry.content}</span>
            </div>
          )}
          {entry.type === "output" && (
            <div className={index < 3 ? "welcome-output" : "command-output"}>
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
