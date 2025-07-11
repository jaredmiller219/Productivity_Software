import React, { useEffect } from 'react';
import NotesList from './components/NotesList.js';
import NoteEditor from './components/NoteEditor.js';
import { useNotes } from './hooks/useNotes.js';
import './Notes.css';

function Notes({ isRightPanel = false, onNotesCountChange }) {
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
    <div className={`notes-container ${isRightPanel ? 'right-panel-mode' : ''}`}>
      <div className="notes-sidebar">
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
