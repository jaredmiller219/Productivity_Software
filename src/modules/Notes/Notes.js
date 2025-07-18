import React, { useEffect, useState } from 'react';
import NotesList from './components/list/NotesList.js';
import NoteEditor from './components/editor/NoteEditor.js';
import NotesMenuBar from './components/ui/NotesMenuBar.js';
import NotesSettings from './components/ui/NotesSettings.js';
import { useNotes } from './hooks/useNotes.js';
import { useNotesTheme } from './hooks/useNotesTheme.js';
import { exportNote, exportAllNotes, importNotes } from './utils/exportImport.js';
import './styles/Notes.css';

function Notes({ isRightPanel = false, onNotesCountChange }) {
  const { theme, toggleTheme } = useNotesTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    autoSave: true,
    spellCheck: false,
    fontSize: 'medium',
    fontFamily: 'system',
    defaultTheme: 'light',
    showLineNumbers: false,
    wordWrap: true,
    defaultSort: 'updatedAt',
    confirmDelete: true,
    searchInContent: true,
    exportFormat: 'markdown',
    includeMetadata: false
  });

  const {
    notes,
    currentNote,
    createNewNote,
    updateCurrentNote,
    deleteNote,
    selectNote,
    duplicateNote,
    importNotesData
  } = useNotes();

  // Report notes count to parent component
  useEffect(() => {
    if (onNotesCountChange) {
      onNotesCountChange(notes.length);
    }
  }, [notes.length, onNotesCountChange]);

  // Menu bar handlers
  const handleExportNote = (note) => {
    exportNote(note || currentNote, settings.exportFormat);
  };

  const handleImportNotes = () => {
    importNotes((importedNotes) => {
      if (importNotesData) {
        importNotesData(importedNotes);
      }
    });
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Apply theme setting if changed
    if (newSettings.defaultTheme !== settings.defaultTheme) {
      // Could implement auto theme switching here
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            createNewNote();
            break;
          case 'd':
            e.preventDefault();
            if (currentNote?.id) {
              duplicateNote(currentNote.id);
            }
            break;
          case 'e':
            e.preventDefault();
            if (currentNote?.id) {
              handleExportNote(currentNote);
            }
            break;
          case 'o':
            e.preventDefault();
            handleImportNotes();
            break;
          case 't':
            e.preventDefault();
            toggleTheme();
            break;
          case 'f':
            if (e.shiftKey) {
              e.preventDefault();
              handleShowSearch();
            }
            break;
          case ',':
            e.preventDefault();
            handleShowSettings();
            break;
        }
      } else if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'Delete' && currentNote?.id) {
        // Only if not in an input field
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          if (settings.confirmDelete) {
            if (window.confirm('Are you sure you want to delete this note?')) {
              deleteNote(currentNote.id);
            }
          } else {
            deleteNote(currentNote.id);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentNote, settings, createNewNote, duplicateNote, deleteNote, toggleTheme]);

  return (
    <div className={`notes-container ${isRightPanel ? 'right-panel-mode' : ''} theme-${theme}`}>
      {/* Menu Bar */}
      {!isRightPanel && (
        <NotesMenuBar
          onCreateNote={createNewNote}
          onDeleteNote={deleteNote}
          onDuplicateNote={duplicateNote}
          onExportNote={handleExportNote}
          onImportNotes={handleImportNotes}
          onToggleTheme={toggleTheme}
          onShowSearch={handleShowSearch}
          onShowSettings={handleShowSettings}
          onToggleFullscreen={handleToggleFullscreen}
          currentNote={currentNote}
          notesCount={notes.length}
          theme={theme}
        />
      )}

      <div className="notes-content">
        <div className="notes-sidebar">
          {/* <div className="notes-header">
            <h3>Notes</h3>
          </div> */}
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

      {/* Settings Modal */}
      <NotesSettings
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default Notes;
