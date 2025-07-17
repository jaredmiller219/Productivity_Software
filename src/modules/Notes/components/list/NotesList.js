import React, { useState } from 'react';
import './NotesList.css';

const NotesList = ({ 
  notes, 
  currentNote, 
  onSelectNote, 
  onDeleteNote, 
  onDuplicateNote, 
  onCreateNote 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt'); // 'updatedAt', 'createdAt', 'title'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Filter and sort notes
  const filteredAndSortedNotes = React.useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt || a.createdAt || 0).getTime();
          bValue = new Date(b.updatedAt || b.createdAt || 0).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [notes, searchQuery, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreview = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div className="notes-list-container">
      <div className="notes-header">
        <h3>My Notes ({notes.length === 1 ? '1 note' : `${notes.length} notes`})</h3>
        <button className="create-note-btn" onClick={onCreateNote} title="Create new note">
          📝 New
        </button>
      </div>

      <div className="notes-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="notes-list">
        {filteredAndSortedNotes.length === 0 ? (
          <div className="empty-notes">
            {searchQuery ? (
              <p>No notes found matching "{searchQuery}"</p>
            ) : (
              <p>No notes yet. Create your first note!</p>
            )}
          </div>
        ) : (
          filteredAndSortedNotes.map(note => (
            <div
              key={note.id}
              className={`note-item ${currentNote.id === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note)}
            >
              <div className="note-item-content">
                <div className="note-title">{note.title}</div>
                <div className="note-preview">{getPreview(note.content)}</div>
                <div className="note-meta">
                  <span className="note-date">{formatDate(note.updatedAt || note.createdAt)}</span>
                  <span className="note-length">{note.content.length} chars</span>
                </div>
              </div>
              <div className="note-actions">
                <button
                  className="duplicate-note-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateNote(note.id);
                  }}
                  title="Duplicate note"
                >
                  📋
                </button>
                <button
                  className="delete-note-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this note?')) {
                      onDeleteNote(note.id);
                    }
                  }}
                  title="Delete note"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
