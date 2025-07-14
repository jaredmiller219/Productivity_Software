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
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        onInputChange(suggestions[selectedSuggestion] + ' ');
        setShowSuggestions(false);
      } else {
        onSubmit();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setSelectedSuggestion(prev => 
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else {
        onHistoryNavigate('up');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setSelectedSuggestion(prev => 
          prev >= suggestions.length - 1 ? 0 : prev + 1
        );
      } else {
        onHistoryNavigate('down');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const suggestion = selectedSuggestion >= 0 
          ? suggestions[selectedSuggestion] 
          : suggestions[0];
        onInputChange(suggestion + ' ');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onInputChange(suggestion + ' ');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="terminal-input-container">
      <div className="input-line">
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          placeholder="Type a command..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`suggestion-item ${
                index === selectedSuggestion ? 'selected' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TerminalInput;
