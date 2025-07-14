import React, { useEffect } from 'react';
import NotesList from './components/NotesList.js';
import NoteEditor from './components/NoteEditor.js';
import { useNotes } from './hooks/useNotes.js';
import { useNotesTheme } from './hooks/useNotesTheme.js';
import './Notes.css';

function Notes({ isRightPanel = false, onNotesCountChange }) {
  const { theme, toggleTheme } = useNotesTheme();

  const {
    notes,
    currentNote,
    createNewNote,
    updateCurrentNote,
    deleteNote,
    selectNote,
    duplicateNote
  } = useNotes();

  // Report notes count to parent component
  useEffect(() => {
    if (onNotesCountChange) {
      onNotesCountChange(notes.length);
    }
  }, [notes.length, onNotesCountChange]);

  return (
    <div className={`notes-container ${isRightPanel ? 'right-panel-mode' : ''} theme-${theme}`}>
      <div className="notes-sidebar">
        <div className="notes-header">
          <h3>Notes</h3>
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <NotesList
          notes={notes}
          currentNote={currentNote}
          onSelectNote={selectNote}
          onDeleteNote={deleteNote}
          onDuplicateNote={duplicateNote}
          onCreateNote={createNewNote}
        />
      </div>
      {(!isRightPanel || currentNote.id) && (
        <div className="note-editor-container">
          <NoteEditor
            currentNote={currentNote}
            onUpdateNote={updateCurrentNote}
            isRightPanel={isRightPanel}
          />
        </div>
      )}
    </div>
  );
}

export default Notes;
