import React, { useState } from 'react';
import './IDEToolbar.css';

const IDEToolbar = ({
  onNewFile,
  onSave,
  onSearch,
  onToggleSearch,
  isSearchVisible,
  projectStats,
  activeFile
}) => {
  const [showStats, setShowStats] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const fileTemplates = [
    { name: 'HTML5 Template', extension: 'html', content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>` },
    { name: 'CSS Stylesheet', extension: 'css', content: `/* Stylesheet */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}` },
    { name: 'JavaScript Module', extension: 'js', content: `// JavaScript Module
'use strict';

// Your code here
console.log('Module loaded');` },
    { name: 'React Component', extension: 'jsx', content: `import React from 'react';

const Component = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default Component;` },
    { name: 'JSON Data', extension: 'json', content: `{
  "name": "example",
  "version": "1.0.0",
  "description": ""
}` },
    { name: 'Markdown Document', extension: 'md', content: `# Document Title

## Introduction

Your content here...` }
  ];

  const handleNewFile = () => {
    const fileName = prompt('Enter file name (with extension):');
    if (fileName) {
      onNewFile(fileName);
    }
  };

  const handleTemplateSelect = (template) => {
    const fileName = prompt(`Enter file name for ${template.name}:`, `new-file.${template.extension}`);
    if (fileName) {
      onNewFile(fileName, template.content);
    }
    setShowTemplates(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatLastModified = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="ide-toolbar">
      <div className="toolbar-section">
        <div className="file-actions">
          <div className="dropdown">
            <button 
              className="toolbar-btn primary"
              onClick={() => setShowTemplates(!showTemplates)}
              title="Create new file from template"
            >
              📄 New
            </button>
            {showTemplates && (
              <div className="dropdown-menu">
                <div className="dropdown-header">File Templates</div>
                {fileTemplates.map((template, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <span className="template-name">{template.name}</span>
                    <span className="template-ext">.{template.extension}</span>
                  </button>
                ))}
                <div className="dropdown-separator"></div>
                <button
                  className="dropdown-item"
                  onClick={handleNewFile}
                >
                  <span className="template-name">Empty File</span>
                  <span className="template-ext">custom</span>
                </button>
              </div>
            )}
          </div>

          <button 
            className="toolbar-btn"
            onClick={onSave}
            title="Save current file (Ctrl+S)"
          >
            💾 Save
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="search-actions">
          <button 
            className={`toolbar-btn ${isSearchVisible ? 'active' : ''}`}
            onClick={onToggleSearch}
            title="Toggle search in files"
          >
            🔍 Search
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="project-info">
          {activeFile && (
            <div className="active-file-info">
              <span className="file-indicator">📄</span>
              <span className="file-name">{activeFile.name}</span>
              {activeFile.isModified && <span className="modified-dot">●</span>}
            </div>
          )}
          
          <div className="dropdown">
            <button 
              className="toolbar-btn stats-btn"
              onClick={() => setShowStats(!showStats)}
              title="Project statistics"
            >
              📊 Stats
            </button>
            {showStats && (
              <div className="dropdown-menu stats-menu">
                <div className="dropdown-header">Project Statistics</div>
                <div className="stat-item">
                  <span className="stat-label">Files:</span>
                  <span className="stat-value">{projectStats.totalFiles}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lines:</span>
                  <span className="stat-value">{projectStats.totalLines.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Characters:</span>
                  <span className="stat-value">{projectStats.totalCharacters.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Size:</span>
                  <span className="stat-value">{formatFileSize(projectStats.totalCharacters)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Modified:</span>
                  <span className="stat-value">{projectStats.modifiedFiles}</span>
                </div>
                <div className="dropdown-separator"></div>
                <div className="stat-item">
                  <span className="stat-label">Last Modified:</span>
                  <span className="stat-value small">{formatLastModified(projectStats.lastModified)}</span>
                </div>
                <div className="dropdown-header">File Types</div>
                {Object.entries(projectStats.fileTypes).map(([type, count]) => (
                  <div key={type} className="stat-item">
                    <span className="stat-label">{type.toUpperCase()}:</span>
                    <span className="stat-value">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDEToolbar;
