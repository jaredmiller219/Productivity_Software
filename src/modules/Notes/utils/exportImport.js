// Export and Import utilities for Notes

export const exportNote = (note, format = 'markdown') => {
  if (!note) return;

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}`;

  let content = '';
  let mimeType = 'text/plain';
  let extension = 'txt';

  switch (format) {
    case 'markdown':
      content = `# ${note.title}\n\n${note.content}`;
      mimeType = 'text/markdown';
      extension = 'md';
      break;
    
    case 'html':
      content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${note.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }

        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }

        .content {
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 40px;
        }

        .metadata {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }

        .metadata h3 {
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 16px;
        }

        .metadata p {
            margin: 8px 0;
        }

        .metadata strong {
            color: #2c3e50;
        }

        @media print {
            body { margin: 0; padding: 20px; }
            .metadata { background-color: transparent; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <h1>${note.title}</h1>
    <div class="content">${note.content}</div>
    <div class="metadata">
        <h3>Note Information</h3>
        <p><strong>Created:</strong> ${new Date(note.createdAt).toLocaleString()}</p>
        <p><strong>Last Modified:</strong> ${new Date(note.updatedAt || note.createdAt).toLocaleString()}</p>
        <p><strong>Character Count:</strong> ${note.content.length}</p>
        <p><strong>Word Count:</strong> ${note.content.trim().split(/\s+/).filter(word => word.length > 0).length}</p>
    </div>
</body>
</html>`;
      mimeType = 'text/html';
      extension = 'html';
      break;
    
    case 'json':
      content = JSON.stringify(note, null, 2);
      mimeType = 'application/json';
      extension = 'json';
      break;
    
    case 'text':
    default:
      content = `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}`;
      mimeType = 'text/plain';
      extension = 'txt';
      break;
  }

  // Create and download file
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAllNotes = (notes, format = 'json') => {
  if (!notes || notes.length === 0) return;

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `notes_backup_${timestamp}`;

  let content = '';
  let mimeType = 'application/json';
  let extension = 'json';

  switch (format) {
    case 'markdown':
      content = notes.map(note => `# ${note.title}\n\n${note.content}\n\n---\n`).join('\n');
      mimeType = 'text/markdown';
      extension = 'md';
      break;
    
    case 'text':
      content = notes.map(note => `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\n${'='.repeat(50)}\n`).join('\n');
      mimeType = 'text/plain';
      extension = 'txt';
      break;
    
    case 'json':
    default:
      content = JSON.stringify(notes, null, 2);
      mimeType = 'application/json';
      extension = 'json';
      break;
  }

  // Create and download file
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importNotes = (onImport) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.txt,.md,.html';
  input.multiple = false;

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let importedNotes = [];

        if (file.name.endsWith('.json')) {
          // JSON format
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            importedNotes = parsed;
          } else if (parsed.id) {
            // Single note
            importedNotes = [parsed];
          }
        } else {
          // Text/Markdown format - create a single note
          const title = file.name.replace(/\.[^/.]+$/, '') || 'Imported Note';
          const note = {
            id: Date.now().toString(),
            title: title,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          importedNotes = [note];
        }

        // Validate and clean imported notes
        const validNotes = importedNotes
          .filter(note => note && typeof note === 'object')
          .map(note => ({
            id: note.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: note.title || 'Untitled Note',
            content: note.content || '',
            createdAt: note.createdAt || new Date().toISOString(),
            updatedAt: note.updatedAt || new Date().toISOString()
          }));

        if (validNotes.length > 0) {
          onImport(validNotes);
        } else {
          alert('No valid notes found in the imported file.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import notes. Please check the file format.');
      }
    };

    reader.readAsText(file);
  };

  input.click();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateNoteData = (note) => {
  return (
    note &&
    typeof note === 'object' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string'
  );
};

export const generateNoteId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
