import { useRef } from "react";
import ModelingToolbar from "./components/ModelingToolbar.js";
import ModelingSidebar from "./components/ModelingSidebar.js";
import { useModelingScene } from "./hooks/useModelingScene.js";
import "./Modeling.css";

function Modeling() {
  const containerRef = useRef(null);

  const {
    selectedObject,
    mode,
    objects,
    lights,
    activePanel,
    snapToGrid,
    setMode,
    setActivePanel,
    setSnapToGrid,
    addObject,
    selectObject,
    deleteSelected,
    duplicateSelected,
    subdivideSelected,
    changeMaterial,
    toggleWireframe,
    toggleAnimation
  } = useModelingScene(containerRef);

  return (
    <div className="modeling-container">
      {/* Scrolling Toolbar */}
      <ModelingToolbar
        mode={mode}
        setMode={setMode}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        selectedObject={selectedObject}
        onAddObject={addObject}
        onDeleteSelected={deleteSelected}
        onDuplicateSelected={duplicateSelected}
        onSubdivideSelected={subdivideSelected}
        onToggleWireframe={toggleWireframe}
      />

      <div className="modeling-workspace">
        {/* Side Panel */}
        <ModelingSidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          objects={objects}
          selectedObject={selectedObject}
          lights={lights}
          onSelectObject={selectObject}
          onChangeMaterial={changeMaterial}
          onToggleAnimation={toggleAnimation}
        />

        {/* Main Canvas */}
        <div className="modeling-canvas" ref={containerRef}></div>
      </div>
    </div>
  );
}

export default Modeling;
