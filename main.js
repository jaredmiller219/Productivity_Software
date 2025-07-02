import { app, BrowserWindow, ipcMain, dialog, session } from "electron";
import { join } from "path";
import isDev from "electron-is-dev";
import { readFile, writeFile } from "fs";
import { spawn } from "child_process";

const openDevTools = !process.argv.includes("--no-devtools");

let mainWindow;
let terminalProcess;

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
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${join(__dirname, "../build/index.html")}`
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
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*; font-src 'self'",
        ],
      },
    });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (terminalProcess) {
      terminalProcess.kill();
      terminalProcess = null;
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Enable webview tags
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (event, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload;

      // Disable Node.js integration in webviews
      webPreferences.nodeIntegration = false;

      // Enable contextIsolation
      webPreferences.contextIsolation = true;

      // Verify URL being loaded
      if (
        !params.src.startsWith("https://") &&
        !params.src.startsWith("http://")
      ) {
        event.preventDefault();
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

// Terminal handling
ipcMain.on("terminal-init", (event) => {
  const shell = process.platform === "win32" ? "powershell.exe" : "bash";
  terminalProcess = spawn(shell, [], {
    cwd: process.env.HOME || process.env.USERPROFILE,
    env: process.env,
  });

  terminalProcess.stdout.on("data", (data) => {
    event.sender.send("terminal-output", data.toString());
  });

  terminalProcess.stderr.on("data", (data) => {
    event.sender.send("terminal-output", data.toString());
  });

  terminalProcess.on("exit", (code) => {
    event.sender.send(
      "terminal-output",
      `\r\nProcess exited with code ${code}\r\n`
    );
    terminalProcess = null;
  });
});

ipcMain.on("terminal-input", (event, data) => {
  if (terminalProcess && terminalProcess.stdin.writable) {
    terminalProcess.stdin.write(data);
  }
});

ipcMain.on("terminal-close", () => {
  if (terminalProcess) {
    terminalProcess.kill();
    terminalProcess = null;
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
