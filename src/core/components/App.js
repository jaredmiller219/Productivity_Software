import React, { useState, useEffect } from "react";
import Sidebar from "../../shared/components/Sidebar.js";
import Workspace from "../../shared/components/Workspace.js";
import Notes from "../../modules/Notes/Notes.js";
import { useGlobalStateManager, useGlobalState } from "../../shared/hooks/useGlobalState.js";
import "./App.css";

function App() {
  const [activeModule, setActiveModule] = useState("notes");
  const [notesPosition, setNotesPosition] = useState("main"); // "main", "right", "hidden"
  const [notesPanelWidth, setNotesPanelWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const [notesCount, setNotesCount] = useState(0);

  // Global state management for debug mode
  const { isPersistent, togglePersistence, clearAllStates, getDebugInfo, isDebugMode } = useGlobalStateManager();
  const [showStateDialog, setShowStateDialog] = useState(false);



  const handleNotesPositionChange = (position) => {
    setNotesPosition(position);
    if (position === "right" && activeModule === "notes") {
      // If notes are moved to the right panel and currently active, switch to modeling
      setActiveModule("modeling");
    }
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 250 && newWidth <= 600) {
      setNotesPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleStateToggle = () => {
    setShowStateDialog(true);
  };

  // Option box pattern handlers - use global state to remember checkbox states
  const { state: dialogState, updateState: updateDialogState } = useGlobalState('dialog-options', {
    optionTogglePersistence: true,
    optionClearStates: false
  });

  const { optionTogglePersistence, optionClearStates } = dialogState;
  const setOptionTogglePersistence = (value) => updateDialogState({ optionTogglePersistence: value });
  const setOptionClearStates = (value) => updateDialogState({ optionClearStates: value });

  // Prevent Cmd+R from refreshing the page (only in production)
  useEffect(() => {
    // Only prevent refresh in production builds
    if (process.env.NODE_ENV === 'production') {
      const handleKeyDown = (event) => {
        // Check for Cmd+R (Mac) or Ctrl+R (Windows/Linux)
        if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
          event.preventDefault();
          console.log('Page refresh prevented. Use menu bar to refresh.');
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleOptionBoxApply = () => {
    if (optionTogglePersistence) {
      if (optionClearStates) {
        clearAllStates();
      }
      togglePersistence();
    }
    setShowStateDialog(false);
    // Keep checkbox states for next time - don't reset
  };

  const handleOptionBoxCancel = () => {
    setShowStateDialog(false);
    // Keep checkbox states for next time - don't reset
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div className="App">
      <div className="app-container">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          notesPosition={notesPosition}
          onNotesPositionChange={handleNotesPositionChange}
          notesCount={notesCount}
          isPersistent={isPersistent}
          onStateToggle={handleStateToggle}
          isDebugMode={isDebugMode}
        />

        <div className="main-content">
          <Workspace
            activeModule={activeModule}
            showNotes={notesPosition === "main"}
            onNotesCountChange={setNotesCount}
          />

          {notesPosition === "right" && (
            <div
              className="notes-panel-right"
              style={{ width: notesPanelWidth }}
            >
              <div
                className="resize-handle"
                onMouseDown={handleMouseDown}
              />
              <div className="notes-panel-header">
                <h3>Notes</h3>
                <div className="notes-panel-controls">
                  <button
                    onClick={() => handleNotesPositionChange("main")}
                    title="Move to main area"
                  >
                    ⬅
                  </button>
                  <button
                    onClick={() => handleNotesPositionChange("hidden")}
                    title="Hide notes panel"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="notes-panel-content">
                <Notes isRightPanel={true} onNotesCountChange={setNotesCount} />
              </div>
            </div>
          )}
        </div>
      </div>



      {/* State toggle confirmation dialog */}
      {showStateDialog && (
        <div className="state-dialog-overlay">
          <div className="state-dialog">
            <div className="state-dialog-header">
              <h3>State Management Options</h3>
            </div>
            <div className="state-dialog-content">
              <p className="state-dialog-question">
                What would you like to do with tab state persistence?
              </p>
              <div className="state-dialog-note">
                <p><strong>Tab State Persistence:</strong> Remembers your work across all tabs (open files, terminal history, notes, etc.) when you switch between them.</p>
                <p><strong>Clear States:</strong> Resets all tabs to their default state, removing any saved work or history.</p>
              </div>
              <div className="option-box-container">
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={optionTogglePersistence}
                    onChange={(e) => setOptionTogglePersistence(e.target.checked)}
                  />
                  <span className="option-text">
                    {isPersistent ? 'Disable' : 'Enable'} tab state persistence
                  </span>
                </label>
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={optionClearStates}
                    onChange={(e) => setOptionClearStates(e.target.checked)}
                  />
                  <span className="option-text">
                    Clear all existing saved states
                  </span>
                </label>
              </div>
              <div className="option-box-buttons">
                <button
                  onClick={handleOptionBoxApply}
                  className="option-box-btn apply-btn"
                  disabled={!optionTogglePersistence && !optionClearStates}
                >
                  Apply Changes
                </button>
                <button
                  onClick={handleOptionBoxCancel}
                  className="option-box-btn cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
