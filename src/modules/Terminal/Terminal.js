import {useEffect, useRef, useState} from "react";
import {Terminal as XTerm} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import "xterm/css/xterm.css";
import {TERMINAL_THEMES} from "./components/TerminalThemes/TerminalThemes.js";
import TerminalSettings, {DEFAULT_SETTINGS} from "./components/TerminalSettings/TerminalSettings.js";
import TerminalAutocomplete from "./components/TerminalAutocomplete/TerminalAutocomplete.js";
import TerminalSplitManager from "./components/TerminalSplitPane/TerminalSplitPane.js";
import ThemeSelector from "./components/ThemeSelector/ThemeSelector.js";
import TabSettings from "./components/TabSettings/TabSettings.js";
import "./Terminal.css";

function Terminal() {
  const [tabs, setTabs] = useState([{ id: 1, name: "Terminal 1", cwd: "~" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [currentTheme, setCurrentTheme] = useState('cyber');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showTabSettings, setShowTabSettings] = useState(false);

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ x: 0, y: 0 });
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [splitLayout, setSplitLayout] = useState('single');
  const [, setTabHistory] = useState({}); // tabHistory state for future use
  const [tabSettings, setTabSettings] = useState({});

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
      // Ensure container exists and has dimensions first
      const container = terminalRefs.current[tabId];
      if (!container) {
        console.error(`Terminal container for tab ${tabId} not found`);
        return;
      }

      // Wait for container to be properly sized
      const waitForContainer = () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 20;

          const checkDimensions = () => {
            const rect = container.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              resolve({ width: rect.width, height: rect.height });
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkDimensions, 100);
            } else {
              reject(new Error('Container never got proper dimensions'));
            }
          };

          checkDimensions();
        });
      };

      // Wait for container to be ready
      await waitForContainer();

      // Initialize xterm.js with current theme and settings
      const theme = TERMINAL_THEMES[currentTheme];
      if (!theme) {
        console.error(`Theme ${currentTheme} not found!`);
        return;
      }

      const term = new XTerm({
        cursorBlink: settings.cursorBlink,
        cursorStyle: settings.cursorStyle,
        theme: {
          background: theme.background,
          foreground: theme.foreground,
          cursor: theme.cursor,
          black: theme.black,
          red: theme.red,
          green: theme.green,
          yellow: theme.yellow,
          blue: theme.blue,
          magenta: theme.magenta,
          cyan: theme.cyan,
          white: theme.white,
          brightBlack: theme.brightBlack,
          brightRed: theme.brightRed,
          brightGreen: theme.brightGreen,
          brightYellow: theme.brightYellow,
          brightBlue: theme.brightBlue,
          brightMagenta: theme.brightMagenta,
          brightCyan: theme.brightCyan,
          brightWhite: theme.brightWhite
        },
        scrollback: settings.scrollback,
        disableStdin: false,
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        lineHeight: settings.lineHeight,
        allowTransparency: settings.allowTransparency,
        bellSound: settings.bellSound,
        wordWrap: settings.wordWrap,
        macOptionIsMeta: settings.macOptionIsMeta,
        rightClickSelectsWord: settings.rightClickSelectsWord,
        copyOnSelect: settings.copyOnSelect,
        cols: 80,
        rows: 24
      });

      // Create FitAddon but don't use it immediately
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      // Open terminal in the container
      term.open(container);

      // Use a more conservative approach to fitting
      setTimeout(() => {
        try {
          const rect = container.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            fitAddon.fit();
          } else {
            // Fallback to manual sizing
            term.resize(80, 24);
          }
        } catch (e) {
          console.warn("Error fitting terminal, using fallback:", e);
          try {
            term.resize(80, 24);
          } catch (resizeError) {
            console.warn("Error with fallback resize:", resizeError);
          }
        }
      }, 300);

      // Store reference to terminal
      xtermRefs.current[tabId] = { term, fitAddon };
      initializedTabs.current.add(tabId);

      // Welcome message with error handling
      try {
        term.writeln("Welcome to Dev Suite Terminal");
        term.writeln("This is a simulated terminal environment.");
        term.writeln('Type "help" for available commands.');
        term.write("\r\n$ ");
      } catch (e) {
        console.warn("Error writing welcome message:", e);
      }

      // Handle user input with enhanced features
      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        // Handle keyboard shortcuts
        if (domEvent.ctrlKey) {
          switch (domEvent.key.toLowerCase()) {
            case 'c':
              if (settings.keyBindings.copy === 'Ctrl+C') {
                const selectedText = window.getSelection().toString();
                if (selectedText) {
                  navigator.clipboard.writeText(selectedText)
                      .then(() => {
                        console.log('Copied to clipboard');
                      })
                      .catch(err => {
                        console.error('Failed to copy: ', err);
                      });
                }
                return;
              }
              break;

            case 'v':
              if (settings.keyBindings.paste === 'Ctrl+V') {
                navigator.clipboard.readText()
                    .then(text => {
                      term.write(text);
                      updateCurrentInput(getCurrentInput(term) + text);
                    })
                    .catch(err => {
                      console.error('Failed to paste: ', err);
                    });
                return;
              }
              break;

            case 't':
              if (settings.keyBindings.newTab === 'Ctrl+T') {
                addTab();
                return;
              }
              break;
          }
        }

        if (domEvent.key === "Enter") {
          // Enter key
          const line =
              term.buffer.active
                  .getLine(term.buffer.active.cursorY)
                  ?.translateToString() || "";
          const command = line.substring(line.lastIndexOf("$ ") + 2);

          if (command.trim()) {
            setCommandHistory(prev => [...prev, command.trim()].slice(-100)); // Keep last 100 commands
          }

          term.writeln("");
          processCommand(command, term);
          term.write("$ ");
          setCurrentInput('');
          setShowAutocomplete(false);

        } else if (domEvent.key === "Backspace") {
          // Backspace
          if (term.buffer.active.cursorX > 2) {
            term.write("\b \b");
            const newInput = getCurrentInput(term).slice(0, -1);
            updateCurrentInput(newInput);
          }

        } else if (domEvent.key === "Tab") {
          // Tab key - trigger autocomplete
          domEvent.preventDefault();
          const input = getCurrentInput(term);
          if (input.trim()) {
            const rect = term.element.getBoundingClientRect();
            setAutocompletePosition({
              x: rect.left + (term.buffer.active.cursorX * 9), // Approximate character width
              y: rect.top + (term.buffer.active.cursorY * 17) + 20 // Approximate line height
            });
            setCurrentInput(input);
            setShowAutocomplete(true);
          }

        } else if (printable) {
          term.write(key);
          const newInput = getCurrentInput(term) + key;
          updateCurrentInput(newInput);
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
      console.error(`Error initializing terminal ${tabId}:`, error);
      initializedTabs.current.delete(tabId);

      // Clean up any partial initialization
      if (xtermRefs.current[tabId]) {
        try {
          if (xtermRefs.current[tabId].term) {
            xtermRefs.current[tabId].term.dispose();
          }
        } catch (disposeError) {
          console.warn("Error disposing terminal:", disposeError);
        }
        delete xtermRefs.current[tabId];
      }
    }
  };

  // Helper functions
  const getCurrentInput = (term) => {
    const line = term.buffer.active
      .getLine(term.buffer.active.cursorY)
      ?.translateToString() || "";
    return line.substring(line.lastIndexOf("$ ") + 2);
  };

  const updateCurrentInput = (input) => {
    setCurrentInput(input);
  };

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);

    // Apply theme to all terminals
    Object.keys(xtermRefs.current).forEach(tabId => {
      if (xtermRefs.current[tabId]?.term) {
        const theme = TERMINAL_THEMES[themeName];
        if (theme) {
          // Create a theme object for xterm
          // Apply theme
          xtermRefs.current[tabId].term.options.theme = {
            background: theme.background,
            foreground: theme.foreground,
            cursor: theme.cursor,
            // selection: theme.selection,
            black: theme.black,
            red: theme.red,
            green: theme.green,
            yellow: theme.yellow,
            blue: theme.blue,
            magenta: theme.magenta,
            cyan: theme.cyan,
            white: theme.white,
            brightBlack: theme.brightBlack,
            brightRed: theme.brightRed,
            brightGreen: theme.brightGreen,
            brightYellow: theme.brightYellow,
            brightBlue: theme.brightBlue,
            brightMagenta: theme.brightMagenta,
            brightCyan: theme.brightCyan,
            brightWhite: theme.brightWhite
          };

          // Force refresh
          xtermRefs.current[tabId].term.refresh(0, xtermRefs.current[tabId].term.rows - 1);

          // Also update the terminal container background
          if (terminalRefs.current[tabId]) {
            terminalRefs.current[tabId].style.backgroundColor = theme.background;
          }
        } else {
          console.error(`Theme ${themeName} not found!`);
        }
      }
    });
  };

  const handleTabSettingsChange = (tabId, newSettings) => {
    setTabSettings(prev => ({ ...prev, [tabId]: newSettings }));

    // Apply settings to the specific terminal
    if (xtermRefs.current[tabId]?.term) {
      const term = xtermRefs.current[tabId].term;

      // Apply font settings
      if (newSettings.fontSize) {
        term.options.fontSize = newSettings.fontSize;
      }
      if (newSettings.fontFamily) {
        term.options.fontFamily = newSettings.fontFamily;
      }
      if (newSettings.lineHeight) {
        term.options.lineHeight = newSettings.lineHeight;
      }
      if (newSettings.cursorStyle) {
        term.options.cursorStyle = newSettings.cursorStyle;
      }
      if (typeof newSettings.cursorBlink === 'boolean') {
        term.options.cursorBlink = newSettings.cursorBlink;
      }

      // Apply theme if changed
      if (newSettings.theme && newSettings.theme !== currentTheme) {
        const theme = TERMINAL_THEMES[newSettings.theme];
        if (theme) {
          term.options.theme = {
            background: theme.background,
            foreground: theme.foreground,
            cursor: theme.cursor,
            // selection: theme.selection,
            black: theme.black,
            red: theme.red,
            green: theme.green,
            yellow: theme.yellow,
            blue: theme.blue,
            magenta: theme.magenta,
            cyan: theme.cyan,
            white: theme.white,
            brightBlack: theme.brightBlack,
            brightRed: theme.brightRed,
            brightGreen: theme.brightGreen,
            brightYellow: theme.brightYellow,
            brightBlue: theme.brightBlue,
            brightMagenta: theme.brightMagenta,
            brightCyan: theme.brightCyan,
            brightWhite: theme.brightWhite
          };
        }
      }

      // Apply opacity to terminal container
      if (newSettings.opacity && terminalRefs.current[tabId]) {
        terminalRefs.current[tabId].style.opacity = newSettings.opacity;
      }

      // Force refresh
      term.refresh(0, term.rows - 1);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Apply settings to all terminals
    Object.keys(xtermRefs.current).forEach(tabId => {
      if (xtermRefs.current[tabId]?.term) {
        const term = xtermRefs.current[tabId].term;
        term.options.fontSize = newSettings.fontSize;
        term.options.fontFamily = newSettings.fontFamily;
        term.options.cursorBlink = newSettings.cursorBlink;
        term.options.cursorStyle = newSettings.cursorStyle;
        term.options.scrollback = newSettings.scrollback;
        // Refresh terminal
        term.refresh(0, term.rows - 1);
      }
    });
  };

  const handleAutocompleteSelect = (newInput) => {
    const activeTerminal = xtermRefs.current[activeTab]?.term;
    if (activeTerminal) {
      // Clear current line and write new input
      const currentLine = getCurrentInput(activeTerminal);
      for (let i = 0; i < currentLine.length; i++) {
        activeTerminal.write('\b \b');
      }
      activeTerminal.write(newInput);
      setCurrentInput(newInput);
    }
    setShowAutocomplete(false);
  };

  // Helper function to resolve paths
  const resolvePath = (currentDir, targetPath) => {
    // Handle absolute paths
    if (targetPath.startsWith('/')) {
      return normalizePath(targetPath);
    }

    // Handle home directory shortcut
    if (targetPath === '~' || targetPath.startsWith('~/')) {
      const homePath = '/home/user';
      if (targetPath === '~') {
        return homePath;
      }
      return resolvePath(homePath, targetPath.substring(2));
    }

    // Handle relative paths
    const parts = currentDir.split('/').filter(part => part !== '');
    const targetParts = targetPath.split('/').filter(part => part !== '');

    for (const part of targetParts) {
      if (part === '..') {
        if (parts.length > 0) {
          parts.pop();
        }
      } else if (part === '.' || part === '') {
        // Current directory or empty, do nothing
        continue;
      } else {
        parts.push(part);
      }
    }

    return '/' + parts.join('/');
  };

  // Helper function to normalize paths
  const normalizePath = (path) => {
    const parts = path.split('/').filter(part => part !== '');
    const normalized = [];

    for (const part of parts) {
      if (part === '..') {
        if (normalized.length > 0) {
          normalized.pop();
        }
      } else if (part !== '.' && part !== '') {
        normalized.push(part);
      }
    }

    return '/' + normalized.join('/');
  };

  // Enhanced command processing with more commands
  const processCommand = (command, term) => {
    const cmd = command.trim();
    const args = cmd.split(' ');
    const baseCmd = args[0];

    if (!cmd) return;

    switch (baseCmd) {
      case "help":
        term.writeln("Available commands:");
        term.writeln("  help          - Show this help message");
        term.writeln("  clear         - Clear the terminal");
        term.writeln("  date          - Show current date and time");
        term.writeln("  echo <text>   - Echo a message");
        term.writeln("  newtab        - Create a new terminal tab");
        term.writeln("  history       - Show command history");
        term.writeln("  theme         - Open theme selector");
        term.writeln("  settings      - Open terminal settings");
        term.writeln("  ls            - List directory contents (simulated)");
        term.writeln("  pwd           - Print working directory");
        term.writeln("  cd <dir>      - Change directory (supports .., ./, ../, ~)");
        term.writeln("  whoami        - Show current user");
        term.writeln("  uname         - System information");
        term.writeln("  ps            - Show running processes (simulated)");
        term.writeln("  top           - Show system resources");
        term.writeln("  ping <host>   - Ping a host");
        term.writeln("  curl <url>    - Make HTTP request");
        term.writeln("  git <cmd>     - Git commands");
        term.writeln("  npm <cmd>     - NPM commands");
        term.writeln("  node <file>   - Run Node.js file");
        term.writeln("  python <file> - Run Python file");
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
      case "history":
        term.writeln("Command history:");
        commandHistory.slice(-10).forEach((histCmd, index) => {
          term.writeln(`  ${commandHistory.length - 10 + index + 1}  ${histCmd}`);
        });
        break;
      case "theme":
        setShowThemeSelector(true);
        term.writeln("Theme selector opened");
        break;
      case "settings":
        setShowSettings(true);
        term.writeln("Settings panel opened");
        break;
      case "ls":
        term.writeln("total 8");
        term.writeln("drwxr-xr-x  5 user user 4096 Dec 13 10:30 documents");
        term.writeln("drwxr-xr-x  3 user user 4096 Dec 13 09:15 downloads");
        term.writeln("-rw-r--r--  1 user user 1024 Dec 13 11:45 readme.txt");
        term.writeln("-rwxr-xr-x  1 user user 2048 Dec 13 08:30 script.sh");
        break;
      case "pwd":
        const currentTab = tabs.find(tab => tab.id === activeTab);
        const currentDir = currentTab?.cwd || "/home/user";
        // Convert ~ to full path for display
        const displayDir = currentDir === "~" ? "/home/user" : currentDir;
        term.writeln(displayDir);
        break;
      case "cd":
        const currentTabForCd = tabs.find(tab => tab.id === activeTab);
        const currentCwd = currentTabForCd?.cwd || "/home/user";
        const targetPath = args.slice(1).join(' ') || "~";

        // Convert ~ to full path for processing
        const currentDirFull = currentCwd === "~" ? "/home/user" : currentCwd;
        const newPath = resolvePath(currentDirFull, targetPath);

        // Convert back to ~ notation if it's the home directory
        const newCwd = newPath === "/home/user" ? "~" : newPath;

        // Update the current tab's cwd
        setTabs(prev => prev.map(tab =>
          tab.id === activeTab ? { ...tab, cwd: newCwd } : tab
        ));

        // No output for successful cd (like real terminals)
        break;
      case "whoami":
        term.writeln("user");
        break;
      case "uname":
        if (args[1] === "-a") {
          term.writeln("DevSuite 1.0.0 Terminal Emulator x86_64 GNU/Linux");
        } else {
          term.writeln("DevSuite");
        }
        break;
      case "ps":
        term.writeln("  PID TTY          TIME CMD");
        term.writeln(" 1234 pts/0    00:00:01 bash");
        term.writeln(" 5678 pts/0    00:00:00 terminal");
        term.writeln(" 9012 pts/0    00:00:00 ps");
        break;
      case "top":
        term.writeln("Tasks: 156 total,   1 running, 155 sleeping");
        term.writeln("CPU usage: 12.5%");
        term.writeln("Memory usage: 2.1GB / 8.0GB");
        term.writeln("Load average: 0.45, 0.32, 0.28");
        break;
      case "ping":
        if (args[1]) {
          term.writeln(`PING ${args[1]} (127.0.0.1): 56 data bytes`);
          term.writeln(`64 bytes from 127.0.0.1: icmp_seq=0 time=0.123ms`);
          term.writeln(`--- ${args[1]} ping statistics ---`);
          term.writeln("1 packets transmitted, 1 received, 0% packet loss");
        } else {
          term.writeln("ping: usage: ping <hostname>");
        }
        break;
      case "curl":
        if (args[1]) {
          term.writeln(`Connecting to ${args[1]}...`);
          term.writeln("HTTP/1.1 200 OK");
          term.writeln("Content-Type: text/html");
          term.writeln("Content-Length: 1234");
          term.writeln("");
          term.writeln("<html><body>Sample response</body></html>");
        } else {
          term.writeln("curl: usage: curl <url>");
        }
        break;
      case "git":
        if (args[1]) {
          switch (args[1]) {
            case "status":
              term.writeln("On branch main");
              term.writeln("Your branch is up to date with 'origin/main'.");
              term.writeln("nothing to commit, working tree clean");
              break;
            case "log":
              term.writeln("commit abc123def456 (HEAD -> main, origin/main)");
              term.writeln("Author: Developer <dev@example.com>");
              term.writeln("Date:   Thu Dec 13 10:30:00 2024 +0000");
              term.writeln("");
              term.writeln("    Initial commit");
              break;
            default:
              term.writeln(`git: '${args[1]}' is not a git command. See 'git --help'.`);
          }
        } else {
          term.writeln("usage: git <command> [<args>]");
        }
        break;
      case "npm":
        if (args[1]) {
          switch (args[1]) {
            case "version":
              term.writeln("8.19.2");
              break;
            case "list":
              term.writeln("productivity-suite@1.0.0");
              term.writeln("├── react@18.2.0");
              term.writeln("├── electron@22.0.0");
              term.writeln("└── xterm@5.1.0");
              break;
            default:
              term.writeln(`npm: command '${args[1]}' not recognized`);
          }
        } else {
          term.writeln("usage: npm <command>");
        }
        break;
      case "node":
        if (args[1]) {
          term.writeln(`Running ${args[1]}...`);
          term.writeln("Hello from Node.js!");
        } else {
          term.writeln("Welcome to Node.js v18.12.0.");
          term.writeln("Type \".help\" for more information.");
        }
        break;
      case "python":
        if (args[1]) {
          term.writeln(`Running ${args[1]}...`);
          term.writeln("Hello from Python!");
        } else {
          term.writeln("Python 3.9.0 (default, Dec 13 2024, 10:30:00)");
          term.writeln("Type \"help\", \"copyright\", \"credits\" or \"license\" for more information.");
        }
        break;
      default:
        if (cmd.startsWith("echo ")) {
          term.writeln(cmd.substring(5));
        } else {
          term.writeln(`Command not found: ${cmd}`);
          term.writeln("Type 'help' for available commands.");
        }
    }
  };

  // Add a new terminal tab
  const addTab = () => {
    const newId =
      tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    const newTab = {
      id: newId,
      name: `Terminal ${newId}`,
      cwd: "~",
      status: "ready"
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTab(newId);
    setTabHistory(prev => ({ ...prev, [newId]: [] }));
    setTabSettings(prev => ({
      ...prev,
      [newId]: {
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        theme: currentTheme,
        opacity: 1,
        lineHeight: settings.lineHeight,
        cursorStyle: settings.cursorStyle,
        cursorBlink: settings.cursorBlink
      }
    }));
  };

  const renameTab = (id, newName) => {
    setTabs(prev => prev.map(tab =>
      tab.id === id ? { ...tab, name: newName } : tab
    ));
  };

  // Removed unused duplicateTab function

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Resize all active terminals
      Object.values(xtermRefs.current).forEach(({ fitAddon }) => {
        if (fitAddon) {
          try {
            setTimeout(() => {
              fitAddon.fit();
            }, 100);
          } catch (e) {
            console.warn("Error resizing terminal:", e);
          }
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize terminal when component mounts
  useEffect(() => {
    // Temporarily disable terminal initialization for debugging
    console.log("Terminal component mounted, skipping XTerm initialization for now");
    // initTerminal(1).then(() => {
    //   console.log("Initial terminal initialized successfully");
    // }).catch(error => {
    //   console.error("Failed to initialize initial terminal:", error);
    // });
  }, []);

  // Initialize terminal when tab becomes active or new tabs are created
  useEffect(() => {
    tabs.forEach(tab => {
      if (!initializedTabs.current.has(tab.id)) {
        initTerminal(tab.id).then(() => {}).catch(error => {
          console.error(`Error initializing terminal ${tab.id}:`, error);
        });
      }
    });
  }, [tabs]);

  // Initialize terminal when tab becomes active
  useEffect(() => {
    if (activeTab) {
      initTerminal(activeTab).then(() => {
        console.log(`Terminal ${activeTab} initialization completed`);
      }).catch(error => {
        console.error(`Error initializing terminal ${activeTab}:`, error);
      });
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            addTab();
            break;
          case 'w':
            e.preventDefault();
            if (tabs.length > 1) {
              const tabToClose = tabs.find(tab => tab.id === activeTab);
              if (tabToClose) {
                closeTab(activeTab, { stopPropagation: () => {} });
              }
            }
            break;
          case 'Tab':
            e.preventDefault();
            const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
            const nextIndex = e.shiftKey
              ? (currentIndex - 1 + tabs.length) % tabs.length
              : (currentIndex + 1) % tabs.length;
            setActiveTab(tabs[nextIndex].id);
            break;
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            const tabIndex = parseInt(e.key) - 1;
            if (tabIndex < tabs.length) {
              e.preventDefault();
              setActiveTab(tabs[tabIndex].id);
            }
            break;
          case ',':
            e.preventDefault();
            setShowTabSettings(true);
            break;
          case 'k':
            if (e.shiftKey) {
              e.preventDefault();
              setShowThemeSelector(true);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTab]);

  // Debug logging
  console.log("Terminal render - tabs:", tabs, "activeTab:", activeTab);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-controls">
          <button
            className="control-btn theme-btn"
            onClick={() => setShowThemeSelector(true)}
            title="Change Terminal Theme"
          >
            🎨 Themes
          </button>
          <button
            className="control-btn settings-btn"
            onClick={() => setShowTabSettings(true)}
            title="Terminal Settings for Current Tab"
          >
            ⚙️ Settings
          </button>
          <button
            className="control-btn help-btn"
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            title="Keyboard Shortcuts"
          >
            ❓ Help
          </button>
          <button
            className="control-btn debug-btn"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            title="Debug Information"
          >
            🔧 Debug
          </button>
        </div>

        {/* Debug Info Panel */}
        {showDebugInfo && (
          <div className="debug-info-panel" style={{
            position: 'absolute',
            top: '44px',
            right: '10px',
            background: '#1a1a1a',
            border: '1px solid #00ff41',
            borderRadius: '6px',
            padding: '15px',
            color: '#00ff41',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 1000,
            minWidth: '300px'
          }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>🔧 Debug Information</div>
            <div>Tabs: {JSON.stringify(tabs)}</div>
            <div>Active Tab: {activeTab}</div>
            <div>Current Theme: {currentTheme}</div>
            <div>Split Layout: {splitLayout}</div>
            <div style={{ marginTop: '10px', padding: '8px', border: '1px solid #333' }}>
              <div>Advanced Terminal Features:</div>
              <div>• Multiple tabs ✅</div>
              <div>• Theme controls ✅</div>
              <div>• Settings panel ✅</div>
              <div>• XTerm.js integration (disabled for debugging)</div>
            </div>
            <button
              onClick={() => setShowDebugInfo(false)}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                background: '#00ff41',
                color: '#000',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Internal Tab Bar */}
      <div className="internal-tab-bar">
        <div className="tab-list">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`internal-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              title={`${tab.name} - Click to switch`}
            >
              <span className="internal-tab-icon">⚡</span>
              <span className="internal-tab-name">{tab.name}</span>
              <span className="internal-tab-status">
                {tab.status === 'running' ? '●' : '○'}
              </span>
              {tabs.length > 1 && (
                <button
                  className="internal-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id, e);
                  }}
                  title="Close tab"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          className="internal-add-tab-btn"
          onClick={addTab}
          title="Add new terminal tab (Ctrl+T)"
        >
          <span className="add-icon">+</span>
        </button>
      </div>

      {/* Terminal Content Area */}
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
          >
            {/* Clean terminal placeholder - ready for XTerm integration */}
            <div style={{
              padding: '20px',
              color: '#00ff41',
              fontFamily: 'monospace',
              background: '#0d1117',
              height: '100%',
              overflow: 'hidden'
            }}>
              <div style={{ marginBottom: '10px' }}>
                Welcome to Advanced Terminal - {tab.name}
              </div>
              <div style={{ marginBottom: '5px' }}>
                Working Directory: {tab.cwd}
              </div>
              <div style={{ marginBottom: '20px', opacity: 0.7 }}>
                XTerm.js integration ready for implementation
              </div>
              <div style={{ color: '#00ff41' }}>
                $ <span style={{ animation: 'blink 1s infinite' }}>█</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Terminal;
