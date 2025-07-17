import React, { useState, useEffect, useRef } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer.js";
import CodeEditor from "./components/CodeEditor/CodeEditor.js";
import IDEToolbar from "./components/IDEToolbar/IDEToolbar.js";
import SearchPanel from "./components/SearchPanel/SearchPanel.js";
import IDESettings, { DEFAULT_IDE_SETTINGS } from "./components/IDESettings/IDESettings.js";
import { useIDE } from "./hooks/useIDE.js";
import { useGlobalState } from "../../shared/hooks/useGlobalState.js";
import "./IDE.css";

function IDE() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const explorerContainerRef = useRef(null);

  // IDE Settings state
  const { state: ideSettingsState, updateState: updateIdeSettings } = useGlobalState('ide-settings', DEFAULT_IDE_SETTINGS);
  const ideSettings = ideSettingsState;

  // Undo/Redo state
  const [undoRedoCallbacks, setUndoRedoCallbacks] = useState({
    onUndo: null,
    onRedo: null,
    canUndo: false,
    canRedo: false
  });

  // Initialize CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--explorer-width', `${explorerWidth}px`);
  }, [explorerWidth]);

  // Apply IDE settings to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--ide-cursor-color', ideSettings.cursorColor);
  }, [ideSettings.cursorColor]);
  
  const {
    files,
    activeFile,
    editorContent,
    selectFile,
    updateEditorContent,
    saveCurrentFile,
    createNewFile,
    deleteFile,
    duplicateFile,
    renameFile,
    revertFile,
    getFileIcon,
    getFileLanguage,
    searchInFiles,
    getProjectStats
  } = useIDE();

  const handleToggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleSettingsChange = (newSettings) => {
    updateIdeSettings(newSettings);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Cmd+S (Mac) or Ctrl+S (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        if (activeFile) {
          saveCurrentFile();
          console.log('File saved via keyboard shortcut');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeFile, saveCurrentFile]);

  const handleNewFile = (fileName, content = '') => {
    createNewFile(fileName, content);
  };

  const handleSave = () => {
    const success = saveCurrentFile();
    if (success) {
      console.log('File saved successfully');
    }
  };

  // Handle resize functionality
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e) => {
      const newWidth = e.clientX;
      const minWidth = 200;
      const maxWidth = 600;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      // Update CSS variable directly - much faster than React state
      document.documentElement.style.setProperty('--explorer-width', `${clampedWidth}px`);
    };

    const handleMouseUp = () => {
      const finalWidth = parseInt(document.documentElement.style.getPropertyValue('--explorer-width')) || 280;
      setExplorerWidth(finalWidth);
      setIsResizing(false);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="ide-container">
      <IDEToolbar
        onNewFile={handleNewFile}
        onSave={handleSave}
        onSearch={searchInFiles}
        onToggleSearch={handleToggleSearch}
        isSearchVisible={isSearchVisible}
        activeFile={activeFile}
        onShowSettings={handleShowSettings}
      />
      
      <div className="ide-main">
        <div
          ref={explorerContainerRef}
          style={{
            width: isResizing ? 'var(--explorer-width, 280px)' : `${explorerWidth}px`,
            minWidth: '200px',
            maxWidth: '600px'
          }}
        >
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onFileSelect={selectFile}
            onFileCreate={createNewFile}
            onFileDelete={deleteFile}
            onFileDuplicate={duplicateFile}
            onFileRename={renameFile}
            getFileIcon={getFileIcon}
            onSave={handleSave}
          />
        </div>

        <div
          className="ide-resize-handle"
          onMouseDown={handleResizeStart}
        />

        <div className="ide-editor-container">
          {activeFile ? (
            <CodeEditor
              content={editorContent}
              onChange={updateEditorContent}
              language={getFileLanguage(activeFile.type)}
              fileName={activeFile.name}
              isModified={activeFile.isModified}
              onSave={handleSave}
              onRevert={revertFile}
              onRename={(newName) => renameFile(activeFile.id, newName)}
              projectStats={getProjectStats()}
            />
          ) : (
            <div className="no-file-selected">
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No file selected</h3>
                <p>Select a file from the explorer or create a new one to start coding.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completely separate overlay layer */}
      {isSearchVisible && (
        <div className="search-overlay">
          <SearchPanel
            isVisible={isSearchVisible}
            onClose={() => setIsSearchVisible(false)}
            onSearch={searchInFiles}
            onFileSelect={selectFile}
            getFileIcon={getFileIcon}
          />
        </div>
      )}

      {/* IDE Settings Modal */}
      <IDESettings
        isVisible={showSettings}
        onClose={handleCloseSettings}
        settings={ideSettings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default IDE;
