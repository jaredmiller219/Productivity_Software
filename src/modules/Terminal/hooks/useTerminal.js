import { useState, useCallback } from 'react';

/**
 * Custom hook for managing terminal state and command processing
 * @returns {Object} Terminal state and operations
 */
export const useTerminal = () => {
  const [history, setHistory] = useState([
    { type: "output", content: "Welcome to Dev Suite Terminal", timestamp: Date.now() },
    { type: "output", content: "This is a simulated terminal environment.", timestamp: Date.now() },
    { type: "output", content: 'Type "help" for available commands.', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add entry to terminal history
  const addToHistory = useCallback((entry) => {
    setHistory(prev => [...prev, { ...entry, timestamp: Date.now() }]);
  }, []);

  // Clear terminal history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Process a command
  const processCommand = useCallback((cmd) => {
    if (!cmd || typeof cmd !== 'string') return;
    const command = cmd.trim();
    
    // Add command to history
    addToHistory({ type: "command", content: command });
    
    // Add to command history for navigation
    if (command && !commandHistory.includes(command)) {
      setCommandHistory(prev => [...prev, command]);
    }
    setHistoryIndex(-1);

    if (!command) {
      addToHistory({ type: "output", content: "" });
      return;
    }

    // Parse command and arguments
    const parts = command.split(' ');
    const baseCommand = parts[0];
    const args = parts.slice(1);

    switch (baseCommand) {
      case "help":
        addToHistory({ type: "output", content: "Available commands:" });
        addToHistory({ type: "output", content: "  help          - Show this help message" });
        addToHistory({ type: "output", content: "  clear         - Clear the terminal" });
        addToHistory({ type: "output", content: "  date          - Show current date and time" });
        addToHistory({ type: "output", content: "  echo <text>   - Echo a message" });
        addToHistory({ type: "output", content: "  whoami        - Show current user" });
        addToHistory({ type: "output", content: "  pwd           - Show current directory" });
        addToHistory({ type: "output", content: "  ls            - List directory contents" });
        addToHistory({ type: "output", content: "  cat <file>    - Display file contents" });
        addToHistory({ type: "output", content: "  history       - Show command history" });
        addToHistory({ type: "output", content: "  calc <expr>   - Simple calculator" });
        break;

      case "clear":
        clearHistory();
        break;

      case "date":
        addToHistory({ type: "output", content: new Date().toString() });
        break;

      case "echo":
        addToHistory({ type: "output", content: args.join(' ') });
        break;

      case "whoami":
        addToHistory({ type: "output", content: "developer" });
        break;

      case "pwd":
        addToHistory({ type: "output", content: "/home/developer/projects/dev-suite" });
        break;

      case "ls":
        addToHistory({ type: "output", content: "src/  public/  package.json  README.md  node_modules/" });
        break;

      case "cat":
        if (args.length === 0) {
          addToHistory({ type: "error", content: "cat: missing file operand" });
        } else {
          const filename = args[0];
          switch (filename) {
            case "package.json":
              addToHistory({ type: "output", content: '{\n  "name": "dev-productivity-suite",\n  "version": "0.1.0",\n  "private": true\n}' });
              break;
            case "README.md":
              addToHistory({ type: "output", content: "# Dev Productivity Suite\n\nA comprehensive development environment with 3D modeling, notes, terminal, and more." });
              break;
            default:
              addToHistory({ type: "error", content: `cat: ${filename}: No such file or directory` });
          }
        }
        break;

      case "history":
        commandHistory.forEach((cmd, index) => {
          addToHistory({ type: "output", content: `${index + 1}  ${cmd}` });
        });
        break;

      case "calc":
        if (args.length === 0) {
          addToHistory({ type: "error", content: "calc: missing expression" });
        } else {
          try {
            const expression = args.join(' ');
            // Simple calculator - only allow basic operations for security
            const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
            if (sanitized !== expression) {
              addToHistory({ type: "error", content: "calc: invalid characters in expression" });
            } else {
              const result = Function('"use strict"; return (' + sanitized + ')')();
              addToHistory({ type: "output", content: `${expression} = ${result}` });
            }
          } catch (error) {
            addToHistory({ type: "error", content: `calc: invalid expression` });
          }
        }
        break;

      default:
        addToHistory({ type: "error", content: `Command not found: ${baseCommand}` });
        addToHistory({ type: "output", content: 'Type "help" for available commands.' });
    }
  }, [addToHistory, clearHistory, commandHistory]);

  // Navigate command history
  const navigateHistory = useCallback((direction) => {
    if (commandHistory.length === 0) return input;

    let newIndex = historyIndex;
    
    if (direction === 'up') {
      newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
    } else if (direction === 'down') {
      newIndex = historyIndex > -1 ? historyIndex - 1 : -1;
    }

    setHistoryIndex(newIndex);
    
    if (newIndex === -1) {
      return '';
    } else {
      return commandHistory[commandHistory.length - 1 - newIndex];
    }
  }, [commandHistory, historyIndex, input]);

  // Get terminal statistics
  const getStats = useCallback(() => {
    return {
      totalCommands: commandHistory.length,
      totalLines: history.length,
      sessionStart: history.length > 0 ? history[0].timestamp : Date.now(),
      lastCommand: commandHistory.length > 0 ? commandHistory[commandHistory.length - 1] : null
    };
  }, [commandHistory, history]);

  return {
    // State
    history,
    input,
    commandHistory,
    
    // Actions
    setInput,
    processCommand,
    clearHistory,
    navigateHistory,
    
    // Utilities
    getStats
  };
};
