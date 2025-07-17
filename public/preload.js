import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Terminal methods
  terminalInit: (terminalId) => ipcRenderer.invoke('terminal-init', terminalId),
  terminalInput: (terminalId, data) => ipcRenderer.invoke('terminal-input', terminalId, data),
  terminalClose: (terminalId) => ipcRenderer.invoke('terminal-close', terminalId),
  onTerminalOutput: (callback) => ipcRenderer.on('terminal-output', callback),
  
  // File methods
  openFileDialog: () => ipcRenderer.send('open-file-dialog'),
  saveFile: (data) => ipcRenderer.send('save-file', data),
  saveFileDialog: (data) => ipcRenderer.send('save-file-dialog', data),
  readFile: (data) => ipcRenderer.send('read-file', data),
  onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  onFileSaved: (callback) => ipcRenderer.on('file-saved', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data)
});
