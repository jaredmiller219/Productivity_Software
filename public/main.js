import { app, BrowserWindow, ipcMain, dialog, session } from "electron";
import { join } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import isDev from "electron-is-dev";
import { readFile, writeFile } from "fs";
import { readdir, stat } from "fs/promises";
import path from "path";
import { spawn, execSync } from "child_process";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openDevTools = !process.argv.includes("--no-devtools");

let mainWindow;
let terminalProcesses = new Map(); // Store multiple terminal processes by ID

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      sandbox: false,
      preload: join(__dirname, 'preload.js')
    },
  });

  // Force production mode when running from build directory
  const isProduction = __dirname.includes('/build') || !isDev;

  mainWindow.loadURL(
    isProduction
      ? `file://${join(__dirname, "index.html")}`
      : "http://localhost:3000"
  );

  if (isDev && openDevTools) {
    mainWindow.webContents.openDevTools();
  }

  // Configure session permissions
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' https: http:; script-src 'self' 'unsafe-inline' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http:; font-src 'self' https: http:;",
        ],
      },
    });
  });

  mainWindow.on("closed", () => {
    // Clean up all terminal processes
    terminalProcesses.forEach((process) => {
      if (process && !process.killed) {
        process.kill();
      }
    });
    terminalProcesses.clear();
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Configure webview permissions
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (event, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      // Instead of deleting, let's set it to our verified preload script
      webPreferences.preload = join(__dirname, '../public/webview-preload.js');

      // Disable Node.js integration in webviews
      webPreferences.nodeIntegration = false;

      // Enable contextIsolation
      webPreferences.contextIsolation = true;

      // Allow insecure content for development
      webPreferences.webSecurity = false;

      // Verify URL being loaded - but don't prevent loading
      console.log("Webview loading URL:", params.src);
    });

    // Handle navigation events
    contents.on("will-navigate", (event, url) => {
      console.log("Navigation to", url);
    });

    // Log any errors
    contents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
      console.error("Failed to load:", validatedURL, errorDescription);
    });
  });

  // Add this to allow webview to load external URLs
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({
      requestHeaders: {
        ...details.requestHeaders,
        // Add a standard user agent
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Terminal handling with multiple terminal support
ipcMain.handle("terminal-init", async (event, terminalId = 'default') => {
  try {
    let shell;

    if (process.platform === "win32") {
      shell = "powershell.exe";
    } else {
      // Try zsh first, fall back to bash if not available
      try {
        // Check if zsh is available
        execSync('which zsh', { stdio: 'ignore' });
        shell = "zsh";
        console.log("Using zsh shell");
      } catch (error) {
        // zsh not found, use bash
        shell = "bash";
        console.log("zsh not found, falling back to bash");
      }
    }

    const terminalProcess = spawn(shell, [], {
      cwd: process.env.HOME || process.env.USERPROFILE,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLUMNS: '80',
        LINES: '24'
      },
    });

    // Store the process
    terminalProcesses.set(terminalId, terminalProcess);

    terminalProcess.stdout.on("data", (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("terminal-output", { terminalId, data: data.toString() });
      }
    });

    terminalProcess.stderr.on("data", (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("terminal-output", { terminalId, data: data.toString() });
      }
    });

    terminalProcess.on("exit", (code) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("terminal-output", {
          terminalId,
          data: `\r\nProcess exited with code ${code}\r\n`
        });
      }
      terminalProcesses.delete(terminalId);
    });

    return { success: true, terminalId };
  } catch (error) {
    console.error('Failed to initialize terminal:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("terminal-input", async (event, terminalId = 'default', data) => {
  try {
    const terminalProcess = terminalProcesses.get(terminalId);
    if (terminalProcess && terminalProcess.stdin.writable) {
      terminalProcess.stdin.write(data);
      return { success: true };
    }
    return { success: false, error: 'Terminal not found or not writable' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("terminal-close", async (event, terminalId = 'default') => {
  try {
    const terminalProcess = terminalProcesses.get(terminalId);
    if (terminalProcess) {
      terminalProcess.kill();
      terminalProcesses.delete(terminalId);
      return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Execute command and capture output
ipcMain.handle("execute-command", async (event, command) => {
  return new Promise((resolve) => {
    let shell;

    if (process.platform === "win32") {
      shell = "powershell.exe";
    } else {
      // Try zsh first, fall back to bash if not available
      try {
        execSync('which zsh', { stdio: 'ignore' });
        shell = "zsh";
      } catch (error) {
        shell = "bash";
      }
    }

    const childProcess = spawn(shell, ['-c', command], {
      cwd: process.env.HOME || process.env.USERPROFILE,
      env: process.env,
    });

    let output = '';
    let error = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    childProcess.on('close', (code) => {
      resolve({
        success: code === 0,
        output: output,
        error: error,
        exitCode: code
      });
    });

    childProcess.on('error', (err) => {
      resolve({
        success: false,
        output: '',
        error: err.message,
        exitCode: -1
      });
    });
  });
});

// Reset terminal (for recovery from problematic states)
ipcMain.handle("terminal-reset", async (event, terminalId = 'default') => {
  try {
    const terminalProcess = terminalProcesses.get(terminalId);
    if (terminalProcess && terminalProcess.stdin.writable) {
      // Send reset sequence
      terminalProcess.stdin.write('\x1b[2J\x1b[H'); // Clear screen and move cursor to home
      terminalProcess.stdin.write('\x1bc'); // Reset terminal
      terminalProcess.stdin.write('clear\n'); // Clear command
      return { success: true };
    }
    return { success: false, error: 'Terminal not found or not writable' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Execute command with file details (for ls command)
ipcMain.handle("execute-command-with-details", async (event, command) => {

  try {
    // For ls command, read the current directory
    const currentDir = process.env.HOME || process.env.USERPROFILE;
    const files = await readdir(currentDir);

    // Get file details
    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        try {
          const filePath = path.join(currentDir, fileName);
          const stats = await stat(filePath);

          return {
            name: fileName,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile(),
            size: stats.size,
            modified: stats.mtime
          };
        } catch (error) {
          // If we can't stat the file, treat it as a regular file
          return {
            name: fileName,
            isDirectory: false,
            isFile: true,
            size: 0,
            modified: new Date()
          };
        }
      })
    );

    return {
      success: true,
      files: fileDetails,
      error: null
    };

  } catch (error) {
    return {
      success: false,
      files: [],
      error: error.message
    };
  }
});

// File handling for IDE
ipcMain.on("open-file-dialog", async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  if (!canceled && filePaths.length > 0) {
    const filePath = filePaths[0];
    readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      event.sender.send("file-opened", { path: filePath, content: data });
    });
  }
});

ipcMain.on("save-file", (event, { path, content }) => {
  writeFile(path, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    event.sender.send("file-saved", { path });
  });
});

ipcMain.on("save-file-dialog", async (event, { content }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: "All Files", extensions: ["*"] }],
  });

  if (!canceled && filePath) {
    writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      event.sender.send("file-saved", { path: filePath });
      event.sender.send("file-opened", { path: filePath, content });
    });
  }
});

ipcMain.on("read-file", (event, { path }) => {
  readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    event.sender.send("file-opened", { path, content: data });
  });
});

// Handle save dialog with invoke/handle pattern
ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result;
});

// Handle file writing with invoke/handle pattern
ipcMain.handle('write-file', async (event, filePath, data) => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true, path: filePath });
      }
    });
  });
});
