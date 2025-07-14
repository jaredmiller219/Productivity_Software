import React, { useState } from "react";
import TerminalHeader from "./components/TerminalHeader/TerminalHeader.js";
import TerminalDisplay from "./components/TerminalDisplay/TerminalDisplay.js";
import TerminalInput from "./components/TerminalInput/TerminalInput.js";
import { useTerminal } from "./hooks/useTerminal.js";
import "./SimpleTerminal.css";

function SimpleTerminal() {
  const [theme, setTheme] = useState('dark');
  
  const {
    history,
    input,
    setInput,
    processCommand,
    clearHistory,
    navigateHistory,
    getStats
  } = useTerminal();

  const handleSubmit = () => {
    if (input && input.trim()) {
      processCommand(input);
    }
    setInput("");
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      theme,
      history,
      stats: getStats()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-session-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`terminal-container ${theme}`}>
      <TerminalHeader
        onClear={clearHistory}
        onToggleTheme={handleToggleTheme}
        onExport={handleExport}
        stats={getStats()}
        theme={theme}
      />
      
      <TerminalDisplay
        history={history}
      />
      
      <TerminalInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onHistoryNavigate={navigateHistory}
      />
    </div>
  );
}

export default SimpleTerminal;
