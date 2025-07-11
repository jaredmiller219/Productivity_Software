import React, { useRef, useEffect, useState } from 'react';
import './TerminalInput.css';

const TerminalInput = ({ 
  input, 
  onInputChange, 
  onSubmit, 
  onHistoryNavigate,
  autoFocus = true 
}) => {
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // Available commands for autocomplete
  const commands = [
    'help', 'clear', 'date', 'echo', 'whoami', 'pwd', 'ls', 'cat', 'history', 'calc'
  ];

  // Focus input on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle autocomplete
  useEffect(() => {
    if (input.trim()) {
      const filtered = commands.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && input.length > 0);
      setSelectedSuggestion(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [input]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
          // Use selected suggestion
          const suggestion = suggestions[selectedSuggestion];
          onInputChange(suggestion + ' ');
          setShowSuggestions(false);
        } else {
          // Submit command
          onSubmit(input);
          setShowSuggestions(false);
        }
        break;

      case 'Tab':
        e.preventDefault();
        if (suggestions.length === 1) {
          // Auto-complete with single suggestion
          onInputChange(suggestions[0] + ' ');
          setShowSuggestions(false);
        } else if (suggestions.length > 1) {
          // Show all suggestions
          setShowSuggestions(true);
          setSelectedSuggestion(0);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        } else {
          // Navigate command history
          const historyCommand = onHistoryNavigate('up');
          onInputChange(historyCommand);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        } else {
          // Navigate command history
          const historyCommand = onHistoryNavigate('down');
          onInputChange(historyCommand);
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;

      case 'ArrowLeft':
      case 'ArrowRight':
        // Hide suggestions when navigating within input
        setShowSuggestions(false);
        break;

      default:
        break;
    }
  };

  const handleInputChangeLocal = (e) => {
    onInputChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    onInputChange(suggestion + ' ');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && input.trim()) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="terminal-input-container">
      <div className="terminal-input-line">
        <span className="prompt">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChangeLocal}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          className="terminal-input"
          placeholder="Type a command..."
          spellCheck="false"
          autoComplete="off"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`suggestion-item ${
                  index === selectedSuggestion ? 'selected' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedSuggestion(index)}
              >
                <span className="suggestion-command">{suggestion}</span>
                <span className="suggestion-description">
                  {getCommandDescription(suggestion)}
                </span>
              </div>
            ))}
          </div>
          <div className="suggestions-hint">
            <span>Tab to complete • ↑↓ to navigate • Enter to select</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get command descriptions
const getCommandDescription = (command) => {
  const descriptions = {
    'help': 'Show available commands',
    'clear': 'Clear the terminal',
    'date': 'Show current date and time',
    'echo': 'Echo a message',
    'whoami': 'Show current user',
    'pwd': 'Show current directory',
    'ls': 'List directory contents',
    'cat': 'Display file contents',
    'history': 'Show command history',
    'calc': 'Simple calculator'
  };
  return descriptions[command] || '';
};

export default TerminalInput;
