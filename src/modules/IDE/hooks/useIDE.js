import { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '../../../shared/hooks/useGlobalState.js';

/**
 * Custom hook for managing IDE state and file operations
 * @returns {Object} IDE state and operations
 */
export const useIDE = () => {
  // Load saved files from localStorage or use defaults
  const getSavedFiles = () => {
    try {
      const savedFiles = localStorage.getItem('ide-files');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        if (parsedFiles && parsedFiles.length > 0) {
          return parsedFiles;
        }
      }
    } catch (error) {
      console.error('Failed to load saved files:', error);
    }

    // Return default files if no saved files
    return [
      {
        id: 1,
        name: "index.html",
        type: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
  <p>Welcome to your new project!</p>
  <script src="script.js"></script>
</body>
</html>`,
        lastModified: Date.now(),
        isModified: false
      },
      {
        id: 2,
        name: "styles.css",
        type: "css",
        content: `/* Global Styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
  color: #333;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
}`,
        lastModified: Date.now(),
        isModified: false
      },
      {
        id: 3,
        name: "script.js",
        type: "javascript",
        content: `// Welcome to your new project!
console.log('Hello World!');

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded successfully!');
});`,
        lastModified: Date.now(),
        isModified: false
      }
    ];
  };

  // Use global state management for IDE
  const { state, updateState } = useGlobalState('ide', {
    files: getSavedFiles(),
    activeFile: null,
    editorContent: '',
    searchQuery: '',
    isSearchVisible: false
  });

  // Extract state values
  const { files, activeFile, editorContent, searchQuery, isSearchVisible } = state;



  // Save files to localStorage whenever files change
  useEffect(() => {
    if (files && files.length > 0) {
      try {
        localStorage.setItem('ide-files', JSON.stringify(files));
      } catch (error) {
        console.error('Failed to save files:', error);
      }
    }
  }, [files]);

  // Tab state management - remembers each tab's current state
  const [tabStates, setTabStates] = useState({});
  const [preserveTabStates, setPreserveTabStates] = useState(true);

  // Initialize active file
  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      updateState({ activeFile: files[0] });
    }
  }, [files, activeFile, updateState]);

  // Update editor content when active file changes (but not when just the isModified flag changes)
  useEffect(() => {
    if (activeFile) {
      updateState({ editorContent: activeFile.content });
    }
  }, [activeFile?.id, activeFile?.content, updateState]); // Only trigger on file ID or content change, not isModified

  // Get file icon based on type
  const getFileIcon = useCallback((type) => {
    const icons = {
      html: '🌐',
      css: '🎨',
      js: '⚡',
      json: '📋',
      txt: '📄',
      md: '📝',
      py: '🐍',
      java: '☕',
      cpp: '⚙️',
      c: '🔧',
      php: '🐘',
      rb: '💎',
      go: '🐹',
      rs: '🦀',
      ts: '📘',
      jsx: '⚛️',
      tsx: '⚛️',
      vue: '💚',
      xml: '📄',
      yml: '⚙️',
      yaml: '⚙️'
    };
    return icons[type] || '📄';
  }, []);

  // Get file language for syntax highlighting
  const getFileLanguage = useCallback((type) => {
    const languages = {
      // JavaScript
      js: 'javascript',
      jsx: 'javascript',
      ts: 'javascript', // Use javascript for TypeScript for now
      tsx: 'javascript',

      // Web technologies
      html: 'html',
      htm: 'html',
      css: 'css',
      scss: 'css',
      sass: 'css',
      less: 'css',

      // Data formats
      json: 'json',
      xml: 'html',
      yml: 'text',
      yaml: 'text',

      // Programming languages
      py: 'python',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      cxx: 'cpp',
      cc: 'cpp',
      h: 'c',
      hpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      csharp: 'csharp',
      rb: 'ruby',
      ruby: 'ruby',
      go: 'go',
      swift: 'swift',

      // Documentation and text
      md: 'text',
      markdown: 'text',
      txt: 'text',

      // Default fallback
      text: 'text'
    };
    return languages[type.toLowerCase()] || 'text';
  }, []);

  // Handle file selection
  const selectFile = useCallback((file) => {
    // Save current file before switching if it has changes
    if (activeFile && activeFile.isModified) {
      saveFile(activeFile.id, editorContent);
    }
    updateState({ activeFile: file });
  }, [activeFile, editorContent, updateState]);

  // Handle editor content change
  const updateEditorContent = useCallback((content) => {
    updateState({ editorContent: content });

    // Mark file as modified if content changed
    if (activeFile && content !== activeFile.content) {
      const updatedFiles = files.map(file =>
        file.id === activeFile.id
          ? { ...file, isModified: true }
          : file
      );

      const updatedActiveFile = !activeFile.isModified
        ? { ...activeFile, isModified: true }
        : activeFile;

      updateState({
        files: updatedFiles,
        activeFile: updatedActiveFile
      });
    }
  }, [activeFile, files, updateState]);

  // Save file
  const saveFile = useCallback((fileId, content) => {
    const updatedFiles = files.map(file =>
      file.id === fileId
        ? {
            ...file,
            content,
            lastModified: Date.now(),
            isModified: false
          }
        : file
    );

    const updatedActiveFile = activeFile && activeFile.id === fileId
      ? { ...activeFile, content, isModified: false }
      : activeFile;

    updateState({
      files: updatedFiles,
      activeFile: updatedActiveFile
    });
  }, [files, activeFile, updateState]);

  // Save current file
  const saveCurrentFile = useCallback(() => {
    if (activeFile) {
      saveFile(activeFile.id, editorContent);
      return true;
    }
    return false;
  }, [activeFile, editorContent, saveFile]);

  // Create new file
  const createNewFile = useCallback((fileName, content = '') => {
    if (!fileName) return null;

    // Determine file type from extension
    let fileType = 'txt';
    if (fileName.includes('.')) {
      const extension = fileName.split('.').pop().toLowerCase();
      fileType = extension;
    }

    const newFile = {
      id: Date.now(),
      name: fileName,
      type: fileType,
      content,
      lastModified: Date.now(),
      isModified: false
    };

    updateState({
      files: [...files, newFile],
      activeFile: newFile
    });
    return newFile;
  }, [files, updateState]);

  // Delete file
  const deleteFile = useCallback((fileId) => {
    if (files.length <= 1) {
      return false; // Cannot delete the last file
    }

    const updatedFiles = files.filter(file => file.id !== fileId);

    // If deleted file was active, switch to first remaining file
    const newActiveFile = activeFile && activeFile.id === fileId
      ? updatedFiles[0]
      : activeFile;

    updateState({
      files: updatedFiles,
      activeFile: newActiveFile
    });

    return true;
  }, [files, activeFile, updateState]);

  // Duplicate file
  const duplicateFile = useCallback((fileId) => {
    const fileToDuplicate = files.find(file => file.id === fileId);
    if (!fileToDuplicate) return null;

    const baseName = fileToDuplicate.name.split('.')[0];
    const extension = fileToDuplicate.name.includes('.')
      ? '.' + fileToDuplicate.name.split('.').pop()
      : '';

    let copyNumber = 1;
    let newName = `${baseName}_copy${extension}`;

    // Find unique name
    while (files.some(file => file.name === newName)) {
      copyNumber++;
      newName = `${baseName}_copy${copyNumber}${extension}`;
    }

    return createNewFile(newName, fileToDuplicate.content);
  }, [files, createNewFile]);

  // Rename file
  const renameFile = useCallback((fileId, newName) => {
    if (!newName || !newName.trim()) return false;

    const trimmedName = newName.trim();

    // Check if name already exists
    if (files.some(file => file.id !== fileId && file.name === trimmedName)) {
      alert('A file with this name already exists');
      return false;
    }

    // Determine file type from extension
    let fileType = 'txt';
    if (trimmedName.includes('.')) {
      const extension = trimmedName.split('.').pop().toLowerCase();
      fileType = extension;
    }

    const updatedFiles = files.map(file =>
      file.id === fileId
        ? { ...file, name: trimmedName, type: fileType }
        : file
    );

    const updatedActiveFile = activeFile && activeFile.id === fileId
      ? { ...activeFile, name: trimmedName, type: fileType }
      : activeFile;

    updateState({
      files: updatedFiles,
      activeFile: updatedActiveFile
    });

    return true;
  }, [files, activeFile, updateState]);

  // Revert file to last saved state
  const revertFile = useCallback(() => {
    if (!activeFile || !activeFile.isModified) {
      return false; // No file selected or no changes to revert
    }

    // Get the original saved content from localStorage
    try {
      const savedFiles = localStorage.getItem('ide-files');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        const originalFile = parsedFiles.find(f => f.id === activeFile.id);

        if (originalFile) {
          // Revert to the saved content
          updateState(prev => ({
            ...prev,
            files: prev.files.map(file =>
              file.id === activeFile.id
                ? { ...file, content: originalFile.content, isModified: false }
                : file
            ),
            editorContent: originalFile.content
          }));
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to revert file:', error);
    }

    return false;
  }, [activeFile, updateState]);

  // Search in files
  const searchInFiles = useCallback((query) => {
    if (!query.trim()) return [];
    
    const results = [];
    const lowercaseQuery = query.toLowerCase();
    
    files.forEach(file => {
      const lines = file.content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(lowercaseQuery)) {
          results.push({
            file,
            lineNumber: index + 1,
            line: line.trim(),
            preview: line.trim()
          });
        }
      });
    });
    
    return results;
  }, [files]);

  // Get project statistics
  const getProjectStats = useCallback(() => {
    const totalLines = files.reduce((sum, file) => {
      return sum + file.content.split('\n').length;
    }, 0);
    
    const totalCharacters = files.reduce((sum, file) => {
      return sum + file.content.length;
    }, 0);
    
    const fileTypes = files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {});
    
    const modifiedFiles = files.filter(file => file.isModified).length;
    
    return {
      totalFiles: files.length,
      totalLines,
      totalCharacters,
      fileTypes,
      modifiedFiles,
      lastModified: Math.max(...files.map(file => file.lastModified))
    };
  }, [files]);

  // Search functions
  const setSearchQuery = useCallback((query) => {
    updateState({ searchQuery: query });
  }, [updateState]);

  const setIsSearchVisible = useCallback((visible) => {
    updateState({ isSearchVisible: visible });
  }, [updateState]);

  return {
    // State
    files,
    activeFile,
    editorContent,
    searchQuery,
    isSearchVisible,

    // Actions
    setSearchQuery,
    setIsSearchVisible,
    selectFile,
    updateEditorContent,
    saveCurrentFile,
    createNewFile,
    deleteFile,
    duplicateFile,
    renameFile,
    revertFile,

    // Utilities
    getFileIcon,
    getFileLanguage,
    searchInFiles,
    getProjectStats
  };
};
