import React, { useState, useEffect } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer.js";
import CodeEditor from "./components/CodeEditor/CodeEditor.js";
import IDEToolbar from "./components/IDEToolbar/IDEToolbar.js";
import SearchPanel from "./components/SearchPanel/SearchPanel.js";
import { useIDE } from "./hooks/useIDE.js";
import "./IDE.css";

function IDE() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
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
    getFileIcon,
    getFileLanguage,
    searchInFiles,
    getProjectStats
  } = useIDE();

  const handleToggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
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

  return (
    <div className="ide-container">
      <IDEToolbar
        onNewFile={handleNewFile}
        onSave={handleSave}
        onSearch={searchInFiles}
        onToggleSearch={handleToggleSearch}
        isSearchVisible={isSearchVisible}
        activeFile={activeFile}
      />
      
      <div className="ide-main">
        <FileExplorer
          files={files}
          activeFile={activeFile}
          onFileSelect={selectFile}
          onFileCreate={createNewFile}
          onFileDelete={deleteFile}
          onFileDuplicate={duplicateFile}
          getFileIcon={getFileIcon}
          onSave={handleSave}
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
    </div>
  );
}

export default IDE;
