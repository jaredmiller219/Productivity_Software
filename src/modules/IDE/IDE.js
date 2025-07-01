import React, { useState, useEffect } from 'react';
import './IDE.css';

function IDE() {
  const [files, setFiles] = useState([
    { id: 1, name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Project</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
    { id: 2, name: 'styles.css', type: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}' },
    { id: 3, name: 'script.js', type: 'js', content: 'document.addEventListener("DOMContentLoaded", function() {\n  console.log("Page loaded!");\n});' }
  ]);

  const [activeFile, setActiveFile] = useState(files[0]);
  const [editorContent, setEditorContent] = useState(files[0].content);

  useEffect(() => {
    // Update editor content when active file changes
    if (activeFile) {
      setEditorContent(activeFile.content);
    }
  }, [activeFile]);

  const handleFileSelect = (file) => {
    // Save current file before switching
    if (activeFile) {
      saveFile(activeFile.id, editorContent);
    }
    setActiveFile(file);
  };

  const handleEditorChange = (e) => {
    setEditorContent(e.target.value);
  };

  const saveFile = (fileId, content) => {
    const updatedFiles = files.map(file =>
      file.id === fileId ? { ...file, content } : file
    );
    setFiles(updatedFiles);
  };

  const handleSave = () => {
    saveFile(activeFile.id, editorContent);
    alert(`File ${activeFile.name} saved!`);
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    let fileType = 'txt';
    if (fileName.includes('.')) {
      const extension = fileName.split('.').pop().toLowerCase();
      if (['html', 'css', 'js', 'json', 'txt'].includes(extension)) {
        fileType = extension;
      }
    }

    const newFile = {
      id: Date.now(),
      name: fileName,
      type: fileType,
      content: ''
    };

    setFiles([...files, newFile]);
    setActiveFile(newFile);
  };

  const deleteFile = (fileId) => {
    if (files.length <= 1) {
      alert('Cannot delete the last file');
      return;
    }

    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);

    if (activeFile.id === fileId) {
      setActiveFile(updatedFiles[0]);
    }
  };

  return (
    <div className="ide-container">
      <div className="ide-sidebar">
        <div className="ide-sidebar-header">
          <h3>Files</h3>
          <button onClick={createNewFile} className="new-file-btn">+</button>
        </div>
        <div className="file-list">
          {files.map(file => (
            <div
              key={file.id}
              className={`file-item ${activeFile.id === file.id ? 'active' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              <span className="file-name">{file.name}</span>
              <button
                className="delete-file"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(file.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="ide-editor">
        <div className="editor-toolbar">
          <span className="active-file-name">{activeFile ? activeFile.name : 'No file selected'}</span>
          <button onClick={handleSave} className="save-btn">Save</button>
        </div>
        <textarea
          className="code-editor"
          value={editorContent}
          onChange={handleEditorChange}
          spellCheck="false"
        ></textarea>
      </div>
    </div>
  );
}

export default IDE;
