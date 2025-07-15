import React, { useState } from 'react';
import './FileExplorer.css';

const FileExplorer = ({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileDuplicate,
  getFileIcon,
  onSave
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [showFileActions, setShowFileActions] = useState(false);

  const fileTemplates = [
    {
      name: 'HTML5 Template',
      extension: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

</body>
</html>`
    },
    {
      name: 'CSS Stylesheet',
      extension: 'css',
      content: `/* CSS Stylesheet */

body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`
    },
    {
      name: 'JavaScript Module',
      extension: 'js',
      content: `// JavaScript Module

export default class MyClass {
    constructor() {
        this.init();
    }

    init() {
        console.log('Module initialized');
    }
}`
    },
    {
      name: 'React Component',
      extension: 'jsx',
      content: `import React from 'react';

const MyComponent = () => {
    return (
        <div>
            <h1>Hello World</h1>
        </div>
    );
};

export default MyComponent;`
    },
    {
      name: 'JSON Data',
      extension: 'json',
      content: `{
    "name": "my-project",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "node index.js"
    }
}`
    }
  ];

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

    // Always close any existing context menu first
    setContextMenu(null);

    // Small delay to ensure clean transition between menus
    setTimeout(() => {
      // Get the file element that was right-clicked
      const fileElement = e.currentTarget;
      const rect = fileElement.getBoundingClientRect();

      // Get viewport dimensions
      const viewportHeight = window.innerHeight;

      // Estimate context menu height
      const menuHeight = 80;

      // Position menu right below the file element with same width
      let x = rect.left;
      let y = rect.bottom; // No gap - right below the file
      const width = rect.width; // Same width as the file element

      // Adjust vertical position if menu would go off-screen
      if (y + menuHeight > viewportHeight) {
        y = rect.top - menuHeight; // Show above the file instead
      }

      setContextMenu({
        x,
        y,
        width,
        file
      });
    }, 10); // 10ms delay for smooth transition
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

  const handleTemplateSelect = (template) => {
    const fileName = prompt(`Enter file name for ${template.name}:`, `new-file.${template.extension}`);
    if (fileName) {
      onFileCreate(fileName, template.content);
    }
    setShowFileActions(false);
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
        <div className="header-actions">
          <button
            className="action-btn file-actions-btn"
            onClick={() => setShowFileActions(!showFileActions)}
            title="File actions"
          >
            ⚙️
          </button>
          <button
            className="create-file-btn"
            onClick={() => setShowCreateDialog(true)}
            title="New File"
          >
            <span>📄</span>
          </button>
        </div>

        {showFileActions && (
          <div className="file-actions-dropdown">
            <div className="dropdown-header">File Actions</div>
            <button
              className="dropdown-item"
              onClick={onSave}
            >
              💾 Save File
            </button>
            <div className="dropdown-separator"></div>
            <div className="dropdown-header">New File Templates</div>
            {fileTemplates.map((template, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => handleTemplateSelect(template)}
              >
                📄 {template.name}
              </button>
            ))}
          </div>
        )}
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
            style={{
              left: 10,
              top: contextMenu.y-45,
              width: contextMenu.width
            }}
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
