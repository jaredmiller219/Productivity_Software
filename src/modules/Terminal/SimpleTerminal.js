import React, { useState, useRef, useEffect } from "react";
import "./Terminal.css";

function SimpleTerminal() {
  const [history, setHistory] = useState([
    { type: "output", content: "Welcome to Dev Suite Terminal" },
    { type: "output", content: "This is a simulated terminal environment." },
    { type: "output", content: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processCommand(input);
    }
  };

  const processCommand = (cmd) => {
    // Add command to history
    setHistory([...history, { type: "command", content: cmd }]);

    // Process command
    const command = cmd.trim();

    if (!command) {
      setHistory((prev) => [...prev, { type: "output", content: "" }]);
    } else {
      switch (command) {
        case "help":
          setHistory((prev) => [
            ...prev,
            { type: "output", content: "Available commands:" },
            { type: "output", content: "  help     - Show this help message" },
            { type: "output", content: "  clear    - Clear the terminal" },
            {
              type: "output",
              content: "  date     - Show current date and time",
            },
            { type: "output", content: "  echo     - Echo a message" },
          ]);
          break;
        case "clear":
          setHistory([]);
          break;
        case "date":
          setHistory((prev) => [
            ...prev,
            { type: "output", content: new Date().toString() },
          ]);
          break;
        default:
          if (command.startsWith("echo ")) {
            setHistory((prev) => [
              ...prev,
              { type: "output", content: command.substring(5) },
            ]);
          } else {
            setHistory((prev) => [
              ...prev,
              { type: "output", content: `Command not found: ${command}` },
            ]);
          }
      }
    }

    // Clear input
    setInput("");
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>Terminal</span>
      </div>
      <div className="simple-terminal" ref={terminalRef} onClick={handleClick}>
        <div className="terminal-history">
          {history.map((item, index) => (
            <div key={index} className={`terminal-line ${item.type}`}>
              {item.type === "command" ? "$ " + item.content : item.content}
            </div>
          ))}
        </div>
        <div className="terminal-input-line">
          <span className="prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default SimpleTerminal;
