import React, { useState } from 'react';
import './FileExplorer.css';

const FileExplorer = ({ 
  files, 
  activeFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onFileDuplicate,
  getFileIcon 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim());
      setNewFileName('');
      setShowCreateDialog(false);
    }
  };

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteFile = (file) => {
    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      onFileDelete(file.id);
    }
    handleCloseContextMenu();
  };

  const handleDuplicateFile = (file) => {
    onFileDuplicate(file.id);
    handleCloseContextMenu();
  };

  // Simple flat file list - no grouping

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <div className="header-content">
          <h3>
            <span className="explorer-icon">📁</span>
            EXPLORER
          </h3>
          {files.length > 0 && (
            <span className="file-count-badge">{files.length}</span>
          )}
        </div>
        <button
          className="create-file-btn"
          onClick={() => setShowCreateDialog(true)}
          title="New File"
        >
          <span>📄</span>
        </button>
      </div>

      {showCreateDialog && (
        <div className="create-file-dialog">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter file name..."
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
            autoFocus
          />
          <div className="dialog-buttons">
            <button onClick={handleCreateFile}>Create</button>
            <button onClick={() => setShowCreateDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="files-list">
        {files.length === 0 ? (
          <div className="empty-explorer">
            <p>No files open</p>
            <p>Create a new file to get started</p>
          </div>
        ) : (
          files.map(file => (
            <div
              key={file.id}
              className={`file-item ${activeFile?.id === file.id ? 'active' : ''}`}
              onClick={() => onFileSelect(file)}
              onContextMenu={(e) => handleContextMenu(e, file)}
            >
              <span className="file-icon">{getFileIcon(file.type)}</span>
              <span className="file-name">{file.name}</span>
              {file.isModified && <span className="modified-indicator">●</span>}
            </div>
          ))
        )}
      </div>

      {contextMenu && (
        <>
          <div className="context-menu-overlay" onClick={handleCloseContextMenu} />
          <div 
            className="context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button onClick={() => handleDuplicateFile(contextMenu.file)}>
              📋 Duplicate
            </button>
            <button 
              onClick={() => handleDeleteFile(contextMenu.file)}
              className="delete-option"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileExplorer;
