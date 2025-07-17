import { useRef, useState } from "react";
import BlenderMenuBar from "./components/ui/BlenderMenuBar.js";
import ModelingToolbar from "./components/ui/ModelingToolbar.js";
import ModelingSidebar from "./components/ui/ModelingSidebar.js";
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

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Menu bar action handlers
  const handleFileAction = (action, data) => {
    console.log('File action:', action, data);
    // Implement file operations
  };

  const handleEditAction = (action, data) => {
    console.log('Edit action:', action, data);
    switch (action) {
      case 'duplicate':
        duplicateSelected();
        break;
      case 'delete':
        deleteSelected();
        break;
      default:
        // Implement other edit operations
        break;
    }
  };

  const handleAddAction = (category, type) => {
    console.log('Add action:', category, type);
    if (category === 'mesh') {
      addObject(type);
    }
    // Implement other add operations
  };

  const handleMeshAction = (category, action) => {
    console.log('Mesh action:', category, action);
    // Implement mesh operations
  };

  const handleObjectAction = (category, action) => {
    console.log('Object action:', category, action);
    // Implement object operations
  };

  const handleSelectAction = (action, data) => {
    console.log('Select action:', action, data);
    // Implement selection operations
  };

  const handleViewAction = (action, data) => {
    console.log('View action:', action, data);
    // Implement view operations
  };

  const handleRenderAction = (action, data) => {
    console.log('Render action:', action, data);
    // Implement render operations
  };

  const handleWindowAction = (action) => {
    console.log('Window action:', action);
    // Implement window operations
  };

  const handleHelpAction = (action, data) => {
    console.log('Help action:', action, data);
    // Implement help operations
  };

  // Placeholder functions for new toolbar features
  const handleExtrudeSelected = () => console.log('Extrude selected');
  const handleInsetSelected = () => console.log('Inset selected');
  const handleBevelSelected = () => console.log('Bevel selected');
  const handleLoopCutSelected = () => console.log('Loop cut selected');
  const handleKnifeSelected = () => console.log('Knife selected');
  const handleMergeSelected = () => console.log('Merge selected');
  const handleSeparateSelected = () => console.log('Separate selected');
  const handleBisectSelected = () => console.log('Bisect selected');
  const handleSpinSelected = () => console.log('Spin selected');
  const handleScrewSelected = () => console.log('Screw selected');
  const handleBridgeSelected = () => console.log('Bridge selected');
  const handleFillSelected = () => console.log('Fill selected');
  const handleTriangulateSelected = () => console.log('Triangulate selected');
  const handleQuadifySelected = () => console.log('Quadify selected');
  const handleSolidifySelected = () => console.log('Solidify selected');
  const handleWireframeSelected = () => console.log('Wireframe selected');
  const handleDecimateSelected = () => console.log('Decimate selected');
  const handleRemeshSelected = () => console.log('Remesh selected');
  const handleSmoothSelected = () => console.log('Smooth selected');
  const handleSubsurfSelected = () => console.log('Subsurf selected');
  const handleMirrorSelected = () => console.log('Mirror selected');
  const handleArraySelected = () => console.log('Array selected');
  const handleScrewModSelected = () => console.log('Screw mod selected');
  const handleBevelModSelected = () => console.log('Bevel mod selected');
  const handleDisplaceSelected = () => console.log('Displace selected');
  const handleLatticeSelected = () => console.log('Lattice selected');
  const handleCurveSelected = () => console.log('Curve selected');
  const handleHookSelected = () => console.log('Hook selected');
  const handleLaplacianSelected = () => console.log('Laplacian selected');
  const handleCastSelected = () => console.log('Cast selected');
  const handleWaveSelected = () => console.log('Wave selected');
  const handleArmatureSelected = () => console.log('Armature selected');
  const handleMaskSelected = () => console.log('Mask selected');
  const handleShrinkwrapSelected = () => console.log('Shrinkwrap selected');
  const handleSimpleDeformSelected = () => console.log('Simple deform selected');
  const handleSkinSelected = () => console.log('Skin selected');
  const handleSolidifyModSelected = () => console.log('Solidify mod selected');
  const handleThicknessSelected = () => console.log('Thickness selected');
  const handleTriangulateModSelected = () => console.log('Triangulate mod selected');
  const handleWeldSelected = () => console.log('Weld selected');
  const handleWireframeModSelected = () => console.log('Wireframe mod selected');

  return (
    <div className="modeling-container">
      {/* Blender-like Menu Bar */}
      <BlenderMenuBar
        onFileAction={handleFileAction}
        onEditAction={handleEditAction}
        onAddAction={handleAddAction}
        onMeshAction={handleMeshAction}
        onObjectAction={handleObjectAction}
        onSelectAction={handleSelectAction}
        onViewAction={handleViewAction}
        onRenderAction={handleRenderAction}
        onWindowAction={handleWindowAction}
        onHelpAction={handleHelpAction}
        selectedObject={selectedObject}
        scene={objects}
      />

      {/* Comprehensive Scrolling Toolbar */}
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
        onExtrudeSelected={handleExtrudeSelected}
        onInsetSelected={handleInsetSelected}
        onBevelSelected={handleBevelSelected}
        onLoopCutSelected={handleLoopCutSelected}
        onKnifeSelected={handleKnifeSelected}
        onMergeSelected={handleMergeSelected}
        onSeparateSelected={handleSeparateSelected}
        onBisectSelected={handleBisectSelected}
        onSpinSelected={handleSpinSelected}
        onScrewSelected={handleScrewSelected}
        onBridgeSelected={handleBridgeSelected}
        onFillSelected={handleFillSelected}
        onTriangulateSelected={handleTriangulateSelected}
        onQuadifySelected={handleQuadifySelected}
        onSolidifySelected={handleSolidifySelected}
        onWireframeSelected={handleWireframeSelected}
        onDecimateSelected={handleDecimateSelected}
        onRemeshSelected={handleRemeshSelected}
        onSmoothSelected={handleSmoothSelected}
        onSubsurfSelected={handleSubsurfSelected}
        onMirrorSelected={handleMirrorSelected}
        onArraySelected={handleArraySelected}
        onScrewModSelected={handleScrewModSelected}
        onBevelModSelected={handleBevelModSelected}
        onDisplaceSelected={handleDisplaceSelected}
        onLatticeSelected={handleLatticeSelected}
        onCurveSelected={handleCurveSelected}
        onHookSelected={handleHookSelected}
        onLaplacianSelected={handleLaplacianSelected}
        onCastSelected={handleCastSelected}
        onWaveSelected={handleWaveSelected}
        onArmatureSelected={handleArmatureSelected}
        onMaskSelected={handleMaskSelected}
        onShrinkwrapSelected={handleShrinkwrapSelected}
        onSimpleDeformSelected={handleSimpleDeformSelected}
        onSkinSelected={handleSkinSelected}
        onSolidifyModSelected={handleSolidifyModSelected}
        onThicknessSelected={handleThicknessSelected}
        onTriangulateModSelected={handleTriangulateModSelected}
        onWeldSelected={handleWeldSelected}
        onWireframeModSelected={handleWireframeModSelected}
      />

      <div className="modeling-workspace">
        {/* Main Canvas - always full width */}
        <div className="modeling-canvas" ref={containerRef}></div>

        {/* Collapsible Side Panel - overlay when collapsed */}
        {!sidebarCollapsed && (
          <div className="sidebar-container expanded">
            <div className="sidebar-header-modeling">
              <span className="sidebar-title">Properties</span>
              <button
                className="collapse-button"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar"
              >
                ✕
              </button>
            </div>
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
          </div>
        )}

        {/* Floating Nub - overlay when collapsed */}
        {sidebarCollapsed && (
          <div className="sidebar-nub-overlay" onClick={() => setSidebarCollapsed(false)}>
            <div className="nub-icon">📋</div>
            <div className="nub-text">Panels</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modeling;
