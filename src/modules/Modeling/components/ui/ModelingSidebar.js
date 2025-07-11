import React from 'react';
import MaterialEditor from '../materials/MaterialEditor.js';
import ModifierStack from '../modifiers/ModifierStack.js';
import AnimationTimeline from '../animation/AnimationTimeline.js';
import RiggingSystem from '../rigging/RiggingSystem.js';
import AnimationCurves from '../animation/AnimationCurves.js';
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

  const renderRiggingPanel = () => (
    <div className="rigging-panel">
      <RiggingSystem
        selectedObject={selectedObject}
        onArmatureCreate={(armature) => console.log('Create armature:', armature)}
        onBoneAdd={(armatureId, bone) => console.log('Add bone:', armatureId, bone)}
        onBoneRemove={(armatureId, boneId) => console.log('Remove bone:', armatureId, boneId)}
        onBoneUpdate={(armatureId, boneId, property, value) => console.log('Update bone:', armatureId, boneId, property, value)}
        onConstraintAdd={(armatureId, boneId, constraint) => console.log('Add constraint:', armatureId, boneId, constraint)}
        onConstraintRemove={(armatureId, boneId, constraintId) => console.log('Remove constraint:', armatureId, boneId, constraintId)}
        onWeightPaint={(enabled) => console.log('Weight paint mode:', enabled)}
        armatures={[]}
        selectedArmature={null}
        onArmatureSelect={(armature) => console.log('Select armature:', armature)}
      />
    </div>
  );

  const renderAnimationPanel = () => (
    <div className="animation-panel">
      <div className="animation-tabs">
        <div className="animation-tab-content">
          <div className="timeline-section">
            <AnimationTimeline
              selectedObject={selectedObject}
              onKeyframeAdd={(object, keyframe) => console.log('Add keyframe:', object, keyframe)}
              onKeyframeDelete={(object, keyframeId) => console.log('Delete keyframe:', object, keyframeId)}
              onKeyframeUpdate={(object, keyframeId, updates) => console.log('Update keyframe:', object, keyframeId, updates)}
              onTimelineUpdate={(data) => console.log('Timeline update:', data)}
              animationData={{}}
              isPlaying={false}
              currentFrame={1}
              totalFrames={250}
              frameRate={24}
              onPlayPause={() => console.log('Play/Pause')}
              onFrameChange={(frame) => console.log('Frame change:', frame)}
              onFrameRateChange={(fps) => console.log('FPS change:', fps)}
              onTotalFramesChange={(frames) => console.log('Total frames change:', frames)}
            />
          </div>

          <div className="curves-section">
            <AnimationCurves
              selectedObject={selectedObject}
              keyframes={{}}
              onCurveUpdate={(curveId, updates) => console.log('Curve update:', curveId, updates)}
              currentFrame={1}
              totalFrames={250}
            />
          </div>
        </div>
      </div>
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



  const renderPanelContent = () => {
    switch (activePanel) {
      case "objects":
        return renderObjectsPanel();
      case "materials":
        return renderMaterialsPanel();
      case "modifiers":
        return renderModifiersPanel();
      case "rigging":
        return renderRiggingPanel();
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
          className={activePanel === "rigging" ? "active" : ""}
          onClick={() => setActivePanel("rigging")}
        >
          Rigging
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
