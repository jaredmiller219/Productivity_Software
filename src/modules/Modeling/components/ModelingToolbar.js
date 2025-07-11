import React from 'react';
import './ModelingToolbar.css';

const ModelingToolbar = ({
  mode,
  setMode,
  snapToGrid,
  setSnapToGrid,
  selectedObject,
  onAddObject,
  onDeleteSelected,
  onDuplicateSelected,
  onSubdivideSelected,
  onToggleWireframe,
  onExtrudeSelected,
  onInsetSelected,
  onBevelSelected,
  onLoopCutSelected,
  onKnifeSelected,
  onMergeSelected,
  onSeparateSelected,
  onBisectSelected,
  onSpinSelected,
  onScrewSelected,
  onBridgeSelected,
  onFillSelected,
  onTriangulateSelected,
  onQuadifySelected,
  onSolidifySelected,
  onWireframeSelected,
  onDecimateSelected,
  onRemeshSelected,
  onSmoothSelected,
  onSubsurfSelected,
  onMirrorSelected,
  onArraySelected,
  onScrewModSelected,
  onBevelModSelected,
  onDisplaceSelected,
  onLatticeSelected,
  onCurveSelected,
  onHookSelected,
  onLaplacianSelected,
  onCastSelected,
  onWaveSelected,
  onArmatureSelected,
  onMaskSelected,
  onShrinkwrapSelected,
  onSimpleDeformSelected,
  onSkinSelected,
  onSolidifyModSelected,
  onThicknessSelected,
  onTriangulateModSelected,
  onWeldSelected,
  onWireframeModSelected
}) => {
  // Define comprehensive toolbar items with icons
  const toolbarItems = [
    // Selection Tools
    { type: 'section', title: 'Selection' },
    { type: 'button', icon: '🎯', label: 'Select', action: () => setMode('select'), tooltip: 'Select Tool (S)', active: mode === 'select' },
    { type: 'button', icon: '📦', label: 'Box Select', action: () => setMode('box-select'), tooltip: 'Box Select (B)', active: mode === 'box-select' },
    { type: 'button', icon: '⭕', label: 'Circle Select', action: () => setMode('circle-select'), tooltip: 'Circle Select (C)', active: mode === 'circle-select' },
    { type: 'button', icon: '🎨', label: 'Lasso Select', action: () => setMode('lasso-select'), tooltip: 'Lasso Select', active: mode === 'lasso-select' },

    // Transform Tools
    { type: 'section', title: 'Transform' },
    { type: 'button', icon: '↔️', label: 'Move', action: () => setMode('translate'), tooltip: 'Move/Grab (G)', active: mode === 'translate' },
    { type: 'button', icon: '🔄', label: 'Rotate', action: () => setMode('rotate'), tooltip: 'Rotate (R)', active: mode === 'rotate' },
    { type: 'button', icon: '📏', label: 'Scale', action: () => setMode('scale'), tooltip: 'Scale (S)', active: mode === 'scale' },
    { type: 'button', icon: '🎛️', label: 'Transform', action: () => setMode('transform'), tooltip: 'Transform Tool', active: mode === 'transform' },

    // Add Primitives
    { type: 'section', title: 'Add Primitives' },
    { type: 'button', icon: '🧊', label: 'Cube', action: () => onAddObject("cube", { color: 0x3498db }), tooltip: 'Add Cube' },
    { type: 'button', icon: '⚪', label: 'Sphere', action: () => onAddObject("sphere", { color: 0xe74c3c }), tooltip: 'Add UV Sphere' },
    { type: 'button', icon: '🔷', label: 'Ico Sphere', action: () => onAddObject("icosahedron", { color: 0x9b59b6 }), tooltip: 'Add Ico Sphere' },
    { type: 'button', icon: '🥫', label: 'Cylinder', action: () => onAddObject("cylinder", { color: 0x2ecc71 }), tooltip: 'Add Cylinder' },
    { type: 'button', icon: '🔺', label: 'Cone', action: () => onAddObject("cone", { color: 0xf39c12 }), tooltip: 'Add Cone' },
    { type: 'button', icon: '🍩', label: 'Torus', action: () => onAddObject("torus", { color: 0x1abc9c }), tooltip: 'Add Torus' },
    { type: 'button', icon: '⬜', label: 'Plane', action: () => onAddObject("plane", { color: 0x95a5a6 }), tooltip: 'Add Plane' },
    { type: 'button', icon: '🐵', label: 'Monkey', action: () => onAddObject("monkey", { color: 0xe67e22 }), tooltip: 'Add Suzanne (Monkey)' },

    // Mesh Editing Tools
    { type: 'section', title: 'Mesh Editing' },
    { type: 'button', icon: '⬆️', label: 'Extrude', action: () => onExtrudeSelected(), tooltip: 'Extrude Faces (E)', disabled: !selectedObject },
    { type: 'button', icon: '📐', label: 'Inset', action: () => onInsetSelected(), tooltip: 'Inset Faces (I)', disabled: !selectedObject },
    { type: 'button', icon: '🔄', label: 'Bevel', action: () => onBevelSelected(), tooltip: 'Bevel (Ctrl+B)', disabled: !selectedObject },
    { type: 'button', icon: '✂️', label: 'Loop Cut', action: () => onLoopCutSelected(), tooltip: 'Loop Cut (Ctrl+R)', disabled: !selectedObject },
    { type: 'button', icon: '🔪', label: 'Knife', action: () => onKnifeSelected(), tooltip: 'Knife Tool (K)', disabled: !selectedObject },
    { type: 'button', icon: '🔗', label: 'Merge', action: () => onMergeSelected(), tooltip: 'Merge Vertices (Alt+M)', disabled: !selectedObject },
    { type: 'button', icon: '✂️', label: 'Separate', action: () => onSeparateSelected(), tooltip: 'Separate (P)', disabled: !selectedObject },
    { type: 'button', icon: '⚔️', label: 'Bisect', action: () => onBisectSelected(), tooltip: 'Bisect Tool', disabled: !selectedObject },
    { type: 'button', icon: '🌀', label: 'Spin', action: () => onSpinSelected(), tooltip: 'Spin Tool', disabled: !selectedObject },
    { type: 'button', icon: '🔩', label: 'Screw', action: () => onScrewSelected(), tooltip: 'Screw Tool', disabled: !selectedObject },

    // Advanced Mesh Tools
    { type: 'section', title: 'Advanced Mesh' },
    { type: 'button', icon: '🌉', label: 'Bridge', action: () => onBridgeSelected(), tooltip: 'Bridge Edge Loops', disabled: !selectedObject },
    { type: 'button', icon: '🔲', label: 'Fill', action: () => onFillSelected(), tooltip: 'Fill Faces (F)', disabled: !selectedObject },
    { type: 'button', icon: '🔺', label: 'Triangulate', action: () => onTriangulateSelected(), tooltip: 'Triangulate (Ctrl+T)', disabled: !selectedObject },
    { type: 'button', icon: '⬜', label: 'Quadify', action: () => onQuadifySelected(), tooltip: 'Tris to Quads (Alt+J)', disabled: !selectedObject },
    { type: 'button', icon: '📦', label: 'Solidify', action: () => onSolidifySelected(), tooltip: 'Solidify Faces', disabled: !selectedObject },
    { type: 'button', icon: '🕸️', label: 'Wireframe', action: () => onWireframeSelected(), tooltip: 'Wireframe', disabled: !selectedObject },
    { type: 'button', icon: '📉', label: 'Decimate', action: () => onDecimateSelected(), tooltip: 'Decimate Geometry', disabled: !selectedObject },
    { type: 'button', icon: '🔄', label: 'Remesh', action: () => onRemeshSelected(), tooltip: 'Remesh', disabled: !selectedObject },
    { type: 'button', icon: '🌊', label: 'Smooth', action: () => onSmoothSelected(), tooltip: 'Smooth Vertices', disabled: !selectedObject },

    // Modifiers
    { type: 'section', title: 'Modifiers' },
    { type: 'button', icon: '📈', label: 'Subsurf', action: () => onSubsurfSelected(), tooltip: 'Subdivision Surface', disabled: !selectedObject },
    { type: 'button', icon: '🪞', label: 'Mirror', action: () => onMirrorSelected(), tooltip: 'Mirror Modifier', disabled: !selectedObject },
    { type: 'button', icon: '📋', label: 'Array', action: () => onArraySelected(), tooltip: 'Array Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🔩', label: 'Screw Mod', action: () => onScrewModSelected(), tooltip: 'Screw Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🔄', label: 'Bevel Mod', action: () => onBevelModSelected(), tooltip: 'Bevel Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🌊', label: 'Displace', action: () => onDisplaceSelected(), tooltip: 'Displace Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🕸️', label: 'Lattice', action: () => onLatticeSelected(), tooltip: 'Lattice Modifier', disabled: !selectedObject },
    { type: 'button', icon: '📈', label: 'Curve', action: () => onCurveSelected(), tooltip: 'Curve Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🪝', label: 'Hook', action: () => onHookSelected(), tooltip: 'Hook Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🌊', label: 'Laplacian', action: () => onLaplacianSelected(), tooltip: 'Laplacian Smooth', disabled: !selectedObject },

    // Deformation Modifiers
    { type: 'section', title: 'Deformation' },
    { type: 'button', icon: '🎭', label: 'Cast', action: () => onCastSelected(), tooltip: 'Cast Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🌊', label: 'Wave', action: () => onWaveSelected(), tooltip: 'Wave Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🦴', label: 'Armature', action: () => onArmatureSelected(), tooltip: 'Armature Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🎭', label: 'Mask', action: () => onMaskSelected(), tooltip: 'Mask Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🧲', label: 'Shrinkwrap', action: () => onShrinkwrapSelected(), tooltip: 'Shrinkwrap Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🔧', label: 'Simple Deform', action: () => onSimpleDeformSelected(), tooltip: 'Simple Deform', disabled: !selectedObject },
    { type: 'button', icon: '🧬', label: 'Skin', action: () => onSkinSelected(), tooltip: 'Skin Modifier', disabled: !selectedObject },
    { type: 'button', icon: '📦', label: 'Solidify Mod', action: () => onSolidifyModSelected(), tooltip: 'Solidify Modifier', disabled: !selectedObject },
    { type: 'button', icon: '📏', label: 'Thickness', action: () => onThicknessSelected(), tooltip: 'Thickness Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🔺', label: 'Triangulate Mod', action: () => onTriangulateModSelected(), tooltip: 'Triangulate Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🔗', label: 'Weld', action: () => onWeldSelected(), tooltip: 'Weld Modifier', disabled: !selectedObject },
    { type: 'button', icon: '🕸️', label: 'Wireframe Mod', action: () => onWireframeModSelected(), tooltip: 'Wireframe Modifier', disabled: !selectedObject },

    // Edit Mode Tools
    { type: 'section', title: 'Edit Mode' },
    { type: 'button', icon: '📍', label: 'Vertex', action: () => setMode('vertex'), tooltip: 'Vertex Select Mode (1)', active: mode === 'vertex' },
    { type: 'button', icon: '📏', label: 'Edge', action: () => setMode('edge'), tooltip: 'Edge Select Mode (2)', active: mode === 'edge' },
    { type: 'button', icon: '⬜', label: 'Face', action: () => setMode('face'), tooltip: 'Face Select Mode (3)', active: mode === 'face' },

    // Utilities
    { type: 'section', title: 'Utilities' },
    { type: 'button', icon: '🗑️', label: 'Delete', action: onDeleteSelected, disabled: !selectedObject, tooltip: 'Delete (X)' },
    { type: 'button', icon: '📋', label: 'Duplicate', action: onDuplicateSelected, disabled: !selectedObject, tooltip: 'Duplicate (Shift+D)' },
    { type: 'button', icon: '🔀', label: 'Subdivide', action: onSubdivideSelected, disabled: !selectedObject, tooltip: 'Subdivide' },
    { type: 'button', icon: '🕸️', label: 'Wireframe', action: onToggleWireframe, disabled: !selectedObject, tooltip: 'Toggle Wireframe' },
    { type: 'toggle', icon: '🧲', label: 'Snap to Grid', checked: snapToGrid, action: setSnapToGrid, tooltip: 'Snap to Grid' },

    // Viewport Controls
    { type: 'section', title: 'Viewport' },
    { type: 'button', icon: '🎥', label: 'Camera View', action: () => setMode('camera'), tooltip: 'Camera View (Numpad 0)', active: mode === 'camera' },
    { type: 'button', icon: '⬆️', label: 'Top View', action: () => setMode('top'), tooltip: 'Top View (Numpad 7)', active: mode === 'top' },
    { type: 'button', icon: '➡️', label: 'Front View', action: () => setMode('front'), tooltip: 'Front View (Numpad 1)', active: mode === 'front' },
    { type: 'button', icon: '↗️', label: 'Right View', action: () => setMode('right'), tooltip: 'Right View (Numpad 3)', active: mode === 'right' },
    { type: 'button', icon: '🔄', label: 'Perspective', action: () => setMode('perspective'), tooltip: 'Toggle Perspective (Numpad 5)', active: mode === 'perspective' },

    // Shading Modes
    { type: 'section', title: 'Shading' },
    { type: 'button', icon: '🕸️', label: 'Wireframe', action: () => setMode('wireframe-view'), tooltip: 'Wireframe Shading', active: mode === 'wireframe-view' },
    { type: 'button', icon: '⬜', label: 'Solid', action: () => setMode('solid'), tooltip: 'Solid Shading', active: mode === 'solid' },
    { type: 'button', icon: '🎨', label: 'Material', action: () => setMode('material'), tooltip: 'Material Preview', active: mode === 'material' },
    { type: 'button', icon: '✨', label: 'Rendered', action: () => setMode('rendered'), tooltip: 'Rendered Shading', active: mode === 'rendered' },

    // Animation
    { type: 'section', title: 'Animation' },
    { type: 'button', icon: '⏯️', label: 'Play', action: () => setMode('play'), tooltip: 'Play Animation (Space)' },
    { type: 'button', icon: '⏹️', label: 'Stop', action: () => setMode('stop'), tooltip: 'Stop Animation' },
    { type: 'button', icon: '⏮️', label: 'First Frame', action: () => setMode('first-frame'), tooltip: 'First Frame' },
    { type: 'button', icon: '⏭️', label: 'Last Frame', action: () => setMode('last-frame'), tooltip: 'Last Frame' },
    { type: 'button', icon: '🔑', label: 'Keyframe', action: () => setMode('keyframe'), tooltip: 'Insert Keyframe (I)' },
  ];

  const renderToolbarItem = (item, index) => {
    if (item.type === 'section') {
      return (
        <div key={index} className="toolbar-section-header">
          <span>{item.title}</span>
        </div>
      );
    } else if (item.type === 'separator') {
      return <div key={index} className="toolbar-separator" />;
    } else if (item.type === 'button') {
      return (
        <button
          key={index}
          className={`toolbar-btn ${item.active ? 'active' : ''}`}
          onClick={item.action}
          disabled={item.disabled}
          title={item.tooltip}
        >
          <span className="btn-icon">{item.icon}</span>
          <span className="btn-label">{item.label}</span>
        </button>
      );
    } else if (item.type === 'toggle') {
      return (
        <label key={index} className="toolbar-toggle" title={item.tooltip}>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => item.action(e.target.checked)}
          />
          <span className="toggle-icon">{item.icon}</span>
          <span className="toggle-label">{item.label}</span>
        </label>
      );
    }
    return null;
  };

  return (
    <div className="modeling-toolbar-container">
      <div className="modeling-toolbar-scroll">
        {toolbarItems.map(renderToolbarItem)}
      </div>
    </div>
  );
};

export default ModelingToolbar;
