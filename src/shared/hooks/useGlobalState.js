import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Global state manager that preserves tab states indefinitely
 * Each module can store and retrieve its state when switching tabs
 */
class GlobalStateManager {
  constructor() {
    this.states = new Map();
    this.listeners = new Set();
    // Always enabled in production, controllable in development
    this.persistentMode = process.env.NODE_ENV === 'production' ? true : true; // Always true in production, default true in dev
    this.storageKey = 'dev-suite-global-state';

    // Load states from localStorage on initialization
    this.loadFromStorage();
  }

  // Load states from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedStates = JSON.parse(stored);
        Object.entries(parsedStates).forEach(([moduleId, state]) => {
          this.states.set(moduleId, state);
        });
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
  }

  // Save states to localStorage
  saveToStorage() {
    try {
      const statesToSave = Object.fromEntries(this.states);

      // Filter out terminal history from persistence (keep settings but not history)
      if (statesToSave.terminal && statesToSave.terminal.tabStates) {
        const filteredTerminal = {
          ...statesToSave.terminal,
          tabStates: Object.fromEntries(
            Object.entries(statesToSave.terminal.tabStates).map(([tabId, tabState]) => [
              tabId,
              {
                ...tabState,
                history: [], // Don't persist terminal history
                input: "",   // Don't persist current input
                historyIndex: -1 // Reset history index
              }
            ])
          )
        };
        statesToSave.terminal = filteredTerminal;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(statesToSave));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  // Set state for a specific module/tab
  setState(moduleId, state) {
    if (!this.persistentMode) return;

    this.states.set(moduleId, {
      ...state,
      lastUpdated: Date.now()
    });

    // Save to localStorage
    this.saveToStorage();

    // Notify listeners
    this.listeners.forEach(listener => listener(moduleId, state));
  }

  // Get state for a specific module/tab
  getState(moduleId) {
    if (!this.persistentMode) return null;
    return this.states.get(moduleId) || null;
  }

  // Check if state exists for a module
  hasState(moduleId) {
    return this.persistentMode && this.states.has(moduleId);
  }

  // Clear state for a specific module
  clearState(moduleId) {
    this.states.delete(moduleId);
    this.saveToStorage();
    this.listeners.forEach(listener => listener(moduleId, null));
  }

  // Clear all states (only allowed in development)
  clearAllStates() {
    // In production, don't allow clearing states
    if (process.env.NODE_ENV === 'production') {
      console.warn('State clearing is disabled in production builds');
      return;
    }

    this.states.clear();
    this.saveToStorage();
    this.listeners.forEach(listener => listener('*', null));
  }

  // Toggle persistent mode (only allowed in development)
  setPersistentMode(enabled) {
    // In production, always keep persistence enabled
    if (process.env.NODE_ENV === 'production') {
      console.warn('State persistence is always enabled in production builds');
      return;
    }

    this.persistentMode = enabled;
    if (!enabled) {
      this.clearAllStates();
    }
  }

  // Get persistent mode status
  isPersistentMode() {
    return this.persistentMode;
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get all states (for debugging)
  getAllStates() {
    return Object.fromEntries(this.states);
  }

  // Get state count
  getStateCount() {
    return this.states.size;
  }
}

// Global instance
const globalStateManager = new GlobalStateManager();

/**
 * Hook for using global state management
 * @param {string} moduleId - Unique identifier for the module/tab
 * @param {Object} initialState - Initial state if no saved state exists
 * @returns {Object} State management utilities
 */
export const useGlobalState = (moduleId, initialState = {}) => {
  const [localState, setLocalState] = useState(() => {
    // Try to restore saved state first
    const savedState = globalStateManager.getState(moduleId);
    if (savedState) {
      // Merge saved state with initial state to ensure all properties exist
      return { ...initialState, ...savedState };
    }
    return initialState;
  });

  const stateRef = useRef(localState);
  stateRef.current = localState;

  // Save state to global manager whenever it changes
  useEffect(() => {
    globalStateManager.setState(moduleId, localState);
  }, [moduleId, localState]);

  // Update local state when switching back to this tab
  useEffect(() => {
    const unsubscribe = globalStateManager.subscribe((changedModuleId, newState) => {
      if (changedModuleId === moduleId && newState) {
        setLocalState(newState);
      }
    });

    return unsubscribe;
  }, [moduleId]);

  const updateState = useCallback((updates) => {
    setLocalState(prev => {
      const newState = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      return newState;
    });
  }, []);

  const resetState = useCallback(() => {
    setLocalState(initialState);
    globalStateManager.clearState(moduleId);
  }, [moduleId, initialState]);

  return {
    state: localState,
    setState: setLocalState,
    updateState,
    resetState,
    hasPersistedState: globalStateManager.hasState(moduleId)
  };
};

/**
 * Hook for managing global state persistence settings
 * Only available in development mode
 */
export const useGlobalStateManager = () => {
  const [isPersistent, setIsPersistent] = useState(globalStateManager.isPersistentMode());

  const togglePersistence = useCallback(() => {
    const newMode = !isPersistent;
    globalStateManager.setPersistentMode(newMode);
    setIsPersistent(newMode);
  }, [isPersistent]);

  const clearAllStates = useCallback(() => {
    globalStateManager.clearAllStates();
  }, []);

  const getDebugInfo = useCallback(() => {
    return {
      isPersistent,
      stateCount: globalStateManager.getStateCount(),
      allStates: globalStateManager.getAllStates()
    };
  }, [isPersistent]);

  return {
    isPersistent,
    togglePersistence,
    clearAllStates,
    getDebugInfo,
    isDebugMode: process.env.NODE_ENV === 'development'
  };
};

export default globalStateManager;
