import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({ activeModule, setActiveModule, notesPosition, onNotesPositionChange, notesCount }) {
  const [showNotesMenu, setShowNotesMenu] = useState(false);
  const modules = [
    { id: "notes", name: "Notes", icon: "📝" },
    { id: "terminal", name: "Terminal", icon: "⚡" },
    { id: "browser", name: "Browser", icon: "🌐" },
    { id: "ide", name: "IDE", icon: "💻" },
    { id: "modeling", name: "3D Modeling", icon: "🎨" },
  ];

  const handleModuleClick = (moduleId, event) => {
    if (moduleId === "notes" && event.button === 2) {
      // Right click on notes - show context menu
      event.preventDefault();
      setShowNotesMenu(true);
      return;
    }

    if (moduleId === "notes" && notesPosition === "right") {
      // If notes is in right panel, bring it back to main
      onNotesPositionChange("main");
    }
    setActiveModule(moduleId);
    setShowNotesMenu(false);
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
            onClick={(e) => handleModuleClick(module.id, e)}
            onContextMenu={(e) => {
              if (module.id === "notes") {
                e.preventDefault();
                setShowNotesMenu(true);
              }
            }}
          >
            <span className="module-icon" title={module.name}>
              {module.icon}
            </span>
            {module.id === "notes" && notesPosition === "right" && (
              <div className="notes-indicator" title="Notes docked to right panel">
                <span className="dock-indicator">📌</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {notesPosition === "hidden" && notesCount > 0 && (
        <div className="sidebar-footer">
          <button
            className="show-notes-btn"
            onClick={() => onNotesPositionChange("right")}
            title="Show Notes Panel"
          >
            📝
          </button>
        </div>
      )}

      {showNotesMenu && (
        <div className="notes-context-menu" onClick={() => setShowNotesMenu(false)}>
          <div className="context-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="context-menu-header">📝 Notes Position</div>
            <button
              className={`context-menu-item ${notesPosition === "main" ? "active" : ""}`}
              onClick={() => {
                onNotesPositionChange("main");
                setActiveModule("notes");
                setShowNotesMenu(false);
              }}
            >
              📄 Main Area
            </button>
            <button
              className={`context-menu-item ${notesPosition === "right" ? "active" : ""}`}
              onClick={() => {
                onNotesPositionChange("right");
                setShowNotesMenu(false);
              }}
            >
              📌 Right Panel
            </button>
            <button
              className="context-menu-item"
              onClick={() => {
                onNotesPositionChange("hidden");
                setShowNotesMenu(false);
              }}
            >
              👁️ Hide Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
