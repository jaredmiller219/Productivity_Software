import React from "react";
import "./Sidebar.css";

function Sidebar({ activeModule, setActiveModule, notesPosition, onNotesPositionChange }) {
  const modules = [
    { id: "notes", name: "Notes" },
    { id: "terminal", name: "Terminal" },
    { id: "browser", name: "Browser" },
    { id: "ide", name: "IDE" },
    { id: "modeling", name: "3D Modeling" },
  ];

  const handleModuleClick = (moduleId) => {
    if (moduleId === "notes" && notesPosition === "right") {
      // If notes is in right panel, bring it back to main
      onNotesPositionChange("main");
    }
    setActiveModule(moduleId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dev Suite</h2>
      </div>
      <div className="sidebar-modules">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`sidebar-module ${
              activeModule === module.id ? "active" : ""
            } ${module.id === "notes" && notesPosition === "right" ? "docked-right" : ""}`}
            onClick={() => handleModuleClick(module.id)}
          >
            <span className="module-name">{module.name}</span>
            {module.id === "notes" && (
              <div className="notes-controls" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`position-btn ${notesPosition === "main" ? "active" : ""}`}
                  onClick={() => {
                    onNotesPositionChange("main");
                    setActiveModule("notes");
                  }}
                  title="Main area"
                >
                  📝
                </button>
                <button
                  className={`position-btn ${notesPosition === "right" ? "active" : ""}`}
                  onClick={() => onNotesPositionChange("right")}
                  title="Right panel"
                >
                  📌
                </button>
                {notesPosition === "hidden" && (
                  <button
                    className="position-btn"
                    onClick={() => onNotesPositionChange("right")}
                    title="Show notes"
                  >
                    👁
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {notesPosition === "hidden" && (
        <div className="sidebar-footer">
          <button
            className="show-notes-btn"
            onClick={() => onNotesPositionChange("right")}
          >
            📝 Show Notes
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
