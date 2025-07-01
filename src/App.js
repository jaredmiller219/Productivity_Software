import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";
import "./App.css";

function App() {
  const [activeModule, setActiveModule] = useState("notes");

  return (
    <div className="App">
      <div className="app-container">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
        <Workspace activeModule={activeModule} />
      </div>
    </div>
  );
}

export default App;
