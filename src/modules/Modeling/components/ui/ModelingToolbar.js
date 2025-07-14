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
  // Define toolbar sections with dropdowns
  const toolbarSections = {
    selection: {
      title: 'Selection',
      icon: '🎯',
      items: [
        { icon: '🎯', label: 'Select', action: () => setMode('select'), tooltip: 'Select Tool (S)', active: mode === 'select' },
        { icon: '📦', label: 'Box Select', action: () => setMode('box-select'), tooltip: 'Box Select (B)', active: mode === 'box-select' },
        { icon: '⭕', label: 'Circle Select', action: () => setMode('circle-select'), tooltip: 'Circle Select (C)', active: mode === 'circle-select' },
        { icon: '🎨', label: 'Lasso Select', action: () => setMode('lasso-select'), tooltip: 'Lasso Select', active: mode === 'lasso-select' }
      ]
    },

    transform: {
      title: 'Transform',
      icon: '↔️',
      items: [
        { icon: '↔️', label: 'Move', action: () => setMode('translate'), tooltip: 'Move/Grab (G)', active: mode === 'translate' },
        { icon: '🔄', label: 'Rotate', action: () => setMode('rotate'), tooltip: 'Rotate (R)', active: mode === 'rotate' },
        { icon: '📏', label: 'Scale', action: () => setMode('scale'), tooltip: 'Scale (S)', active: mode === 'scale' },
        { icon: '🎛️', label: 'Transform', action: () => setMode('transform'), tooltip: 'Transform Tool', active: mode === 'transform' }
      ]
    },

    primitives: {
      title: 'Add Primitives',
      icon: '🧊',
      items: [
        { icon: '🧊', label: 'Cube', action: () => onAddObject("cube", { color: 0x3498db }), tooltip: 'Add Cube' },
        { icon: '⚪', label: 'Sphere', action: () => onAddObject("sphere", { color: 0xe74c3c }), tooltip: 'Add UV Sphere' },
        { icon: '🔷', label: 'Ico Sphere', action: () => onAddObject("icosahedron", { color: 0x9b59b6 }), tooltip: 'Add Ico Sphere' },
        { icon: '🥫', label: 'Cylinder', action: () => onAddObject("cylinder", { color: 0x2ecc71 }), tooltip: 'Add Cylinder' },
        { icon: '🔺', label: 'Cone', action: () => onAddObject("cone", { color: 0xf39c12 }), tooltip: 'Add Cone' },
        { icon: '🍩', label: 'Torus', action: () => onAddObject("torus", { color: 0x1abc9c }), tooltip: 'Add Torus' },
        { icon: '⬜', label: 'Plane', action: () => onAddObject("plane", { color: 0x95a5a6 }), tooltip: 'Add Plane' },
        { icon: '🐵', label: 'Monkey', action: () => onAddObject("monkey", { color: 0xe67e22 }), tooltip: 'Add Suzanne (Monkey)' }
      ]
    },

    meshEdit: {
      title: 'Mesh Editing',
      icon: '⬆️',
      items: [
        { icon: '⬆️', label: 'Extrude', action: () => onExtrudeSelected(), tooltip: 'Extrude Faces (E)', disabled: !selectedObject },
        { icon: '📐', label: 'Inset', action: () => onInsetSelected(), tooltip: 'Inset Faces (I)', disabled: !selectedObject },
        { icon: '🔄', label: 'Bevel', action: () => onBevelSelected(), tooltip: 'Bevel (Ctrl+B)', disabled: !selectedObject },
        { icon: '✂️', label: 'Loop Cut', action: () => onLoopCutSelected(), tooltip: 'Loop Cut (Ctrl+R)', disabled: !selectedObject },
        { icon: '🔪', label: 'Knife', action: () => onKnifeSelected(), tooltip: 'Knife Tool (K)', disabled: !selectedObject },
        { icon: '🔗', label: 'Merge', action: () => onMergeSelected(), tooltip: 'Merge Vertices (Alt+M)', disabled: !selectedObject },
        { icon: '✂️', label: 'Separate', action: () => onSeparateSelected(), tooltip: 'Separate (P)', disabled: !selectedObject },
        { icon: '⚔️', label: 'Bisect', action: () => onBisectSelected(), tooltip: 'Bisect Tool', disabled: !selectedObject },
        { icon: '🌀', label: 'Spin', action: () => onSpinSelected(), tooltip: 'Spin Tool', disabled: !selectedObject },
        { icon: '🔩', label: 'Screw', action: () => onScrewSelected(), tooltip: 'Screw Tool', disabled: !selectedObject }
      ]
    },

    advancedMesh: {
      title: 'Advanced Mesh',
      icon: '🌉',
      items: [
        { icon: '🌉', label: 'Bridge', action: () => onBridgeSelected(), tooltip: 'Bridge Edge Loops', disabled: !selectedObject },
        { icon: '🔲', label: 'Fill', action: () => onFillSelected(), tooltip: 'Fill Faces (F)', disabled: !selectedObject },
        { icon: '🔺', label: 'Triangulate', action: () => onTriangulateSelected(), tooltip: 'Triangulate (Ctrl+T)', disabled: !selectedObject },
        { icon: '⬜', label: 'Quadify', action: () => onQuadifySelected(), tooltip: 'Tris to Quads (Alt+J)', disabled: !selectedObject },
        { icon: '📦', label: 'Solidify', action: () => onSolidifySelected(), tooltip: 'Solidify Faces', disabled: !selectedObject },
        { icon: '🕸️', label: 'Wireframe', action: () => onWireframeSelected(), tooltip: 'Wireframe', disabled: !selectedObject },
        { icon: '📉', label: 'Decimate', action: () => onDecimateSelected(), tooltip: 'Decimate Geometry', disabled: !selectedObject },
        { icon: '🔄', label: 'Remesh', action: () => onRemeshSelected(), tooltip: 'Remesh', disabled: !selectedObject },
        { icon: '🌊', label: 'Smooth', action: () => onSmoothSelected(), tooltip: 'Smooth Vertices', disabled: !selectedObject }
      ]
    },

    modifiers: {
      title: 'Modifiers',
      icon: '📈',
      items: [
        { icon: '📈', label: 'Subsurf', action: () => onSubsurfSelected(), tooltip: 'Subdivision Surface', disabled: !selectedObject },
        { icon: '🪞', label: 'Mirror', action: () => onMirrorSelected(), tooltip: 'Mirror Modifier', disabled: !selectedObject },
        { icon: '📋', label: 'Array', action: () => onArraySelected(), tooltip: 'Array Modifier', disabled: !selectedObject },
        { icon: '🔩', label: 'Screw Mod', action: () => onScrewModSelected(), tooltip: 'Screw Modifier', disabled: !selectedObject },
        { icon: '🔄', label: 'Bevel Mod', action: () => onBevelModSelected(), tooltip: 'Bevel Modifier', disabled: !selectedObject },
        { icon: '🌊', label: 'Displace', action: () => onDisplaceSelected(), tooltip: 'Displace Modifier', disabled: !selectedObject },
        { icon: '🕸️', label: 'Lattice', action: () => onLatticeSelected(), tooltip: 'Lattice Modifier', disabled: !selectedObject },
        { icon: '📈', label: 'Curve', action: () => onCurveSelected(), tooltip: 'Curve Modifier', disabled: !selectedObject },
        { icon: '🪝', label: 'Hook', action: () => onHookSelected(), tooltip: 'Hook Modifier', disabled: !selectedObject },
        { icon: '🌊', label: 'Laplacian', action: () => onLaplacianSelected(), tooltip: 'Laplacian Smooth', disabled: !selectedObject }
      ]
    },

    deformation: {
      title: 'Deformation',
      icon: '🎭',
      items: [
        { icon: '🎭', label: 'Cast', action: () => onCastSelected(), tooltip: 'Cast Modifier', disabled: !selectedObject },
        { icon: '🌊', label: 'Wave', action: () => onWaveSelected(), tooltip: 'Wave Modifier', disabled: !selectedObject },
        { icon: '🦴', label: 'Armature', action: () => onArmatureSelected(), tooltip: 'Armature Modifier', disabled: !selectedObject },
        { icon: '🎭', label: 'Mask', action: () => onMaskSelected(), tooltip: 'Mask Modifier', disabled: !selectedObject },
        { icon: '🧲', label: 'Shrinkwrap', action: () => onShrinkwrapSelected(), tooltip: 'Shrinkwrap Modifier', disabled: !selectedObject },
        { icon: '🔧', label: 'Simple Deform', action: () => onSimpleDeformSelected(), tooltip: 'Simple Deform', disabled: !selectedObject },
        { icon: '🧬', label: 'Skin', action: () => onSkinSelected(), tooltip: 'Skin Modifier', disabled: !selectedObject },
        { icon: '📦', label: 'Solidify Mod', action: () => onSolidifyModSelected(), tooltip: 'Solidify Modifier', disabled: !selectedObject },
        { icon: '📏', label: 'Thickness', action: () => onThicknessSelected(), tooltip: 'Thickness Modifier', disabled: !selectedObject },
        { icon: '🔺', label: 'Triangulate Mod', action: () => onTriangulateModSelected(), tooltip: 'Triangulate Modifier', disabled: !selectedObject },
        { icon: '🔗', label: 'Weld', action: () => onWeldSelected(), tooltip: 'Weld Modifier', disabled: !selectedObject },
        { icon: '🕸️', label: 'Wireframe Mod', action: () => onWireframeModSelected(), tooltip: 'Wireframe Modifier', disabled: !selectedObject }
      ]
    },

    editMode: {
      title: 'Edit Mode',
      icon: '📍',
      items: [
        { icon: '📍', label: 'Vertex', action: () => setMode('vertex'), tooltip: 'Vertex Select Mode (1)', active: mode === 'vertex' },
        { icon: '📏', label: 'Edge', action: () => setMode('edge'), tooltip: 'Edge Select Mode (2)', active: mode === 'edge' },
        { icon: '⬜', label: 'Face', action: () => setMode('face'), tooltip: 'Face Select Mode (3)', active: mode === 'face' }
      ]
    },

    utilities: {
      title: 'Utilities',
      icon: '🗑️',
      items: [
        { icon: '🗑️', label: 'Delete', action: onDeleteSelected, disabled: !selectedObject, tooltip: 'Delete (X)' },
        { icon: '📋', label: 'Duplicate', action: onDuplicateSelected, disabled: !selectedObject, tooltip: 'Duplicate (Shift+D)' },
        { icon: '🔀', label: 'Subdivide', action: onSubdivideSelected, disabled: !selectedObject, tooltip: 'Subdivide' },
        { icon: '🕸️', label: 'Wireframe', action: onToggleWireframe, disabled: !selectedObject, tooltip: 'Toggle Wireframe' },
        { icon: '🧲', label: 'Snap to Grid', action: () => setSnapToGrid(!snapToGrid), tooltip: 'Snap to Grid', active: snapToGrid }
      ]
    },

    viewport: {
      title: 'Viewport',
      icon: '🎥',
      items: [
        { icon: '🎥', label: 'Camera View', action: () => setMode('camera'), tooltip: 'Camera View (Numpad 0)', active: mode === 'camera' },
        { icon: '⬆️', label: 'Top View', action: () => setMode('top'), tooltip: 'Top View (Numpad 7)', active: mode === 'top' },
        { icon: '➡️', label: 'Front View', action: () => setMode('front'), tooltip: 'Front View (Numpad 1)', active: mode === 'front' },
        { icon: '↗️', label: 'Right View', action: () => setMode('right'), tooltip: 'Right View (Numpad 3)', active: mode === 'right' },
        { icon: '🔄', label: 'Perspective', action: () => setMode('perspective'), tooltip: 'Toggle Perspective (Numpad 5)', active: mode === 'perspective' }
      ]
    },

    shading: {
      title: 'Shading',
      icon: '🎨',
      items: [
        { icon: '🕸️', label: 'Wireframe', action: () => setMode('wireframe-view'), tooltip: 'Wireframe Shading', active: mode === 'wireframe-view' },
        { icon: '⬜', label: 'Solid', action: () => setMode('solid'), tooltip: 'Solid Shading', active: mode === 'solid' },
        { icon: '🎨', label: 'Material', action: () => setMode('material'), tooltip: 'Material Preview', active: mode === 'material' },
        { icon: '✨', label: 'Rendered', action: () => setMode('rendered'), tooltip: 'Rendered Shading', active: mode === 'rendered' }
      ]
    },

    animation: {
      title: 'Animation',
      icon: '⏯️',
      items: [
        { icon: '⏯️', label: 'Play', action: () => setMode('play'), tooltip: 'Play Animation (Space)' },
        { icon: '⏹️', label: 'Stop', action: () => setMode('stop'), tooltip: 'Stop Animation' },
        { icon: '⏮️', label: 'First Frame', action: () => setMode('first-frame'), tooltip: 'First Frame' },
        { icon: '⏭️', label: 'Last Frame', action: () => setMode('last-frame'), tooltip: 'Last Frame' },
        { icon: '🔑', label: 'Keyframe', action: () => setMode('keyframe'), tooltip: 'Insert Keyframe (I)' }
      ]
    }
  };

  const [openDropdowns, setOpenDropdowns] = React.useState({});

  const toggleDropdown = (sectionKey) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

  const renderDropdownItem = (item, index) => {
    return (
      <button
        key={index}
        className={`dropdown-item ${item.active ? 'active' : ''}`}
        onClick={() => {
          item.action();
          closeAllDropdowns();
        }}
        disabled={item.disabled}
        title={item.tooltip}
      >
        <span className="item-icon">{item.icon}</span>
        <span className="item-label">{item.label}</span>
      </button>
    );
  };

  const renderToolbarSection = (sectionKey, section) => {
    const isOpen = openDropdowns[sectionKey];

    return (
      <div key={sectionKey} className="toolbar-section">
        <button
          className={`section-button ${isOpen ? 'open' : ''}`}
          onClick={() => toggleDropdown(sectionKey)}
          title={section.title}
        >
          <span className="section-icon">{section.icon}</span>
          <span className="dropdown-arrow">▶</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {section.items.map((item, index) => renderDropdownItem(item, index))}
          </div>
        )}
      </div>
    );
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.toolbar-section')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="modeling-toolbar-container">
      <div className="modeling-toolbar-scroll">
        {Object.entries(toolbarSections).map(([sectionKey, section]) =>
          renderToolbarSection(sectionKey, section)
        )}
      </div>
    </div>
  );
};

export default ModelingToolbar;
