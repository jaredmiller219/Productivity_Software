const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const { join } = require("path");
const isDev = require("electron-is-dev");
const { readFile, writeFile } = require("fs");
const { spawn } = require("child_process");

const openDevTools = !process.argv.includes("--no-devtools");

let mainWindow;
let terminalProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, "preload.js"),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: 'hiddenInset',
    show: false,
    backgroundColor: '#0d1117'
  });

  const startUrl = isDev 
    ? "http://localhost:3000" 
    : `file://${join(__dirname, "../build/index.html")}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev && openDevTools) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (terminalProcess) {
      terminalProcess.kill();
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

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('read-file', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
});

ipcMain.handle('write-file', async (event, filePath, data) => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, data, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

ipcMain.handle('spawn-terminal', async (event, command, args, options) => {
  return new Promise((resolve, reject) => {
    try {
      terminalProcess = spawn(command, args, options);
      
      let output = '';
      
      terminalProcess.stdout.on('data', (data) => {
        output += data.toString();
        mainWindow.webContents.send('terminal-output', data.toString());
      });
      
      terminalProcess.stderr.on('data', (data) => {
        output += data.toString();
        mainWindow.webContents.send('terminal-output', data.toString());
      });
      
      terminalProcess.on('close', (code) => {
        mainWindow.webContents.send('terminal-close', code);
        resolve({ code, output });
      });
      
      terminalProcess.on('error', (error) => {
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle('kill-terminal', async () => {
  if (terminalProcess) {
    terminalProcess.kill();
    terminalProcess = null;
  }
});

ipcMain.handle('write-to-terminal', async (event, data) => {
  if (terminalProcess && terminalProcess.stdin) {
    terminalProcess.stdin.write(data);
  }
});
