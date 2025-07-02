import React from "react";
import "./Sidebar.css";

function Sidebar({ activeModule, setActiveModule }) {
  const modules = [
    { id: "notes", name: "Notes" },
    { id: "terminal", name: "Terminal" },
    { id: "browser", name: "Browser" },
    { id: "ide", name: "IDE" },
    { id: "modeling", name: "3D Modeling" },
  ];

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
            }`}
            onClick={() => setActiveModule(module.id)}
          >
            {module.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
