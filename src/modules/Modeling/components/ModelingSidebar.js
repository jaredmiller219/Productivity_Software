import React from 'react';
import MaterialEditor from './MaterialEditor.js';
import ModifierStack from './ModifierStack.js';
import './ModelingSidebar.css';

const ModelingSidebar = ({
  activePanel,
  setActivePanel,
  objects,
  selectedObject,
  lights,
  onSelectObject,
  onChangeMaterial,
  onToggleAnimation
}) => {
  const renderObjectsPanel = () => (
    <div className="objects-panel">
      <h4>Scene Objects ({objects.length})</h4>
      <div className="object-list">
        {objects.map((obj) => (
          <div 
            key={obj.uuid}
            className={`object-item ${selectedObject === obj ? "selected" : ""}`}
            onClick={() => onSelectObject(obj)}
          >
            <span className="object-icon">📦</span>
            <span className="object-name">{obj.name}</span>
            <button 
              className="object-visibility"
              onClick={(e) => {
                e.stopPropagation();
                obj.visible = !obj.visible;
              }}
            >
              {obj.visible ? "👁" : "🚫"}
            </button>
          </div>
        ))}
      </div>
      
      {selectedObject && (
        <div className="object-properties">
          <h5>Properties: {selectedObject.name}</h5>
          <div className="property-group">
            <label>Position</label>
            <div className="vector-input">
              <input 
                type="number" 
                step="0.1" 
                value={selectedObject.position.x.toFixed(2)}
                onChange={(e) => {
                  selectedObject.position.x = parseFloat(e.target.value);
                }}
              />
              <input 
                type="number" 
                step="0.1" 
                value={selectedObject.position.y.toFixed(2)}
                onChange={(e) => {
                  selectedObject.position.y = parseFloat(e.target.value);
                }}
              />
              <input 
                type="number" 
                step="0.1" 
                value={selectedObject.position.z.toFixed(2)}
                onChange={(e) => {
                  selectedObject.position.z = parseFloat(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMaterialsPanel = () => (
    <div className="materials-panel">
      <MaterialEditor
        selectedObject={selectedObject}
        onMaterialChange={onChangeMaterial}
      />
    </div>
  );

  const renderModifiersPanel = () => (
    <div className="modifiers-panel">
      <ModifierStack
        selectedObject={selectedObject}
        onModifierAdd={(modifier) => console.log('Add modifier:', modifier)}
        onModifierRemove={(id) => console.log('Remove modifier:', id)}
        onModifierUpdate={(id, property, value) => console.log('Update modifier:', id, property, value)}
      />
    </div>
  );

  const renderLightingPanel = () => (
    <div className="lighting-panel">
      <h4>Lighting Setup</h4>
      <div className="light-controls">
        <div className="light-item">
          <h5>Ambient Light</h5>
          <label>Intensity:</label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            defaultValue="0.3"
            onChange={(e) => {
              if (lights[0]) lights[0].intensity = parseFloat(e.target.value);
            }}
          />
        </div>
        
        <div className="light-item">
          <h5>Directional Light</h5>
          <label>Intensity:</label>
          <input 
            type="range" 
            min="0" 
            max="3" 
            step="0.1"
            defaultValue="1.0"
            onChange={(e) => {
              if (lights[1]) lights[1].intensity = parseFloat(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderAnimationPanel = () => (
    <div className="animation-panel">
      <h4>Animation Controls</h4>
      {selectedObject && (
        <div className="animation-controls">
          <button onClick={() => onToggleAnimation(selectedObject)}>
            {selectedObject.userData.animated ? "Stop Animation" : "Start Animation"}
          </button>
        </div>
      )}
    </div>
  );

  const renderPanelContent = () => {
    switch (activePanel) {
      case "objects":
        return renderObjectsPanel();
      case "materials":
        return renderMaterialsPanel();
      case "modifiers":
        return renderModifiersPanel();
      case "lighting":
        return renderLightingPanel();
      case "animation":
        return renderAnimationPanel();
      default:
        return renderObjectsPanel();
    }
  };

  return (
    <div className="modeling-sidebar">
      <div className="panel-tabs">
        <button 
          className={activePanel === "objects" ? "active" : ""}
          onClick={() => setActivePanel("objects")}
        >
          Objects
        </button>
        <button
          className={activePanel === "materials" ? "active" : ""}
          onClick={() => setActivePanel("materials")}
        >
          Materials
        </button>
        <button
          className={activePanel === "modifiers" ? "active" : ""}
          onClick={() => setActivePanel("modifiers")}
        >
          Modifiers
        </button>
        <button
          className={activePanel === "lighting" ? "active" : ""}
          onClick={() => setActivePanel("lighting")}
        >
          Lighting
        </button>
        <button 
          className={activePanel === "animation" ? "active" : ""}
          onClick={() => setActivePanel("animation")}
        >
          Animation
        </button>
      </div>

      <div className="panel-content">
        {renderPanelContent()}
      </div>
    </div>
  );
};

export default ModelingSidebar;
