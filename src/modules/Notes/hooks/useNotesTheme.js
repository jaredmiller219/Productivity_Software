import { useState, useEffect } from 'react';

// Global theme state to be shared across all Notes instances
let globalTheme = localStorage.getItem('notes-theme') || 'light';
let themeListeners = new Set();

/**
 * Custom hook for managing shared notes theme across all instances
 * @returns {Object} Theme state and toggle function
 */
export const useNotesTheme = () => {
  const [theme, setTheme] = useState(globalTheme);

  useEffect(() => {
    // Add this component to the listeners
    themeListeners.add(setTheme);

    // Cleanup: remove listener when component unmounts
    return () => {
      themeListeners.delete(setTheme);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = globalTheme === 'light' ? 'dark' : 'light';
    globalTheme = newTheme;
    localStorage.setItem('notes-theme', newTheme);
    
    // Notify all listeners (all Notes instances) about the theme change
    themeListeners.forEach(listener => {
      listener(newTheme);
    });
  };

  return {
    theme,
    toggleTheme
  };
};
