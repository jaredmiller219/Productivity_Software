import React, { useState } from "react";
import Sidebar from "./components/Sidebar.js";
import Workspace from "./components/Workspace.js";
import Notes from "./modules/Notes/Notes.js";
import "./App.css";

function App() {
  const [activeModule, setActiveModule] = useState("notes");
  const [notesPosition, setNotesPosition] = useState("main"); // "main", "right", "hidden"
  const [notesPanelWidth, setNotesPanelWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);

  const handleNotesPositionChange = (position) => {
    setNotesPosition(position);
    if (position === "right" && activeModule === "notes") {
      // If notes are moved to right panel and currently active, switch to modeling
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
        />

        <div className="main-content">
          <Workspace
            activeModule={activeModule}
            showNotes={notesPosition === "main"}
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
                <Notes isRightPanel={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
