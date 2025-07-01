import React, { useState, useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./Terminal.css";

function Terminal() {
  const [tabs, setTabs] = useState([{ id: 1, name: "Terminal 1" }]);
  const [activeTab, setActiveTab] = useState(1);
  const terminalRefs = useRef({});
  const xtermRefs = useRef({});
  const initializedTabs = useRef(new Set());

  // Initialize terminal for a specific tab
  const initTerminal = async (tabId) => {
    // Skip if already initialized
    if (initializedTabs.current.has(tabId)) return;

    // Skip if ref not available
    if (!terminalRefs.current[tabId]) return;

    try {
      // Initialize xterm.js
      const term = new XTerm({
        cursorBlink: true,
        theme: {
          background: "#1e1e1e",
          foreground: "#f0f0f0",
        },
        scrollback: 1000,
        rendererType: "canvas",
        disableStdin: false,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      // Open terminal in the container
      term.open(terminalRefs.current[tabId]);

      // Wait a moment before fitting to ensure DOM is ready
      setTimeout(() => {
        try {
          fitAddon.fit();
        } catch (e) {
          console.warn("Error fitting terminal:", e);
        }
      }, 100);

      // Store reference to terminal
      xtermRefs.current[tabId] = { term, fitAddon };
      initializedTabs.current.add(tabId);

      // Welcome message
      term.writeln("Welcome to Dev Suite Terminal");
      term.writeln("This is a simulated terminal environment.");
      term.writeln('Type "help" for available commands.');
      term.write("\r\n$ ");

      // Handle user input
      term.onKey(({ key, domEvent }) => {
        const printable =
          !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter key
          const line =
            term.buffer.active
              .getLine(term.buffer.active.cursorY)
              ?.translateToString() || "";
          const command = line.substring(line.lastIndexOf("$ ") + 2);

          term.writeln("");
          processCommand(command, term);
          term.write("$ ");
        } else if (domEvent.keyCode === 8) {
          // Backspace
          // Does not delete the prompt
          if (term.buffer.active.cursorX > 2) {
            term.write("\b \b");
          }
        } else if (printable) {
          term.write(key);
        }
      });

      // Handle window resize
      const handleResize = () => {
        try {
          if (xtermRefs.current[tabId] && xtermRefs.current[tabId].fitAddon) {
            xtermRefs.current[tabId].fitAddon.fit();
          }
        } catch (e) {
          console.warn("Error resizing terminal:", e);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (error) {
      console.error("Failed to initialize terminal:", error);
    }
  };

  // Process terminal commands
  const processCommand = (command, term) => {
    const cmd = command.trim();

    if (!cmd) return;

    switch (cmd) {
      case "help":
        term.writeln("Available commands:");
        term.writeln("  help     - Show this help message");
        term.writeln("  clear    - Clear the terminal");
        term.writeln("  date     - Show current date and time");
        term.writeln("  echo     - Echo a message");
        term.writeln("  newtab   - Create a new terminal tab");
        break;
      case "clear":
        term.clear();
        break;
      case "date":
        term.writeln(new Date().toString());
        break;
      case "newtab":
        addTab();
        term.writeln("New terminal tab created");
        break;
      default:
        if (cmd.startsWith("echo ")) {
          term.writeln(cmd.substring(5));
        } else {
          term.writeln(`Command not found: ${cmd}`);
        }
    }
  };

  // Add a new terminal tab
  const addTab = () => {
    const newId =
      tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    setTabs([...tabs, { id: newId, name: `Terminal ${newId}` }]);
    setActiveTab(newId);
  };

  // Close the terminal tab
  const closeTab = (tabId, event) => {
    event.stopPropagation();

    // Don't close if it's the last tab
    if (tabs.length === 1) return;

    // Clean up terminal instance
    if (xtermRefs.current[tabId] && xtermRefs.current[tabId].term) {
      xtermRefs.current[tabId].term.dispose();
      delete xtermRefs.current[tabId];
      initializedTabs.current.delete(tabId);
    }

    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    // If we closed the active tab, activate another one
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  // Initialize terminal when component mounts
  useEffect(() => {
    // Initialize the first terminal
    initTerminal(1).then(() => {});
  }, []);

  // Initialize terminal when tab becomes active
  useEffect(() => {
    if (activeTab) {
      initTerminal(activeTab).then(() => {});
    }
  }, [activeTab]);

  // Fit terminal when tab becomes active
  useEffect(() => {
    if (activeTab && xtermRefs.current[activeTab]) {
      setTimeout(() => {
        try {
          xtermRefs.current[activeTab].fitAddon.fit();
        } catch (e) {
          console.warn("Error fitting terminal:", e);
        }
      }, 100);
    }
  }, [activeTab]);

  // Clean up all terminals on unmounting
  useEffect(() => {
    return () => {
      Object.keys(xtermRefs.current).forEach((tabId) => {
        if (xtermRefs.current[tabId] && xtermRefs.current[tabId].term) {
          xtermRefs.current[tabId].term.dispose();
        }
      });
    };
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`terminal-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.name}</span>
            <button
              className="close-tab-btn"
              onClick={(e) => closeTab(tab.id, e)}
            >
              ×
            </button>
          </div>
        ))}
        <button className="add-tab-btn" onClick={addTab}>
          +
        </button>
      </div>
      <div className="terminal-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`terminal-instance ${
              activeTab === tab.id ? "active" : ""
            }`}
            ref={(el) => {
              terminalRefs.current[tab.id] = el;
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Terminal;
