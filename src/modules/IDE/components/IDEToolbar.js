import React, { useState, useRef } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

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

  const handleSearch = (query, openPanel = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (onSearch) {
      const results = onSearch(query);
      setSearchResults(results);
      setShowSearchResults(results.length > 0 && !openPanel);

      // Only open the search panel if explicitly requested
      if (openPanel && results.length > 0 && onToggleSearch && !isSearchVisible) {
        onToggleSearch();
      }
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounced search - search as user types (with a small delay)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      handleSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleToggleSearchPanel = () => {
    if (onToggleSearch) {
      // Always toggle the search panel regardless of current state
      onToggleSearch();

      // If we're opening the panel and have a search query, perform the search
      if (!isSearchVisible && searchQuery.trim()) {
        handleSearch(searchQuery, true);
      }

      // Hide dropdown when opening the panel
      if (!isSearchVisible) {
        setShowSearchResults(false);
      }
    }
  };

  const handleResultClick = (result) => {
    // Hide the dropdown
    setShowSearchResults(false);

    // You could add logic here to jump to the specific line in the file
    // For now, we'll just open the search panel with the current query
    handleSearch(searchQuery, true);
  };

  return (
    <div className="ide-toolbar">
      {/* Empty left section for spacing */}
      <div className="toolbar-section toolbar-left">
      </div>

      {/* Search bar in the center */}
      <div className="toolbar-section toolbar-center">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search files, functions, variables..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              className={`search-panel-toggle ${isSearchVisible ? 'active' : ''}`}
              onClick={handleToggleSearchPanel}
              title={isSearchVisible ? "Close search panel" : "Open detailed search panel"}
            >
              📋
            </button>
            {searchQuery && (
              <button
                className="search-clear"
                onClick={handleClearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              <div className="search-results-header">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
              {searchResults.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="search-result-file">{result.file.name}</div>
                  <div className="search-result-line">Line {result.lineNumber}: {result.preview}</div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div className="search-results-more">
                  +{searchResults.length - 5} more results...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Small buttons on the right */}
      <div className="toolbar-section toolbar-right">
        <div className="right-controls">
          {activeFile && (
            <div className="active-file-compact">
              <span className="file-name-compact" title={activeFile.name}>
                {activeFile.name}
                {activeFile.isModified && <span className="modified-dot">●</span>}
              </span>
            </div>
          )}

          <div className="dropdown">
            <button
              className="toolbar-btn-small stats-btn"
              onClick={() => setShowStats(!showStats)}
              title="Project statistics"
            >
              📊
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

          <div className="dropdown">
            <button
              className="toolbar-btn-small primary"
              onClick={() => setShowTemplates(!showTemplates)}
              title="File actions"
            >
              📄
            </button>
            {showTemplates && (
              <div className="dropdown-menu">
                <div className="dropdown-header">File Actions</div>
                <button
                  className="dropdown-item"
                  onClick={onSave}
                >
                  <span className="template-name">💾 Save File</span>
                  <span className="template-ext">Ctrl+S</span>
                </button>
                <div className="dropdown-separator"></div>
                <div className="dropdown-header">New File Templates</div>
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
        </div>
      </div>


    </div>
  );
};

export default IDEToolbar;
