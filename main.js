const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
let terminalProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (terminalProcess) {
      terminalProcess.kill();
      terminalProcess = null;
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
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
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      event.sender.send("file-opened", { path: filePath, content: data });
    });
  }
});

ipcMain.on("save-file", (event, { path, content }) => {
  fs.writeFile(path, content, (err) => {
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
    fs.writeFile(filePath, content, (err) => {
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
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    event.sender.send("file-opened", { path, content: data });
  });
});
