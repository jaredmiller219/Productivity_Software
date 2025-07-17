import { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '../../../shared/hooks/useGlobalState.js';

/**
 * Custom hook for managing notes state and operations
 * @returns {Object} Notes state and operations
 */
export const useNotes = () => {
  // Use global state management for notes
  const { state, updateState } = useGlobalState('notes', {
    notes: [],
    currentNote: { id: null, title: '', content: '' }
  });

  // Extract state values
  const { notes, currentNote } = state;

  // Load notes from localStorage on mount (only if no notes in global state)
  useEffect(() => {
    if (notes.length === 0) {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          updateState({ notes: parsedNotes });
        } catch (error) {
          console.error('Failed to parse saved notes:', error);
          localStorage.removeItem('notes');
        }
      }
    }
  }, [notes.length, updateState]);

  // Save notes to localStorage
  const saveNotes = useCallback((updatedNotes) => {
    try {
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      updateState({ notes: updatedNotes });
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }, [updateState]);

  // Create a new note
  const createNewNote = useCallback(() => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    updateState({ currentNote: newNote });
    return newNote;
  }, [notes, saveNotes]);

  // Update the current note
  const updateCurrentNote = useCallback((field, value) => {
    if (!currentNote.id) return;

    const updatedNote = {
      ...currentNote,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    updateState({ currentNote: updatedNote });

    const updatedNotes = notes.map(note =>
      note.id === currentNote.id ? updatedNote : note
    );
    saveNotes(updatedNotes);
  }, [currentNote, notes, saveNotes]);

  // Delete a note
  const deleteNote = useCallback((id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    
    if (currentNote.id === id) {
      updateState({ currentNote: { id: null, title: '', content: '' } });
    }
  }, [notes, currentNote.id, saveNotes]);

  // Select a note
  const selectNote = useCallback((note) => {
    updateState({ currentNote: note });
  }, [updateState]);

  // Duplicate a note
  const duplicateNote = useCallback((id) => {
    const noteToClone = notes.find(note => note.id === id);
    if (!noteToClone) return;

    const duplicatedNote = {
      ...noteToClone,
      id: Date.now(),
      title: `${noteToClone.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedNotes = [...notes, duplicatedNote];
    saveNotes(updatedNotes);
    updateState({ currentNote: duplicatedNote });
    return duplicatedNote;
  }, [notes, saveNotes]);

  // Search notes
  const searchNotes = useCallback((query) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery)
    );
  }, [notes]);

  // Import notes
  const importNotesData = useCallback((importedNotes) => {
    if (!Array.isArray(importedNotes) || importedNotes.length === 0) {
      return;
    }

    // Merge imported notes with existing notes
    const mergedNotes = [...importedNotes, ...notes];
    saveNotes(mergedNotes);

    // Select the first imported note
    if (importedNotes.length > 0) {
      updateState({ currentNote: importedNotes[0] });
    }
  }, [notes, saveNotes, updateState]);

  // Get notes statistics
  const getNotesStats = useCallback(() => {
    return {
      total: notes.length,
      totalCharacters: notes.reduce((sum, note) => sum + note.content.length, 0),
      totalWords: notes.reduce((sum, note) => {
        const words = note.content.trim().split(/\s+/).filter(word => word.length > 0);
        return sum + words.length;
      }, 0),
      lastUpdated: notes.length > 0 ? Math.max(...notes.map(note => new Date(note.updatedAt).getTime())) : null
    };
  }, [notes]);

  return {
    // State
    notes,
    currentNote,

    // Actions
    createNewNote,
    updateCurrentNote,
    deleteNote,
    selectNote,
    duplicateNote,
    searchNotes,
    importNotesData,

    // Utilities
    getNotesStats
  };
};
