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
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'type', 'modified'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Sort files based on current sort settings
  const sortedFiles = React.useMemo(() => {
    const sorted = [...files].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'modified':
          aValue = a.lastModified || 0;
          bValue = b.lastModified || 0;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [files, sortBy, sortOrder]);

  const handleCreateFile = () => {
    setIsCreatingFile(true);
    setNewFileName('');
  };

  const handleSaveNewFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim());
      setIsCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingFile(false);
    setNewFileName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveNewFile();
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  const handleDeleteFile = (e, fileId) => {
    e.stopPropagation();
    const file = files.find(f => f.id === fileId);
    if (file && window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      onFileDelete(fileId);
    }
  };

  const handleDuplicateFile = (e, fileId) => {
    e.stopPropagation();
    onFileDuplicate(fileId);
  };

  const formatLastModified = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const toggleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>Files</h3>
        <div className="file-actions">
          <button 
            onClick={handleCreateFile}
            className="action-btn create-btn"
            title="Create new file"
          >
            📄
          </button>
        </div>
      </div>

      <div className="file-sort-controls">
        <button
          onClick={() => toggleSort('name')}
          className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
          title="Sort by name"
        >
          Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => toggleSort('type')}
          className={`sort-btn ${sortBy === 'type' ? 'active' : ''}`}
          title="Sort by type"
        >
          Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => toggleSort('modified')}
          className={`sort-btn ${sortBy === 'modified' ? 'active' : ''}`}
          title="Sort by last modified"
        >
          Modified {sortBy === 'modified' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      <div className="file-list">
        {isCreatingFile && (
          <div className="file-item creating">
            <div className="file-content">
              <span className="file-icon">📄</span>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleCancelCreate}
                placeholder="filename.ext"
                className="file-name-input"
                autoFocus
              />
            </div>
          </div>
        )}
        
        {sortedFiles.map(file => (
          <div
            key={file.id}
            className={`file-item ${activeFile?.id === file.id ? 'active' : ''} ${file.isModified ? 'modified' : ''}`}
            onClick={() => onFileSelect(file)}
            title={`${file.name} - ${formatLastModified(file.lastModified)}`}
          >
            <div className="file-content">
              <span className="file-icon">{getFileIcon(file.type)}</span>
              <div className="file-info">
                <span className="file-name">
                  {file.name}
                  {file.isModified && <span className="modified-indicator">●</span>}
                </span>
                <span className="file-meta">
                  {file.type.toUpperCase()} • {formatLastModified(file.lastModified)}
                </span>
              </div>
            </div>
            <div className="file-actions">
              <button
                className="action-btn duplicate-btn"
                onClick={(e) => handleDuplicateFile(e, file.id)}
                title="Duplicate file"
              >
                📋
              </button>
              {files.length > 1 && (
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => handleDeleteFile(e, file.id)}
                  title="Delete file"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="file-explorer-footer">
        <span className="file-count">
          {files.length} file{files.length !== 1 ? 's' : ''}
          {files.filter(f => f.isModified).length > 0 && (
            <span className="modified-count">
              • {files.filter(f => f.isModified).length} modified
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default FileExplorer;
