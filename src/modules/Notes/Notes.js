import React, { useState, useEffect } from 'react';
import './Notes.css';

function Notes({ isRightPanel = false }) {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (updatedNotes) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: ''
    };
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    setCurrentNote(newNote);
  };

  const updateCurrentNote = (field, value) => {
    const updatedNote = { ...currentNote, [field]: value };
    setCurrentNote(updatedNote);

    const updatedNotes = notes.map(note =>
      note.id === currentNote.id ? updatedNote : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    if (currentNote.id === id) {
      setCurrentNote({ id: null, title: '', content: '' });
    }
  };

  return (
    <div className={`notes-container ${isRightPanel ? 'right-panel-mode' : ''}`}>
      <div className="notes-sidebar">
        <div className="notes-header">
          <h3>My Notes</h3>
          <button onClick={createNewNote}>+ New</button>
        </div>
        <div className="notes-list">
          {notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${currentNote.id === note.id ? 'active' : ''}`}
              onClick={() => setCurrentNote(note)}
            >
              <div className="note-title">{note.title}</div>
              <button
                className="delete-note"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      {(!isRightPanel || currentNote.id) && (
        <div className="note-editor">
          {currentNote.id ? (
            <>
              <input
                type="text"
                className="note-title-input"
                value={currentNote.title}
                onChange={(e) => updateCurrentNote('title', e.target.value)}
              />
              <textarea
                className="note-content"
                value={currentNote.content}
                onChange={(e) => updateCurrentNote('content', e.target.value)}
                placeholder="Start typing your note..."
              />
            </>
          ) : (
            <div className="empty-state">
              <p>Select a note or create a new one</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notes;
