const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Terminal methods
  terminalInit: () => ipcRenderer.send('terminal-init'),
  terminalInput: (data) => ipcRenderer.send('terminal-input', data),
  terminalClose: () => ipcRenderer.send('terminal-close'),
  onTerminalOutput: (callback) => ipcRenderer.on('terminal-output', callback),
  
  // File methods
  openFileDialog: () => ipcRenderer.send('open-file-dialog'),
  saveFile: (data) => ipcRenderer.send('save-file', data),
  saveFileDialog: (data) => ipcRenderer.send('save-file-dialog', data),
  readFile: (data) => ipcRenderer.send('read-file', data),
  onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  onFileSaved: (callback) => ipcRenderer.on('file-saved', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
