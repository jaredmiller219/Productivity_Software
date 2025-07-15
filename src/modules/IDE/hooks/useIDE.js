import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing IDE state and file operations
 * @returns {Object} IDE state and operations
 */
export const useIDE = () => {
  const [files, setFiles] = useState([
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
  line-height: 1.6;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

p {
  color: #666;
  text-align: center;
  font-size: 16px;
}`,
      lastModified: Date.now(),
      isModified: false
    },
    {
      id: 3,
      name: "script.js",
      type: "js",
      content: `// Main application script
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded successfully!');
  
  // Add some interactivity
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', function() {
      this.style.color = this.style.color === 'blue' ? '#333' : 'blue';
    });
  }
});`,
      lastModified: Date.now(),
      isModified: false
    },
  ]);

  const [activeFile, setActiveFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Initialize active file
  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      setActiveFile(files[0]);
    }
  }, [files, activeFile]);

  // Update editor content when active file changes (but not when just the isModified flag changes)
  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
    }
  }, [activeFile?.id, activeFile?.content]); // Only trigger on file ID or content change, not isModified

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
      html: 'html',
      css: 'css',
      js: 'javascript',
      json: 'json',
      txt: 'text',
      md: 'markdown',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      vue: 'vue',
      xml: 'xml',
      yml: 'yaml',
      yaml: 'yaml'
    };
    return languages[type] || 'text';
  }, []);

  // Handle file selection
  const selectFile = useCallback((file) => {
    // Save current file before switching if it has changes
    if (activeFile && activeFile.isModified) {
      saveFile(activeFile.id, editorContent);
    }
    setActiveFile(file);
  }, [activeFile, editorContent]);

  // Handle editor content change
  const updateEditorContent = useCallback((content) => {
    setEditorContent(content);

    // Mark file as modified if content changed
    if (activeFile && content !== activeFile.content) {
      const updatedFiles = files.map(file =>
        file.id === activeFile.id
          ? { ...file, isModified: true }
          : file
      );
      setFiles(updatedFiles);

      // Only update activeFile if it's not already marked as modified
      if (!activeFile.isModified) {
        setActiveFile(prev => ({ ...prev, isModified: true }));
      }
    }
  }, [activeFile, files]);

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
    setFiles(updatedFiles);
    
    if (activeFile && activeFile.id === fileId) {
      setActiveFile(prev => ({ ...prev, content, isModified: false }));
    }
  }, [files, activeFile]);

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

    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile);
    return newFile;
  }, []);

  // Delete file
  const deleteFile = useCallback((fileId) => {
    if (files.length <= 1) {
      return false; // Cannot delete the last file
    }

    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);

    // If deleted file was active, switch to first remaining file
    if (activeFile && activeFile.id === fileId) {
      setActiveFile(updatedFiles[0]);
    }
    
    return true;
  }, [files, activeFile]);

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
    
    // Utilities
    getFileIcon,
    getFileLanguage,
    searchInFiles,
    getProjectStats
  };
};
