import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./Terminal.css";

function Terminal() {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    // Only initialize if the ref is available
    if (!terminalRef.current) return;

    // Import xterm dynamically to avoid SSR issues
    const initTerminal = async () => {
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
        term.open(terminalRef.current);

        // Wait a moment before fitting to ensure DOM is ready
        setTimeout(() => {
          try {
            fitAddon.fit();
          } catch (e) {
            console.warn("Error fitting terminal:", e);
          }
        }, 100);

        // Store reference to terminal
        xtermRef.current = { term, fitAddon };

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
            // Do not delete the prompt
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
            if (xtermRef.current && xtermRef.current.fitAddon) {
              xtermRef.current.fitAddon.fit();
            }
          } catch (e) {
            console.warn("Error resizing terminal:", e);
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (xtermRef.current && xtermRef.current.term) {
            xtermRef.current.term.dispose();
          }
        };
      } catch (error) {
        console.error("Failed to initialize terminal:", error);
      }
    };

    initTerminal();
  }, []);

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
        break;
      case "clear":
        term.clear();
        break;
      case "date":
        term.writeln(new Date().toString());
        break;
      default:
        if (cmd.startsWith("echo ")) {
          term.writeln(cmd.substring(5));
        } else {
          term.writeln(`Command not found: ${cmd}`);
        }
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>Terminal</span>
      </div>
      <div className="terminal" ref={terminalRef}></div>
    </div>
  );
}

export default Terminal;
