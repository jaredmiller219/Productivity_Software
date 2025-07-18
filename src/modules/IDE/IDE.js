import React, { useState, useEffect, useRef } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer.js";
import CodeEditor from "./components/CodeEditor/CodeEditor.js";
import IDEMenuBar from "./components/IDEMenuBar/IDEMenuBar.js";
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



  // Initialize CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--explorer-width', `${explorerWidth}px`);
  }, [explorerWidth]);

  // Apply IDE settings to CSS variables and editor
  useEffect(() => {
    const root = document.documentElement;

    // Cursor settings
    root.style.setProperty('--ide-cursor-color', ideSettings.cursorColor);
    root.style.setProperty('--ide-cursor-style', ideSettings.cursorStyle);
    root.style.setProperty('--ide-cursor-blinking', ideSettings.cursorBlinking);

    // Font settings
    root.style.setProperty('--ide-font-size', `${ideSettings.fontSize}px`);
    root.style.setProperty('--ide-font-family', ideSettings.fontFamily);
    root.style.setProperty('--ide-font-weight', ideSettings.fontWeight);
    root.style.setProperty('--ide-line-height', ideSettings.lineHeight);
    root.style.setProperty('--ide-letter-spacing', `${ideSettings.letterSpacing}px`);

    // Editor behavior
    root.style.setProperty('--ide-tab-size', ideSettings.tabSize);
    root.style.setProperty('--ide-word-wrap', ideSettings.wordWrap);
    root.style.setProperty('--ide-line-numbers', ideSettings.lineNumbers);

    // Theme and colors
    root.style.setProperty('--ide-theme', ideSettings.theme);
    root.style.setProperty('--ide-color-scheme', ideSettings.colorScheme);

    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${ideSettings.theme}`);

  }, [ideSettings]);
  
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

  // Menu bar handlers
  const handleNewFile = () => {
    createNewFile();
  };

  const handleOpenFile = () => {
    // TODO: Implement file picker
    console.log('Open file dialog');
  };

  const handleSaveAsFile = () => {
    // TODO: Implement save as dialog
    console.log('Save as dialog');
  };

  const handleCloseFile = () => {
    if (activeFile) {
      // TODO: Check for unsaved changes
      selectFile(null);
    }
  };

  const handleUndo = () => {
    document.execCommand('undo');
  };

  const handleRedo = () => {
    document.execCommand('redo');
  };

  const handleCut = () => {
    document.execCommand('cut');
  };

  const handleCopy = () => {
    document.execCommand('copy');
  };

  const handlePaste = () => {
    document.execCommand('paste');
  };

  const handleFind = () => {
    // TODO: Implement find in current file
    console.log('Find in current file');
  };

  const handleReplace = () => {
    // TODO: Implement replace in current file
    console.log('Replace in current file');
  };

  const handleToggleFileExplorer = () => {
    setIsFileExplorerVisible(!isFileExplorerVisible);
  };

  const handleToggleTerminal = () => {
    // TODO: Implement terminal toggle
    console.log('Toggle terminal');
  };

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleRunCode = () => {
    // TODO: Implement code execution
    console.log('Run code');
  };

  const handleDebugCode = () => {
    // TODO: Implement debugging
    console.log('Debug code');
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

  const handleSaveFile = () => {
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
      <IDEMenuBar
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
        onSaveAsFile={handleSaveAsFile}
        onCloseFile={handleCloseFile}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onFind={handleFind}
        onReplace={handleReplace}
        onRevert={revertFile}
        onSearch={searchInFiles}
        onToggleSearch={handleToggleSearch}
        onToggleFileExplorer={handleToggleFileExplorer}
        onToggleTerminal={handleToggleTerminal}
        onToggleFullscreen={handleToggleFullscreen}
        onShowSettings={handleShowSettings}
        onRunCode={handleRunCode}
        onDebugCode={handleDebugCode}
        activeFile={activeFile}
        projectStats={getProjectStats()}
        theme={ideSettings.theme}
        isSearchVisible={isSearchVisible}
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
            onSave={handleSaveFile}
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
              onSave={handleSaveFile}
              onRevert={revertFile}
              onRename={(newName) => renameFile(activeFile.id, newName)}
              projectStats={getProjectStats()}
              settings={ideSettings}
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
